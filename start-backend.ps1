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
    if ((-not (Test-Path $envPath)) -and (Test-Path $envExamplePath)) {
        Copy-Item $envExamplePath $envPath
        Write-Host "backend/.env 가 없어 .env.example을 복사했습니다."
    }

    Write-Host "Python 의존성을 동기화합니다."
    uv sync
    Assert-LastExitCode "uv sync"

    Write-Host "Alembic 마이그레이션을 적용합니다."
    uv run alembic upgrade head
    Assert-LastExitCode "Alembic 마이그레이션"

    Write-Host "Backend server를 18000 포트에서 실행합니다."
    uv run uvicorn app.main:app --reload --port 18000
    Assert-LastExitCode "Backend server 실행"
}
finally {
    Pop-Location
}
