using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo-navy-orange.png"))
        {
            Console.WriteLine("Checking logo-navy-orange.png for vertical artifacts:");
            for (int x = 0; x < bmp.Width; x++)
            {
                int colCount = 0;
                for (int y = 50; y < 350; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.A > 30)
                    {
                        colCount++;
                    }
                }
                // Check if there is an isolated column around x < 200 or x > 900
                if (colCount > 100 && (x < 200 || x > 920))
                {
                    Console.WriteLine("Column x=" + x + " has " + colCount + " non-transparent pixels! Sample y=100: " + bmp.GetPixel(x, 100));
                }
            }
        }
    }
}
