# Reads sites_batch.json and inserts into customer_sites data table in batches of 100
param(
    [string]$InputFile = "C:\Users\edmon\AppData\Local\Temp\opencode\sites_batch.json",
    [string]$DataTableId = "WFQvnoKSa9TjPoHj",
    [string]$ProjectId = "HfMlqgFS6NFMj6hI",
    [int]$BatchSize = 100
)

$all = Get-Content -Raw $InputFile | ConvertFrom-Json
$total = $all.Count
$inserted = 0

for ($i = 0; $i -lt $total; $i += $BatchSize) {
    $end = [Math]::Min($i + $BatchSize - 1, $total - 1)
    $batch = $all[$i..$end]
    $count = $batch.Count
    Write-Host "Inserting batch $inserted : items $i-$end ($count items)..."

    $payload = @{
        dataTableId = $DataTableId
        projectId = $ProjectId
        rows = $batch
    } | ConvertTo-Json -Compress -Depth 3

    # Note: This script just prepares the payload. 
    # The actual MCP insert happens via the n8n MCP tool.
    Write-Host "  Payload size: $($payload.Length) chars"
    
    # Save for later use
    $payload | Out-File -Encoding UTF8 "C:\Users\edmon\AppData\Local\Temp\opencode\sites_payload_$i.json" -NoNewline
    $inserted++
}

Write-Host "`nTotal items: $total, batches prepared: $inserted"