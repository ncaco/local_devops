Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $projectRoot "frontend"
$envExamplePath = Join-Path $frontendPath ".env.example"
$envPath = Join-Path $frontendPath ".env.local"

if (-not (Test-Path $frontendPath)) {
    throw "frontend 폴더를 찾을 수 없습니다: $frontendPath"
}

Push-Location $frontendPath
try {
    $frontendPort = 13000

    if (Test-Path $envPath) {
        $portLine = Get-Content $envPath | Where-Object { $_ -match '^PORT=' } | Select-Object -First 1
        if ($portLine) {
            $parsedPort = ($portLine -replace '^PORT=', '').Trim()
            if ($parsedPort -match '^\d+$') {
                $frontendPort = [int]$parsedPort
            }
        }
    }

    $existingListener = Get-NetTCPConnection -LocalPort $frontendPort -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1

    if ($existingListener) {
        Write-Host "$frontendPort 포트를 사용 중인 프로세스(PID $($existingListener.OwningProcess))를 종료합니다."
        Stop-Process -Id $existingListener.OwningProcess -Force
        Start-Sleep -Seconds 1
    }

    if ((-not (Test-Path $envPath)) -and (Test-Path $envExamplePath)) {
        Copy-Item $envExamplePath $envPath
        Write-Host "frontend/.env.local 이 없어 .env.example을 복사했습니다."
    }

    if (-not (Test-Path "node_modules")) {
        Write-Host "node_modules가 없어서 npm install을 먼저 실행합니다."
        npm install
    }

    $lockPath = Join-Path $frontendPath ".next\\dev\\lock"
    if (Test-Path $lockPath) {
        Remove-Item -LiteralPath $lockPath -Force
    }

    $env:PORT = "$frontendPort"
    Write-Host "Frontend dev server를 $frontendPort 포트에서 실행합니다."
    npm run dev
}
finally {
    Pop-Location
}
