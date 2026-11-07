using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            for (int x = 140; x < 180; x++)
            {
                for (int y = 50; y < 350; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 235 || c.G < 235 || c.B < 235)
                    {
                        Console.WriteLine("At x=" + x + ", y=" + y + " Color=" + c);
                        break;
                    }
                }
            }
            for (int x = 930; x < 970; x++)
            {
                for (int y = 50; y < 350; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 235 || c.G < 235 || c.B < 235)
                    {
                        Console.WriteLine("At x=" + x + ", y=" + y + " Color=" + c);
                        break;
                    }
                }
            }
        }
    }
}
