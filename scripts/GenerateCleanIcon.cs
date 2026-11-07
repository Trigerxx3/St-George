using System;
using System.Drawing;
using System.Drawing.Imaging;

class Program
{
    static void Main()
    {
        string srcPath = @"D:\St George\public\brand\logo.png";
        string outFavicon = @"D:\St George\public\brand\icon.png";
        string outAppIcon = @"D:\St George\src\app\icon.png";

        using (Bitmap src = new Bitmap(srcPath))
        {
            // In the 980x489 clean logo, the emblem artwork (knight, horse, shield, sun, roof) is roughly x: 100 to 880, y: 0 to 350
            int cropX = 100;
            int cropY = 0;
            int cropW = 780;
            int cropH = 350;

            int maxDim = Math.Max(cropW, cropH);
            using (Bitmap square = new Bitmap(maxDim, maxDim, PixelFormat.Format32bppArgb))
            {
                using (Graphics g = Graphics.FromImage(square))
                {
                    g.Clear(Color.Transparent);
                    int destX = (maxDim - cropW) / 2;
                    int destY = (maxDim - cropH) / 2;
                    g.DrawImage(src, new Rectangle(destX, destY, cropW, cropH), new Rectangle(cropX, cropY, cropW, cropH), GraphicsUnit.Pixel);
                }

                using (Bitmap icon = new Bitmap(192, 192, PixelFormat.Format32bppArgb))
                {
                    using (Graphics g = Graphics.FromImage(icon))
                    {
                        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                        g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                        g.Clear(Color.Transparent);
                        g.DrawImage(square, new Rectangle(0, 0, 192, 192));
                    }
                    icon.Save(outFavicon, ImageFormat.Png);
                    icon.Save(outAppIcon, ImageFormat.Png);
                    Console.WriteLine("Saved crisp 192x192 icons.");
                }
            }
        }
    }
}

