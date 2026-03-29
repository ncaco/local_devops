Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-LastExitCode {
    param(
        [string]$StepName
    )

    if ($LASTEXITCODE -ne 0) {
        throw "$StepName 실패. 종료 코드: $LASTEXITCODE"
    }
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$envExamplePath = Join-Path $backendPath ".env.example"
$envPath = Join-Path $backendPath ".env"

if (-not (Test-Path $backendPath)) {
    throw "backend 폴더를 찾을 수 없습니다: $backendPath"
}

Push-Location $backendPath
try {
    $backendPort = 18000

    if ((-not (Test-Path $envPath)) -and (Test-Path $envExamplePath)) {
        Copy-Item $envExamplePath $envPath
        Write-Host "backend/.env 가 없어 .env.example을 복사했습니다."
    }

    if (Test-Path $envPath) {
        $portLine = Get-Content $envPath | Where-Object { $_ -match '^APP_PORT=' } | Select-Object -First 1
        if ($portLine) {
            $parsedPort = ($portLine -replace '^APP_PORT=', '').Trim()
            if ($parsedPort -match '^\d+$') {
                $backendPort = [int]$parsedPort
            }
        }
    }

    Write-Host "Python 의존성을 동기화합니다."
    uv sync
    Assert-LastExitCode "uv sync"

    Write-Host "Alembic 마이그레이션을 적용합니다."
    uv run alembic upgrade head
    Assert-LastExitCode "Alembic 마이그레이션"

    $existingListener = Get-NetTCPConnection -LocalPort $backendPort -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1

    if ($existingListener) {
        Write-Host "$backendPort 포트를 사용 중인 프로세스(PID $($existingListener.OwningProcess))를 종료합니다."
        Stop-Process -Id $existingListener.OwningProcess -Force
        Start-Sleep -Seconds 1
    }

    Write-Host "Backend server를 $backendPort 포트에서 실행합니다."
    uv run uvicorn app.main:app --reload --port $backendPort
    Assert-LastExitCode "Backend server 실행"
}
finally {
    Pop-Location
}
