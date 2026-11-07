Add-Type -AssemblyName System.Drawing
$imgPath = "D:\St George\public\brand\logo.jpg"
$bmp = New-Object System.Drawing.Bitmap($imgPath)
Write-Output "Width: $($bmp.Width) Height: $($bmp.Height)"
$corner = $bmp.GetPixel(5, 5)
Write-Output "Corner pixel: R=$($corner.R) G=$($corner.G) B=$($corner.B)"
$bmp.Dispose()

