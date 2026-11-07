using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

class Program
{
    static bool IsWhiteBg(Bitmap src, int x, int y)
    {
        Color c = src.GetPixel(x, y);
        return c.R >= 238 && c.G >= 238 && c.B >= 238;
    }

    static void Main()
    {
        string srcPath = @"D:\St George\public\brand\logo.jpg";
        string outPath = @"D:\St George\public\brand\logo-themed.png";

        using (Bitmap src = new Bitmap(srcPath))
        {
            int width = src.Width;
            int height = src.Height;

            bool[,] isBg = new bool[width, height];
            bool[,] visited = new bool[width, height];
            Queue<Point> queue = new Queue<Point>();

            // Seed outer border
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

            // 4-way BFS flood fill
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
                        }
                        else
                        {
                            if (y >= 355)
                            {
                                bool isYellow = (c.R > 170 && c.G > 135 && c.B < 85);
                                if (isYellow)
                                {
                                    themed.SetPixel(x, y, Color.FromArgb(255, 255, 185, 0)); // Vibrant electric bolt
                                }
                                else if (y < 440)
                                {
                                    // "ST GEORGE": Bright Crisp White
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
                                    // "ELECTRICAL ENERGY SOLUTION": Clean Light Silver / White
                                    int lum = (int)(0.299 * c.R + 0.587 * c.G + 0.114 * c.B);
                                    if (lum < 170)
                                    {
                                        themed.SetPixel(x, y, Color.FromArgb(255, 241, 245, 249));
                                    }
                                    else
                                    {
                                        int a = Math.Max(0, Math.Min(255, (int)((255 - lum) / 85.0 * 255)));
                                        themed.SetPixel(x, y, Color.FromArgb(a, 241, 245, 249));
                                    }
                                }
                                else
                                {
                                    // Tagline: Brand Orange (#e8751a)
                                    int lum = (int)(0.299 * c.R + 0.587 * c.G + 0.114 * c.B);
                                    if (lum < 170)
                                    {
                                        themed.SetPixel(x, y, Color.FromArgb(255, 232, 117, 26));
                                    }
                                    else
                                    {
                                        int a = Math.Max(0, Math.Min(255, (int)((255 - lum) / 85.0 * 255)));
                                        themed.SetPixel(x, y, Color.FromArgb(a, 232, 117, 26));
                                    }
                                }
                            }
                            else
                            {
                                // Artwork: 100% preservation of Saint George, white horse, red cross shield, dragon, solar panels
                                themed.SetPixel(x, y, c);
                            }
                        }
                    }
                }

                themed.Save(outPath, ImageFormat.Png);
                Console.WriteLine("Successfully created themed logo at: " + outPath);
            }
        }
    }
}
