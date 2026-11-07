using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        string path = @"C:\Users\ASUS TUFF\.gemini\antigravity\brain\b490288c-0bed-4aed-aa80-aab1d5b8549f\.user_uploaded\media_1794019899668_0b5fbda9.png";
        using (Bitmap bmp = new Bitmap(path))
        {
            Console.WriteLine("Screenshot size: " + bmp.Width + "x" + bmp.Height);
            // Scan across y=100 in the screenshot
            for (int x = 0; x < bmp.Width; x++)
            {
                Color c = bmp.GetPixel(x, 100);
                // Background of the page seems to be dark around R~15, G~25, B~35
                if (c.R > 50 || c.G > 50 || c.B > 50)
                {
                    Console.WriteLine("Bright pixel at x=" + x + ", y=100 Color=" + c);
                }
            }
        }
    }
}
