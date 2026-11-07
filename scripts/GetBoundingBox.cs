using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            int minX = int.MaxValue, maxX = int.MinValue;
            int minY = int.MaxValue, maxY = int.MinValue;

            // Ignore outer 5 pixels on each edge to avoid the frame
            for (int y = 5; y < 482; y++) // 482 cuts off before tagline at 494!
            {
                for (int x = 5; x < bmp.Width - 5; x++)
                {
                    Color c = bmp.GetPixel(x, y);
                    // Check if non-white
                    if (c.R < 235 || c.G < 235 || c.B < 235)
                    {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            Console.WriteLine("Content Bounding Box (excluding border & tagline):");
            Console.WriteLine("minX=" + minX + ", maxX=" + maxX + ", width=" + (maxX - minX + 1));
            Console.WriteLine("minY=" + minY + ", maxY=" + maxY + ", height=" + (maxY - minY + 1));
        }
    }
}
