using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo-clean-emblem.png"))
        {
            Console.WriteLine("Bottom border pixels (y=" + (bmp.Height - 1) + "):");
            for (int x = 0; x < bmp.Width; x++)
            {
                Color c = bmp.GetPixel(x, bmp.Height - 1);
                if (c.A > 0) Console.WriteLine("x=" + x + " => " + c);
            }

            Console.WriteLine("Right border pixels (x=" + (bmp.Width - 1) + "):");
            for (int y = 0; y < bmp.Height; y++)
            {
                Color c = bmp.GetPixel(bmp.Width - 1, y);
                if (c.A > 0) Console.WriteLine("y=" + y + " => " + c);
            }
        }
    }
}
