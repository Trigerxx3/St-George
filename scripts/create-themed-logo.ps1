Add-Type -AssemblyName System.Drawing

$srcPath = "D:\St George\public\brand\logo.jpg"
$src = New-Object System.Drawing.Bitmap($srcPath)
$width = $src.Width
$height = $src.Height

# Create 2D boolean array for isBackground
$isBg = New-Object 'bool[,]' $width, $height
$visited = New-Object 'bool[,]' $width, $height

# Queue for BFS flood fill
$queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

# Helper to check if pixel is "white/near-white" background
function IsWhiteBgPixel($x, $y) {
    $c = $src.GetPixel($x, $y)
    return ($c.R -ge 235 -and $c.G -ge 235 -and $c.B -ge 235)
}

# Seed the queue with all border pixels that are white
for ($x = 0; $x -lt $width; $x++) {
    if (IsWhiteBgPixel $x 0) {
        $p = New-Object System.Drawing.Point($x, 0)
        $queue.Enqueue($p)
        $visited[$x, 0] = $true
        $isBg[$x, 0] = $true
    }
    if (IsWhiteBgPixel $x ($height - 1)) {
        $p = New-Object System.Drawing.Point($x, ($height - 1))
        $queue.Enqueue($p)
        $visited[$x, $height - 1] = $true
        $isBg[$x, $height - 1] = $true
    }
}

for ($y = 0; $y -lt $height; $y++) {
    if (IsWhiteBgPixel 0 $y) {
        $p = New-Object System.Drawing.Point(0, $y)
        $queue.Enqueue($p)
        $visited[0, $y] = $true
        $isBg[0, $y] = $true
    }
    if (IsWhiteBgPixel ($width - 1) $y) {
        $p = New-Object System.Drawing.Point(($width - 1), $y)
        $queue.Enqueue($p)
        $visited[$width - 1, $y] = $true
        $isBg[$width - 1, $y] = $true
    }
}

# Run BFS flood fill
$dirs = @(
    @(-1, 0), @(1, 0), @(0, -1), @(0, 1)
)

while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr.X
    $cy = $curr.Y

    foreach ($d in $dirs) {
        $nx = $cx + $d[0]
        $ny = $cy + $d[1]

        if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
            if (-not $visited[$nx, $ny]) {
                $visited[$nx, $ny] = $true
                if (IsWhiteBgPixel $nx $ny) {
                    $isBg[$nx, $ny] = $true
                    $np = New-Object System.Drawing.Point($nx, $ny)
                    $queue.Enqueue($np)
                }
            }
        }
    }
}

Write-Output "Flood fill complete. Generating dark-themed transparent bitmap..."

# Create the final dark-themed bitmap
$themed = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $width; $x++) {
    for ($y = 0; $y -lt $height; $y++) {
        $c = $src.GetPixel($x, $y)

        if ($isBg[$x, $y]) {
            # Make transparent
            $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # If in the text region (below the emblem artwork)
            if ($y -ge 355) {
                # Check for yellow lightning bolt (High R & G, low B)
                $isYellowBolt = ($c.R -gt 170 -and $c.G -gt 140 -and $c.B -lt 80)
                
                if ($isYellowBolt) {
                    # Keep the bright electric lightning bolt!
                    $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 204, 0))
                } elseif ($y -lt 440) {
                    # "ST GEORGE" letters: transform dark green to brilliant clean white
                    # Inverse luminance for edge anti-aliasing against navy
                    $lum = [int](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
                    if ($lum -lt 180) {
                        # Main text letter pixel
                        $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
                    } else {
                        # Antialiased edge
                        $alpha = [int]((255 - $lum) / 75 * 255)
                        $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                        $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 255, 255, 255))
                    }
                } elseif ($y -lt 485) {
                    # "ELECTRICAL ENERGY SOLUTION": crisp light silver/white
                    $lum = [int](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
                    if ($lum -lt 180) {
                        $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 241, 245, 249))
                    } else {
                        $alpha = [int]((255 - $lum) / 75 * 255)
                        $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                        $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 241, 245, 249))
                    }
                } else {
                    # Tagline "Powering Homes, Energising Businesses": Brand Orange
                    $lum = [int](0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B)
                    if ($lum -lt 180) {
                        $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 232, 117, 26))
                    } else {
                        $alpha = [int]((255 - $lum) / 75 * 255)
                        $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                        $themed.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 232, 117, 26))
                    }
                }
            } else {
                # Upper artwork: preserve full colors (horse remains white, armor silver, cape red, dragon green)
                # Soften outer edge if adjacent to background
                $themed.SetPixel($x, $y, $c)
            }
        }
    }
}

$themedPath = "D:\St George\public\brand\logo-themed.png"
$themed.Save($themedPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved site-themed logo to $themedPath"

$src.Dispose()
$themed.Dispose()

