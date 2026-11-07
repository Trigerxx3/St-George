using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo-navy-orange.png"))
        {
            int visibleCount = 0;
            for (int y = 494; y < 512; y++)
            {
                for (int x = 150; x < 850; x++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.A > 50) visibleCount++;
                }
            }
            Console.WriteLine("Visible pixels in tagline area: " + visibleCount);
        }
    }
}
