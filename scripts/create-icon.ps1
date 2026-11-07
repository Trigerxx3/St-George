Add-Type -AssemblyName System.Drawing
$imgPath = "D:\St George\public\brand\logo.jpg"
$src = New-Object System.Drawing.Bitmap($imgPath)

# Knight and shield are roughly from x=210 to x=630, y=10 to y=430
$emblemCropX = 220
$emblemCropY = 20
$emblemCropSize = 400

$cropRect = New-Object System.Drawing.Rectangle($emblemCropX, $emblemCropY, $emblemCropSize, $emblemCropSize)
$cropBmp = $src.Clone($cropRect, $src.PixelFormat)

# Resize to crisp 512x512 with high quality interpolation
$icon512 = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($icon512)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::White)
$g.DrawImage($cropBmp, 0, 0, 512, 512)
$g.Dispose()

$icon512.Save("D:\St George\public\brand\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$icon512.Save("D:\St George\src\app\icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved brand icon to public/brand/icon.png and src/app/icon.png"

$src.Dispose()
$cropBmp.Dispose()
$icon512.Dispose()

