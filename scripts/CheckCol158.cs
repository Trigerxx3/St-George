using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Inspecting column 158 in logo.jpg:");
            for (int y = 50; y < 350; y += 20)
            {
                Console.WriteLine("y=" + y + " Color=" + bmp.GetPixel(158, y));
            }
        }
    }
}
