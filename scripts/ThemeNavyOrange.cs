using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

class Program
{
    static bool IsWhiteBg(Bitmap src, int x, int y)
    {
        Color c = src.GetPixel(x, y);
        return c.R >= 235 && c.G >= 235 && c.B >= 235;
    }

    static void Main()
    {
        string srcPath = @"D:\St George\public\brand\logo.jpg";
        string outPath = @"D:\St George\public\brand\logo-navy-orange.png";

        using (Bitmap src = new Bitmap(srcPath))
        {
            int width = src.Width;
            int height = src.Height;

            bool[,] isBg = new bool[width, height];
            bool[,] visited = new bool[width, height];
            Queue<Point> queue = new Queue<Point>();

            // Flood-fill outer background to transparent
            for (int x = 0; x < width; x++)
            {
                if (IsWhiteBg(src, x, 0)) { queue.Enqueue(new Point(x, 0)); visited[x, 0] = true; isBg[x, 0] = true; }
                if (IsWhiteBg(src, x, height - 1)) { queue.Enqueue(new Point(x, height - 1)); visited[x, height - 1] = true; isBg[x, height - 1] = true; }
            }
            for (int y = 0; y < height; y++)
            {
                if (IsWhiteBg(src, 0, y)) { queue.Enqueue(new Point(0, y)); visited[0, y] = true; isBg[0, y] = true; }
                if (IsWhiteBg(src, width - 1, y)) { queue.Enqueue(new Point(width - 1, y)); visited[width - 1, y] = true; isBg[width - 1, y] = true; }
            }

            int[] dx = new int[] { -1, 1, 0, 0 };
            int[] dy = new int[] { 0, 0, -1, 1 };

            while (queue.Count > 0)
            {
                Point p = queue.Dequeue();
                for (int i = 0; i < 4; i++)
                {
                    int nx = p.X + dx[i];
                    int ny = p.Y + dy[i];
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[nx, ny])
                    {
                        visited[nx, ny] = true;
                        if (IsWhiteBg(src, nx, ny))
                        {
                            isBg[nx, ny] = true;
                            queue.Enqueue(new Point(nx, ny));
                        }
                    }
                }
            }

            using (Bitmap themed = new Bitmap(width, height, PixelFormat.Format32bppArgb))
            {
                for (int x = 0; x < width; x++)
                {
                    for (int y = 0; y < height; y++)
                    {
                        Color c = src.GetPixel(x, y);

                        if (isBg[x, y])
                        {
                            themed.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                            continue;
                        }

                        float hue = c.GetHue();
                        float sat = c.GetSaturation();
                        float b = c.GetBrightness();

                        // Is this pixel green? (Hues between 65 and 165, with noticeable saturation)
                        bool isGreen = (hue >= 65f && hue <= 170f && sat > 0.15f);

                        if (y >= 355)
                        {
                            // Text & Tagline Region
                            bool isYellow = (c.R > 170 && c.G > 135 && c.B < 85);
                            if (isYellow)
                            {
                                // Lightning bolt in the 'O'
                                themed.SetPixel(x, y, Color.FromArgb(255, 255, 185, 0));
                            }
                            else if (y < 440)
                            {
                                // "ST GEORGE"
                                int lum = (int)(0.299 * c.R + 0.587 * c.G + 0.114 * c.B);
                                if (lum < 170)
                                {
                                    themed.SetPixel(x, y, Color.FromArgb(255, 255, 255, 255));
                                }
                                else
                                {
                                    int a = Math.Max(0, Math.Min(255, (int)((255 - lum) / 85.0 * 255)));
                                    themed.SetPixel(x, y, Color.FromArgb(a, 255, 255, 255));
                                }
                            }
                            else if (y < 485)
                            {
                                // "ELECTRICAL ENERGY SOLUTION"
                                int lum = (int)(0.299 * c.R + 0.587 * c.G + 0.114 * c.B);
                                if (lum < 170)
                                {
                                    themed.SetPixel(x, y, Color.FromArgb(255, 226, 232, 240));
                                }
                                else
                                {
                                    int a = Math.Max(0, Math.Min(255, (int)((255 - lum) / 85.0 * 255)));
                                    themed.SetPixel(x, y, Color.FromArgb(a, 226, 232, 240));
                                }
                            }
                            else
                            {
                                // Tagline: "Powering Homes, Energising Businesses"
                                int lum = (int)(0.299 * c.R + 0.587 * c.G + 0.114 * c.B);
                                if (lum < 185)
                                {
                                    // Brand Orange #e8751a
                                    themed.SetPixel(x, y, Color.FromArgb(255, 232, 117, 26));
                                }
                                else
                                {
                                    int a = Math.Max(0, Math.Min(255, (int)((255 - lum) / 70.0 * 255)));
                                    themed.SetPixel(x, y, Color.FromArgb(a, 232, 117, 26));
                                }
                            }
                        }
                        else
                        {
                            // Upper Graphic Region (Shield, Dragon, Horse, Solar Panel, Swooshes)
                            if (isGreen)
                            {
                                // Distinguish between Shield / Swooshes / Dragon:
                                // Left & Bottom swooshes (around x < 280 or y > 270 outside shield):
                                // We can transform the green parts of swooshes into Brand Orange!
                                // The shield interior into Deep Navy Blue!
                                // The dragon into Dark Slate / Steel Navy!

                                // Let's check coordinates:
                                bool isSwoosh = (x < 260 || (y > 270 && x > 700));
                                bool isShield = (x >= 220 && x <= 460 && y >= 70 && y <= 300);
                                bool isDragon = (y >= 230 && x >= 330 && x <= 690);

                                if (isSwoosh)
                                {
                                    // Transform green swoosh to Brand Orange (#e8751a)
                                    // Preserve luminance/shading:
                                    float factor = b; // brightness
                                    int r = Math.Min(255, (int)(245 * (0.4f + 0.6f * factor)));
                                    int g = Math.Min(255, (int)(125 * (0.3f + 0.7f * factor)));
                                    int bl = Math.Min(255, (int)(25 * factor));
                                    themed.SetPixel(x, y, Color.FromArgb(255, r, g, bl));
                                }
                                else if (isShield && !isDragon)
                                {
                                    // Shield: Rich Royal / Deep Navy Blue (#0f2b48 / #1a3d66)
                                    int r = Math.Min(255, (int)(15 + 40 * b));
                                    int g = Math.Min(255, (int)(45 + 90 * b));
                                    int bl = Math.Min(255, (int)(95 + 150 * b));
                                    themed.SetPixel(x, y, Color.FromArgb(255, r, g, bl));
                                }
                                else
                                {
                                    // Dragon: Sleek dark navy / metallic slate dragon (#14283c to #1e3a5a)
                                    // with navy tones:
                                    int r = Math.Min(255, (int)(18 + 45 * b));
                                    int g = Math.Min(255, (int)(38 + 75 * b));
                                    int bl = Math.Min(255, (int)(75 + 130 * b));
                                    themed.SetPixel(x, y, Color.FromArgb(255, r, g, bl));
                                }
                            }
                            else
                            {
                                // Keep original horse (white), knight (silver), cape & shield cross (red),
                                // solar panels (blue), sun (gold/yellow), house (charcoal)
                                themed.SetPixel(x, y, c);
                            }
                        }
                    }
                }

                themed.Save(outPath, ImageFormat.Png);
                Console.WriteLine("Saved: " + outPath);
            }
        }
    }
}

