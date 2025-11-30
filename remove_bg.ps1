Add-Type -AssemblyName System.Drawing

$inputPath = "$PSScriptRoot\public\images\heart-full.png"
$outputPath = "$PSScriptRoot\public\images\heart-full-transparent.png"

try {
    $img = [System.Drawing.Bitmap]::FromFile($inputPath)
    $newImg = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
    
    for ($x = 0; $x -lt $img.Width; $x++) {
        for ($y = 0; $y -lt $img.Height; $y++) {
            $pixel = $img.GetPixel($x, $y)
            # Check for white (or near white)
            if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
                $newImg.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            } else {
                $newImg.SetPixel($x, $y, $pixel)
            }
        }
    }
    
    $newImg.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Successfully created transparent image at $outputPath"
} catch {
    Write-Error "Failed to process image: $_"
} finally {
    if ($img) { $img.Dispose() }
    if ($newImg) { $newImg.Dispose() }
}
