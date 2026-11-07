using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            // Scan y from 330 to 375 across the image
            for (int y = 330; y <= 375; y++)
            {
                int nonWhiteCount = 0;
                for (int x = 100; x < 900; x++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 235 || c.G < 235 || c.B < 235) nonWhiteCount++;
                }
                Console.WriteLine("y=" + y + " nonWhiteCount=" + nonWhiteCount);
            }
        }
    }
}
