Add-Type -AssemblyName System.Drawing
$imgPath = "D:\St George\public\brand\logo.jpg"
$bmp = New-Object System.Drawing.Bitmap($imgPath)

Write-Output "Dimensions: $($bmp.Width) x $($bmp.Height)"

# Sample colors along vertical centerline
for ($y = 300; $y -lt $bmp.Height; $y += 10) {
    $darkPixelCount = 0
    for ($x = 0; $x -lt $bmp.Width; $x += 5) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 200 -or $c.G -lt 200 -or $c.B -lt 200) {
            $darkPixelCount++
        }
    }
    Write-Output "Y=$y dark pixels count: $darkPixelCount"
}

$bmp.Dispose()

