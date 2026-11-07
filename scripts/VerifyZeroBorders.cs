using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.png"))
        {
            Console.WriteLine("Border verification for logo.png (" + bmp.Width + "x" + bmp.Height + "):");
            int borderVis = 0;
            // Check top 5 rows
            for (int y = 0; y < 5; y++)
                for (int x = 0; x < bmp.Width; x++)
                    if (bmp.GetPixel(x, y).A > 0) borderVis++;
            
            // Check bottom 5 rows
            for (int y = bmp.Height - 5; y < bmp.Height; y++)
                for (int x = 0; x < bmp.Width; x++)
                    if (bmp.GetPixel(x, y).A > 0) borderVis++;

            // Check left 5 cols
            for (int x = 0; x < 5; x++)
                for (int y = 0; y < bmp.Height; y++)
                    if (bmp.GetPixel(x, y).A > 0) borderVis++;

            // Check right 5 cols
            for (int x = bmp.Width - 5; x < bmp.Width; x++)
                for (int y = 0; y < bmp.Height; y++)
                    if (bmp.GetPixel(x, y).A > 0) borderVis++;

            Console.WriteLine("Border visible pixels in outer 5px perimeter: " + borderVis);
        }
    }
}
