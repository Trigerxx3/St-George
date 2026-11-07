using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

class Program
{
    static bool IsWhiteBg(Bitmap src, int x, int y)
    {
        Color c = src.GetPixel(x, y);
        // Background in this logo is pure white or very near white
        return c.R >= 232 && c.G >= 232 && c.B >= 232;
    }

    static void Main()
    {
        string srcPath = @"D:\St George\public\brand\logo.jpg";
        string outCleanPath = @"D:\St George\public\brand\logo-clean.png";

        using (Bitmap src = new Bitmap(srcPath))
        {
            int width = src.Width;
            int height = src.Height;

            // 1. Create working copy with outer frame removed
            // The outer 4 columns on left/right and bottom below 482 are cleaned out.
            bool[,] isBg = new bool[width, height];
            bool[,] visited = new bool[width, height];
            Queue<Point> queue = new Queue<Point>();

            // Mark and seed outer border pixels
            for (int x = 0; x < width; x++)
            {
                // Top row
                visited[x, 0] = true;
                isBg[x, 0] = true;
                queue.Enqueue(new Point(x, 0));

                // Bottom rows (from y=482 to height-1) are ALL background / removed!
                for (int y = 482; y < height; y++)
                {
                    visited[x, y] = true;
                    isBg[x, y] = true;
                    queue.Enqueue(new Point(x, y));
                }
            }

            // Left & right outer columns (0..5 and width-6..width-1)
            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < 6; x++)
                {
                    visited[x, y] = true;
                    isBg[x, y] = true;
                    queue.Enqueue(new Point(x, y));
                }
                for (int x = width - 6; x < width; x++)
                {
                    visited[x, y] = true;
                    isBg[x, y] = true;
                    queue.Enqueue(new Point(x, y));
                }
            }

            // 4-way BFS flood-fill for all connected exterior white pixels
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

            // Also check for any isolated non-connected white pixels outside content:
            // Top corners, sides
            for (int x = 0; x < width; x++)
            {
                for (int y = 0; y < height; y++)
                {
                    if (y >= 482)
                    {
                        isBg[x, y] = true;
                    }
                    else if ((x < 50 || x > 970) && y < 350 && IsWhiteBg(src, x, y))
                    {
                        isBg[x, y] = true;
                    }
                }
            }

            // Now construct the themed & cleaned 32-bit ARGB image
            using (Bitmap themed = new Bitmap(width, height, PixelFormat.Format32bppArgb))
            {
                for (int x = 0; x < width; x++)
                {
                    for (int y = 0; y < height; y++)
                    {
                        if (isBg[x, y] || y >= 482)
                        {
                            themed.SetPixel(x, y, Color.FromArgb(0, 0, 0, 0));
                            continue;
                        }

                        Color c = src.GetPixel(x, y);
                        float hue = c.GetHue();
                        float sat = c.GetSaturation();
                        float b = c.GetBrightness();
                        bool isGreen = (hue >= 65f && hue <= 170f && sat > 0.15f);

                        if (y >= 355)
                        {
                            // "ST GEORGE" & "ELECTRICAL ENERGY SOLUTION"
                            bool isYellow = (c.R > 170 && c.G > 135 && c.B < 85);
                            if (isYellow)
                            {
                                // Lightning bolt in the 'O'
                                themed.SetPixel(x, y, Color.FromArgb(255, 255, 185, 0));
                            }
                            else if (y < 440)
                            {
                                // "ST GEORGE" text: Brilliant clean white
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
                            else
                            {
                                // "ELECTRICAL ENERGY SOLUTION": Clean Light Silver / White
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
                        }
                        else
                        {
                            // Upper Graphic Artwork
                            if (isGreen)
                            {
                                bool isSwoosh = (x < 260 || (y > 270 && x > 700));
                                bool isShield = (x >= 220 && x <= 460 && y >= 70 && y <= 300);

                                if (isSwoosh)
                                {
                                    // Brand Orange #e8751a
                                    int r = Math.Min(255, (int)(245 * (0.4f + 0.6f * b)));
                                    int g = Math.Min(255, (int)(125 * (0.3f + 0.7f * b)));
                                    int bl = Math.Min(255, (int)(25 * b));
                                    themed.SetPixel(x, y, Color.FromArgb(255, r, g, bl));
                                }
                                else if (isShield)
                                {
                                    // Shield: Deep Royal Navy Blue (#0f2b48 / #163a61)
                                    int r = Math.Min(255, (int)(15 + 40 * b));
                                    int g = Math.Min(255, (int)(45 + 90 * b));
                                    int bl = Math.Min(255, (int)(95 + 150 * b));
                                    themed.SetPixel(x, y, Color.FromArgb(255, r, g, bl));
                                }
                                else
                                {
                                    // Dragon: Metallic Slate Navy
                                    int r = Math.Min(255, (int)(18 + 45 * b));
                                    int g = Math.Min(255, (int)(38 + 75 * b));
                                    int bl = Math.Min(255, (int)(75 + 130 * b));
                                    themed.SetPixel(x, y, Color.FromArgb(255, r, g, bl));
                                }
                            }
                            else
                            {
                                // Natural original artwork (White horse, knight, red cross, solar panel, sun)
                                themed.SetPixel(x, y, c);
                            }
                        }
                    }
                }

                // 2. Find exact bounding box of non-transparent content
                int minX = width, maxX = 0;
                int minY = height, maxY = 0;

                for (int y = 0; y < height; y++)
                {
                    for (int x = 0; x < width; x++)
                    {
                        Color c = themed.GetPixel(x, y);
                        if (c.A > 20)
                        {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }

                Console.WriteLine("Cropped Content Bounds: X=" + minX + ".." + maxX + ", Y=" + minY + ".." + maxY);
                int pad = 8;
                minX = Math.Max(0, minX - pad);
                maxX = Math.Min(width - 1, maxX + pad);
                minY = Math.Max(0, minY - pad);
                maxY = Math.Min(height - 1, maxY + pad);

                int cropW = maxX - minX + 1;
                int cropH = maxY - minY + 1;

                using (Bitmap cropped = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb))
                {
                    using (Graphics g = Graphics.FromImage(cropped))
                    {
                        g.Clear(Color.Transparent);
                        g.DrawImage(themed, new Rectangle(0, 0, cropW, cropH), new Rectangle(minX, minY, cropW, cropH), GraphicsUnit.Pixel);
                    }

                    cropped.Save(outCleanPath, ImageFormat.Png);
                    Console.WriteLine("Saved clean logo: " + outCleanPath + " (" + cropW + "x" + cropH + ")");
                }
            }
        }
    }
}

