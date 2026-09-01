<#
Gera JSON com as models a partir das classes Java em src/main/java/**/entity

Uso:
  powershell -ExecutionPolicy Bypass -File scripts\generate_models_json.ps1

Saída:
  scripts\output\models.json
  scripts\output\models\<Model>.json
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$startDir = Join-Path (Get-Location) 'src\main\java'
if (-not (Test-Path $startDir)) {
    Write-Error "Pasta de origem não encontrada: $startDir"
    exit 1
}

$typeMap = @{
    'string' = 'string'
    'long' = 'integer'
    'integer' = 'integer'
    'int' = 'integer'
    'double' = 'number'
    'float' = 'number'
    'boolean' = 'boolean'
    'localdate' = 'string'
    'localdatetime' = 'string'
}

function Get-TypeMapping {
    param([string]$t)
    $t = $t.Trim()
    $listMatch = [regex]::Match($t, 'List<\s*([^>]+)\s*>')
    if ($listMatch.Success) {
        $inner = Get-TypeMapping $listMatch.Groups[1].Value
        return @{ type = 'array'; items = $inner }
    }
    if ($t.EndsWith('[]')) {
        $inner = Get-TypeMapping ($t.Substring(0,$t.Length-2))
        return @{ type = 'array'; items = $inner }
    }
    # normalize base type (remove generics/array) and lowercase for lookup
    $base = $t -replace '<.*$','' -replace '\[\]$',''
    $baseKey = $base.Trim().ToLower()
    if ($typeMap.ContainsKey($baseKey)) {
        return @{ type = $typeMap[$baseKey] }
    }
    return @{ type = 'object'; javaType = $t }
}

$fieldPattern = '^(?:\s*(?:private|protected|public))\s+([A-Za-z0-9_<>,\s\[\]]+)\s+([A-Za-z0-9_]+)\s*;'
$classPattern = 'public\s+class\s+([A-Za-z0-9_]+)|class\s+([A-Za-z0-9_]+)'

$outRoot = Join-Path (Get-Location) 'scripts\output'
$modelsDir = Join-Path $outRoot 'models'
New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null

$models = @{}

Get-ChildItem -Path $startDir -Recurse -Filter *.java | ForEach-Object {
    $file = $_
    if ($file.FullName -notmatch "\\entity\\") { return }
    $text = Get-Content -Raw -Path $file.FullName

    $cMatch = [regex]::Match($text, $classPattern)
    $className = $null
    if ($cMatch.Success) {
        if ($cMatch.Groups[1].Value) { $className = $cMatch.Groups[1].Value } else { $className = $cMatch.Groups[2].Value }
    }
    if (-not $className) { return }

    $fieldMatches = [regex]::Matches($text, $fieldPattern, 'Multiline')
    $fields = @()
    foreach ($m in $fieldMatches) {
        $jtype = ($m.Groups[1].Value -replace '\s+',' ').Trim()
        $fname = $m.Groups[2].Value
        $typeObj = Get-TypeMapping $jtype
        $fields += @{ name = $fname; javaType = $jtype; type = $typeObj }
    }

    $modelObj = @{ name = $className; fields = $fields; source = $file.FullName }
    $models[$className] = $modelObj

    $perPath = Join-Path $modelsDir ($className + '.json')
    $modelObj | ConvertTo-Json -Depth 10 | Out-File -FilePath $perPath -Encoding utf8
}

# models pode ser um hashtable; ConvertTo-Json converte chaves como propriedades
[Hashtable]$outModels = $models
$outPath = Join-Path $outRoot 'models.json'
$outModels | ConvertTo-Json -Depth 10 | Out-File -FilePath $outPath -Encoding utf8

Write-Output "Gerado: $outPath"
