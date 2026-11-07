using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Original logo.jpg dimensions: " + bmp.Width + "x" + bmp.Height);
            // Let's check vertical lines on left and right
            for (int x = 0; x < 200; x++)
            {
                int nonWhite = 0;
                for (int y = 50; y < 350; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 240 || c.G < 240 || c.B < 240) nonWhite++;
                }
                if (nonWhite > 100)
                {
                    Console.WriteLine("Left non-white column at x=" + x + " count=" + nonWhite);
                    break;
                }
            }
            for (int x = bmp.Width - 1; x > bmp.Width - 200; x--)
            {
                int nonWhite = 0;
                for (int y = 50; y < 350; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 240 || c.G < 240 || c.B < 240) nonWhite++;
                }
                if (nonWhite > 100)
                {
                    Console.WriteLine("Right non-white column at x=" + x + " count=" + nonWhite);
                    break;
                }
            }
        }
    }
}
