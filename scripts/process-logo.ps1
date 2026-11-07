Add-Type -AssemblyName System.Drawing
$imgPath = "D:\St George\public\brand\logo.jpg"
$src = New-Object System.Drawing.Bitmap($imgPath)
$width = $src.Width
$height = $src.Height

# Create 32-bit ARGB bitmap for transparent PNG
$transparent = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $width; $x++) {
    for ($y = 0; $y -lt $height; $y++) {
        $c = $src.GetPixel($x, $y)
        # Check if white or near-white background
        # Background is R >= 245, G >= 245, B >= 245
        if ($c.R -ge 245 -and $c.G -ge 245 -and $c.B -ge 245) {
            # Make completely transparent
            $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        } elseif ($c.R -ge 230 -and $c.G -ge 230 -and $c.B -ge 230) {
            # Soft edge anti-aliasing
            $alpha = [int]((255 - [Math]::Min($c.R, [Math]::Min($c.G, $c.B))) / 25 * 255)
            $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
            $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
        } else {
            $transparent.SetPixel($x, $y, $c)
        }
    }
}

$outPath = "D:\St George\public\brand\logo.png"
$transparent.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved transparent logo to $outPath"

# Also create square emblem crop: the knight, shield, dragon and sun
# From coordinates: X: 150 to 950, Y: 0 to 350
$emblemWidth = 720
$emblemHeight = 350
$emblemRect = New-Object System.Drawing.Rectangle(150, 0, $emblemWidth, $emblemHeight)
$emblem = $src.Clone($emblemRect, $src.PixelFormat)
$emblemPath = "D:\St George\public\brand\logo-emblem.jpg"
$emblem.Save($emblemPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
Write-Output "Saved emblem to $emblemPath"

$src.Dispose()
$transparent.Dispose()
$emblem.Dispose()

