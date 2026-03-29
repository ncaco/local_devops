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
$databasePath = Join-Path $projectRoot "database"
$envExamplePath = Join-Path $databasePath ".env.example"
$envPath = Join-Path $databasePath ".env"

if (-not (Test-Path $databasePath)) {
    throw "database 폴더를 찾을 수 없습니다: $databasePath"
}

Push-Location $databasePath
try {
    if ((-not (Test-Path $envPath)) -and (Test-Path $envExamplePath)) {
        Copy-Item $envExamplePath $envPath
        Write-Host "database/.env 가 없어 .env.example을 복사했습니다."
    }

    Write-Host "기존 PostgreSQL 컨테이너와 볼륨을 제거합니다."
    docker compose down -v
    Assert-LastExitCode "PostgreSQL 컨테이너 및 볼륨 제거"

    Write-Host "새 PostgreSQL 컨테이너를 생성합니다."
    docker compose up -d
    Assert-LastExitCode "PostgreSQL 재생성"

    Write-Host "현재 컨테이너 상태를 확인합니다."
    docker compose ps
    Assert-LastExitCode "PostgreSQL 컨테이너 상태 확인"
}
finally {
    Pop-Location
}
