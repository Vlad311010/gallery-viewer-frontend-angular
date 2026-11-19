param(
    [Parameter(Mandatory = $true)]
    [string]$Target,

    [switch]$Strict
)

$ErrorActionPreference = "Stop"

$source = Join-Path $PSScriptRoot "..\..\dist\gallery-viewer-front-angular\browser"
$source = (Resolve-Path $source).Path

if (-not (Test-Path $source)) {
    throw "Build output not found: $source"
}

$target = [System.IO.Path]::GetFullPath($Target)

if (Test-Path $target) {
    $items = @(Get-ChildItem -LiteralPath $target -Force)

    if ($Strict) {
        throw "Target already exists: $target. Remove -Strict to replace it."
    }

    if ($items.Count -gt 0) {
        Write-Host "`nTarget folder is not empty:" -ForegroundColor Yellow
        Write-Host $target -ForegroundColor Cyan
        Write-Host "`nContents:" -ForegroundColor Yellow

        $items | ForEach-Object {
            $type = if ($_.PSIsContainer) { "[DIR] " } else { "[FILE]" }
            Write-Host "  $type $($_.FullName)"
        }

        Write-Host ""

        $confirmation = Read-Host "Delete the entire target folder contents and continue? (y/N)"

        if ($confirmation -notin @("y", "Y")) {
            Write-Host "Deployment cancelled." -ForegroundColor Yellow
            return
        }
    }

    Remove-Item -LiteralPath $target -Recurse -Force
}

New-Item -ItemType Directory -Path $target -Force | Out-Null

Copy-Item "$source\*" $target -Recurse -Force

Write-Host "Deployed to: $target" -ForegroundColor Green