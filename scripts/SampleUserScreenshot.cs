using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        string path = @"C:\Users\ASUS TUFF\.gemini\antigravity\brain\b490288c-0bed-4aed-aa80-aab1d5b8549f\.user_uploaded\media_1794019505559_8ab21fe9.jpg";
        using (Bitmap bmp = new Bitmap(path))
        {
            // Sample across y=100
            for (int x = 0; x < bmp.Width; x += 5)
            {
                Color c = bmp.GetPixel(x, 100);
                if (c.R > 60 || c.G > 60 || c.B > 60)
                {
                    Console.WriteLine("x=" + x + " => R=" + c.R + " G=" + c.G + " B=" + c.B);
                }
            }
        }
    }
}
