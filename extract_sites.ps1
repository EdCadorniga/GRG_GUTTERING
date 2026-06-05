<#
.SYNOPSIS
    Extracts site objects from the n8n execution output file,
    excluding the TOTAL summary row.
.DESCRIPTION
    Reads the execution JSON, navigates to the "Extract Sites" node output,
    and returns an array of site objects (without the TOTAL row).
    Output is saved as JSON to stdout and optionally to a file.
#>

param(
    [string]$InputFile = "C:\Users\edmon\.local\share\opencode\tool-output\tool_e87698e64001VLEvl9L53798h2",
    [string]$OutputFile = $null
)

$ErrorActionPreference = "Stop"

# 1. Read and parse the execution output JSON
Write-Information "Reading execution output from: $InputFile"
$raw = Get-Content -LiteralPath $InputFile -Raw | ConvertFrom-Json

# 2. Navigate to Extract Sites node data
$extractSitesNode = $raw.data.resultData.runData.'Extract Sites'
if (-not $extractSitesNode) {
    throw "Could not find 'Extract Sites' node in execution output"
}

$execution = $extractSitesNode[0]
Write-Information "Extract Sites execution status: $($execution.executionStatus)"
Write-Information "Execution time: $($execution.executionTime)ms"

# 3. Extract all items from all output slots
$allItems = @()
foreach ($slot in $execution.data.main) {
    foreach ($item in $slot) {
        $itemJson = $item.json
        # Skip the TOTAL summary row
        if ($itemJson.Customer_Name -match '^TOTAL:') {
            continue
        }
        $allItems += $itemJson
    }
}

Write-Host "Total items extracted (excluding TOTAL row): $($allItems.Count)"

# 4. Output as JSON
$jsonOutput = $allItems | ConvertTo-Json -Depth 10

if ($OutputFile) {
    $jsonOutput | Set-Content -LiteralPath $OutputFile -Encoding UTF8
    Write-Host "Output written to: $OutputFile"
} else {
    $jsonOutput | Write-Output
}


# 5b. Always write to the batch temp file as well
$tempFile = "C:\Users\edmon\AppData\Local\Temp\opencode\sites_batch.json"
$jsonOutput | Set-Content -LiteralPath $tempFile -Encoding UTF8
Write-Host "Batch output also written to: $tempFile"

# 5. Summary
if ($allItems.Count -gt 0) {
    Write-Host "`n--- Summary ---"
    Write-Host "First 3 items:"
    $allItems | Select-Object -First 3 | ForEach-Object {
        Write-Host "  $_"
    }
}
