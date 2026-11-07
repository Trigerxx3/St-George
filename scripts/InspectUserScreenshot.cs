using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        string path = @"C:\Users\ASUS TUFF\.gemini\antigravity\brain\b490288c-0bed-4aed-aa80-aab1d5b8549f\.user_uploaded\media_1794019505559_8ab21fe9.jpg";
        using (Bitmap bmp = new Bitmap(path))
        {
            Console.WriteLine("User Screenshot Size: " + bmp.Width + " x " + bmp.Height);
            
            // Find coordinates of bright white vertical line
            for (int x = 0; x < bmp.Width; x++)
            {
                int whiteInCol = 0;
                for (int y = 50; y < bmp.Height - 100; y++)
                {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R > 200 && c.G > 200 && c.B > 200) whiteInCol++;
                }
                if (whiteInCol > 100)
                {
                    Console.WriteLine("Bright white column at screenshot x=" + x + " count=" + whiteInCol);
                }
            }
        }
    }
}
