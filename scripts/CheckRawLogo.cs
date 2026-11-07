using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Pixel at (0, 0): " + bmp.GetPixel(0, 0));
            Console.WriteLine("Pixel at (0, 100): " + bmp.GetPixel(0, 100));
            Console.WriteLine("Pixel at (0, 256): " + bmp.GetPixel(0, 256));
            Console.WriteLine("Pixel at (158, 100): " + bmp.GetPixel(158, 100));
            Console.WriteLine("Pixel at (158, 256): " + bmp.GetPixel(158, 256));
            Console.WriteLine("Pixel at (1023, 256): " + bmp.GetPixel(1023, 256));
        }
    }
}
