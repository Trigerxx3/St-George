using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo-navy-orange.png"))
        {
            Console.WriteLine("Image dimensions: " + bmp.Width + "x" + bmp.Height);
            // Check x=0 to 10
            for (int x = 0; x < 200; x++)
            {
                int colNonAlpha = 0;
                for (int y = 0; y < bmp.Height; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.A > 20) colNonAlpha++;
                }
                if (colNonAlpha > 0)
                {
                    Console.WriteLine("First column with visible pixels at x=" + x + " count=" + colNonAlpha);
                    break;
                }
            }

            // Check what pixels exist in column 150-160
            for (int x = 150; x <= 165; x++)
            {
                int count = 0;
                for (int y = 0; y < bmp.Height; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.A > 200 && c.R > 200 && c.G > 200 && c.B > 200) count++;
                }
                if (count > 50)
                {
                    Console.WriteLine("x=" + x + " white pixel count=" + count);
                }
            }
        }
    }
}
