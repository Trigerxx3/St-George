using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        string path = @"C:\Users\ASUS TUFF\.gemini\antigravity\brain\b490288c-0bed-4aed-aa80-aab1d5b8549f\.user_uploaded\media_1794019505559_8ab21fe9.jpg";
        using (Bitmap bmp = new Bitmap(path))
        {
            for (int x = 80; x < 120; x++)
            {
                Color c = bmp.GetPixel(x, 100);
                if (c.R > 30 || c.G > 30 || c.B > 30)
                {
                    Console.WriteLine("x=" + x + " => R=" + c.R + " G=" + c.G + " B=" + c.B);
                }
            }
        }
    }
}
