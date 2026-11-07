using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.png"))
        {
            Console.WriteLine("Scanning columns of logo.png:");
            for (int x = 0; x < bmp.Width; x++)
            {
                int nonAlpha = 0;
                int maxA = 0;
                for (int y = 0; y < bmp.Height; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.A > 0)
                    {
                        nonAlpha++;
                        if (c.A > maxA) maxA = c.A;
                    }
                }
                if (nonAlpha > 0 && (x < 150 || x > 950))
                {
                    Console.WriteLine("x=" + x + " nonAlpha=" + nonAlpha + " maxA=" + maxA);
                }
            }
        }
    }
}
