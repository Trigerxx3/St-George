using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo-navy-orange.png"))
        {
            Console.WriteLine("Inspecting logo-navy-orange.png:");
            // Check sample points
            Console.WriteLine("Swoosh left (150, 290): " + bmp.GetPixel(150, 290));
            Console.WriteLine("Shield center (300, 200): " + bmp.GetPixel(300, 200));
            Console.WriteLine("Dragon body (500, 320): " + bmp.GetPixel(500, 320));
            Console.WriteLine("Text ST (200, 400): " + bmp.GetPixel(200, 400));
            Console.WriteLine("Bolt (580, 400): " + bmp.GetPixel(580, 400));
            Console.WriteLine("Tagline (300, 495): " + bmp.GetPixel(300, 495));
        }
    }
}
