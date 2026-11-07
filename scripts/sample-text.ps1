Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap("D:\St George\public\brand\logo.jpg")

Write-Output "Sampling ST GEORGE at Y=385:"
for ($x = 100; $x -lt 900; $x += 100) {
    $c = $bmp.GetPixel($x, 385)
    Write-Output "x=$($x) R=$($c.R) G=$($c.G) B=$($c.B)"
}

Write-Output "Sampling ELECTRICAL ENERGY SOLUTION at Y=460:"
for ($x = 100; $x -lt 900; $x += 100) {
    $c = $bmp.GetPixel($x, 460)
    Write-Output "x=$($x) R=$($c.R) G=$($c.G) B=$($c.B)"
}

$bmp.Dispose()
