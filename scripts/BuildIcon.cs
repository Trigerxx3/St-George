using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class BuildIcon
{
    public static void Main()
    {
        string srcPath = @"D:\St George\public\brand\logo-original.jpg";
        using (Bitmap src = new Bitmap(srcPath))
        {
            Bitmap colorCorrected = new Bitmap(src.Width, src.Height, PixelFormat.Format32bppArgb);
            for (int y = 0; y < src.Height; y++)
            {
                for (int x = 0; x < src.Width; x++)
                {
                    Color c = src.GetPixel(x, y);
                    float hue = c.GetHue();
                    float sat = c.GetSaturation();
                    float bri = c.GetBrightness();

                    if (hue >= 70 && hue <= 170 && sat > 0.15f)
                    {
                        if (bri > 0.52f && sat < 0.50f)
                        {
                            int grayVal = (int)(220 * bri);
                            colorCorrected.SetPixel(x, y, Color.FromArgb(c.A, (int)(grayVal * 0.95f), grayVal, (int)(grayVal * 1.05f)));
                        }
                        else
                        {
                            int newR = (int)(6 + 18 * bri);
                            int newG = (int)(18 + 36 * bri);
                            int newB = (int)(45 + 185 * bri);
                            colorCorrected.SetPixel(x, y, Color.FromArgb(c.A, Math.Min(255, newR), Math.Min(255, newG), Math.Min(255, newB)));
                        }
                    }
                    else
                    {
                        colorCorrected.SetPixel(x, y, c);
                    }
                }
            }

            // Crop knight, horse, shield, and dragon cleanly without the bottom ribbon
            // In original 1024x512:
            // X: 195 to 705 (W: 510)
            // Y: 14 to 326 (H: 312) - stops right below dragon's claws, omitting bottom ribbon
            int knightX = 195, knightY = 14, knightW = 510, knightH = 312;
            Bitmap knightEmblem = CropWithFloodFill(colorCorrected, knightX, knightY, knightW, knightH);

            // Render on Circular Navy Badge (512x512) with Circular Clipping
            Bitmap circularBadge = RenderBadge(knightEmblem, 410);

            // Clean any remaining blue splatter specks on the horse
            CleanSpecksOnHorse(circularBadge);

            // Save to brain preview
            circularBadge.Save(@"C:\Users\ASUS TUFF\.gemini\antigravity\brain\b490288c-0bed-4aed-aa80-aab1d5b8549f\clean-badge-circle.png", ImageFormat.Png);

            // Save to production locations
            circularBadge.Save(@"D:\St George\public\brand\icon.png", ImageFormat.Png);
            circularBadge.Save(@"D:\St George\src\app\icon.png", ImageFormat.Png);

            // Create multi-resolution .ICO file (16, 32, 48, 64, 128, 256)
            SaveMultiResIcon(circularBadge, @"D:\St George\src\app\favicon.ico");
            SaveMultiResIcon(circularBadge, @"D:\St George\public\favicon.ico");

            Console.WriteLine("Pristine tab icons and multi-resolution favicons successfully built!");
        }
    }

    static void CleanSpecksOnHorse(Bitmap bmp)
    {
        for (int y = 90; y < 380; y++)
        {
            for (int x = 140; x < 440; x++)
            {
                Color c = bmp.GetPixel(x, y);
                if (c.B > 110 && c.R < 140 && c.G < 160)
                {
                    int whiteCount = 0;
                    int sumR = 0, sumG = 0, sumB = 0;
                    for (int dy = -5; dy <= 5; dy++)
                    {
                        for (int dx = -5; dx <= 5; dx++)
                        {
                            if (x + dx >= 0 && x + dx < bmp.Width && y + dy >= 0 && y + dy < bmp.Height)
                            {
                                Color sc = bmp.GetPixel(x + dx, y + dy);
                                if (sc.R > 185 && sc.G > 185 && sc.B > 185)
                                {
                                    whiteCount++;
                                    sumR += sc.R;
                                    sumG += sc.G;
                                    sumB += sc.B;
                                }
                            }
                        }
                    }
                    if (whiteCount >= 8)
                    {
                        bmp.SetPixel(x, y, Color.FromArgb(c.A, sumR / whiteCount, sumG / whiteCount, sumB / whiteCount));
                    }
                }
            }
        }
    }

    static Bitmap CropWithFloodFill(Bitmap src, int cx, int cy, int cw, int ch)
    {
        Bitmap crop = new Bitmap(cw, ch, PixelFormat.Format32bppArgb);
        for (int y = 0; y < ch; y++)
        {
            for (int x = 0; x < cw; x++)
            {
                crop.SetPixel(x, y, src.GetPixel(cx + x, cy + y));
            }
        }

        bool[,] visited = new bool[cw, ch];
        Queue<Point> q = new Queue<Point>();

        for (int x = 0; x < cw; x++)
        {
            CheckAndEnqueue(crop, x, 0, visited, q);
            CheckAndEnqueue(crop, x, ch - 1, visited, q);
        }
        for (int y = 0; y < ch; y++)
        {
            CheckAndEnqueue(crop, 0, y, visited, q);
            CheckAndEnqueue(crop, cw - 1, y, visited, q);
        }

        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };

        while (q.Count > 0)
        {
            Point p = q.Dequeue();
            crop.SetPixel(p.X, p.Y, Color.FromArgb(0, 255, 255, 255));

            for (int i = 0; i < 4; i++)
            {
                int nx = p.X + dx[i];
                int ny = p.Y + dy[i];
                if (nx >= 0 && nx < cw && ny >= 0 && ny < ch && !visited[nx, ny])
                {
                    Color nc = crop.GetPixel(nx, ny);
                    if (nc.R > 220 && nc.G > 220 && nc.B > 220)
                    {
                        visited[nx, ny] = true;
                        q.Enqueue(new Point(nx, ny));
                    }
                }
            }
        }

        return crop;
    }

    static void CheckAndEnqueue(Bitmap b, int x, int y, bool[,] visited, Queue<Point> q)
    {
        if (visited[x, y]) return;
        Color c = b.GetPixel(x, y);
        if (c.R > 220 && c.G > 220 && c.B > 220)
        {
            visited[x, y] = true;
            q.Enqueue(new Point(x, y));
        }
    }

    static Bitmap RenderBadge(Bitmap emblem, int maxDimension)
    {
        Bitmap bmp = new Bitmap(512, 512, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(Color.Transparent);

            using (Brush navy = new SolidBrush(Color.FromArgb(255, 7, 21, 34)))
            using (Pen orange = new Pen(Color.FromArgb(255, 232, 117, 26), 14))
            {
                g.FillEllipse(navy, 12, 12, 488, 488);

                // Set clip inside the circle so the emblem fits smoothly
                using (GraphicsPath clip = new GraphicsPath())
                {
                    clip.AddEllipse(18, 18, 476, 476);
                    g.SetClip(clip);

                    float scale = (float)maxDimension / Math.Max(emblem.Width, emblem.Height);
                    int dw = (int)(emblem.Width * scale);
                    int dh = (int)(emblem.Height * scale);
                    int dx = (512 - dw) / 2;
                    int dy = (512 - dh) / 2;

                    g.DrawImage(emblem, new Rectangle(dx, dy, dw, dh));
                    g.ResetClip();
                }

                // Draw crisp orange border on top
                g.DrawEllipse(orange, 12, 12, 488, 488);
            }
        }
        return bmp;
    }

    static void SaveMultiResIcon(Bitmap src, string outIcoPath)
    {
        int[] sizes = new int[] { 16, 32, 48, 64, 128, 256 };
        List<byte[]> pngBytesList = new List<byte[]>();

        foreach (int size in sizes)
        {
            using (Bitmap resized = new Bitmap(size, size, PixelFormat.Format32bppArgb))
            using (Graphics g = Graphics.FromImage(resized))
            {
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.Clear(Color.Transparent);
                g.DrawImage(src, new Rectangle(0, 0, size, size));

                using (System.IO.MemoryStream ms = new System.IO.MemoryStream())
                {
                    resized.Save(ms, ImageFormat.Png);
                    pngBytesList.Add(ms.ToArray());
                }
            }
        }

        using (System.IO.FileStream fs = new System.IO.FileStream(outIcoPath, System.IO.FileMode.Create))
        using (System.IO.BinaryWriter bw = new System.IO.BinaryWriter(fs))
        {
            bw.Write((short)0);
            bw.Write((short)1);
            bw.Write((short)sizes.Length);

            int offset = 6 + (16 * sizes.Length);

            for (int i = 0; i < sizes.Length; i++)
            {
                int s = sizes[i];
                bw.Write((byte)(s >= 256 ? 0 : s));
                bw.Write((byte)(s >= 256 ? 0 : s));
                bw.Write((byte)0);
                bw.Write((byte)0);
                bw.Write((short)1);
                bw.Write((short)32);
                bw.Write((int)pngBytesList[i].Length);
                bw.Write((int)offset);

                offset += pngBytesList[i].Length;
            }

            foreach (byte[] pngData in pngBytesList)
            {
                bw.Write(pngData);
            }
        }
    }
}
