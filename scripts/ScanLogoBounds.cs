using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Image Size: " + bmp.Width + " x " + bmp.Height);
            
            // Let's sample horizontal scanline across y = 150
            for (int x = 0; x < bmp.Width; x += 16)
            {
                Color c = bmp.GetPixel(x, 150);
                Console.WriteLine("x=" + x + " : R=" + c.R + " G=" + c.G + " B=" + c.B);
            }
        }
    }
}
