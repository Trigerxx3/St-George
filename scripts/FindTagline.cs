using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            // Find y range for tagline
            for (int y = 480; y < 512; y += 4)
            {
                int darkCount = 0;
                for (int x = 200; x < 800; x++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 200 || c.G < 200 || c.B < 200) darkCount++;
                }
                Console.WriteLine("y=" + y + " darkCount=" + darkCount);
            }
        }
    }
}
