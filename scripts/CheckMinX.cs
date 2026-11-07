using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Pixels near minX=52:");
            for (int x = 45; x < 65; x++)
            {
                for (int y = 5; y < 482; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 220 || c.G < 220 || c.B < 220)
                    {
                        Console.WriteLine("x=" + x + ", y=" + y + " Color=" + c);
                        break;
                    }
                }
            }
        }
    }
}
