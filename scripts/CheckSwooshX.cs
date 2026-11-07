using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            // Scan x from 900 to 1023, y from 300 to 360
            int maxSwooshX = 0;
            for (int x = 900; x < bmp.Width - 5; x++)
            {
                for (int y = 300; y < 360; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 235 || c.G < 235 || c.B < 235)
                    {
                        if (x > maxSwooshX) maxSwooshX = x;
                    }
                }
            }
            Console.WriteLine("Max swoosh X in logo.jpg: " + maxSwooshX);
        }
    }
}
