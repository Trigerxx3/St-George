using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Original logo.jpg dimensions: " + bmp.Width + " x " + bmp.Height);

            // Let's find the bounding box of non-white pixels in the emblem region (y < 350, x between 10 and 1010)
            int minX = int.MaxValue, maxX = int.MinValue;
            int minY = int.MaxValue, maxY = int.MinValue;

            for (int y = 0; y < 355; y++)
            {
                for (int x = 10; x < bmp.Width - 10; x++)
                {
                    Color c = bmp.GetPixel(x, y);
                    // Check if not white background (c.R < 240 or c.G < 240 or c.B < 240)
                    if (c.R < 240 || c.G < 240 || c.B < 240)
                    {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            Console.WriteLine("Emblem bounds: X=[" + minX + " to " + maxX + "] Y=[" + minY + " to " + maxY + "]");
            Console.WriteLine("Emblem size: " + (maxX - minX + 1) + " x " + (maxY - minY + 1));
        }
    }
}
