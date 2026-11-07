using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo-clean.png"))
        {
            Console.WriteLine("Inspecting logo-clean.png (" + bmp.Width + "x" + bmp.Height + ")");
            // Check top 5 rows
            int topPixels = 0;
            for (int y = 0; y < 5; y++) {
                for (int x = 0; x < bmp.Width; x++) if (bmp.GetPixel(x, y).A > 10) topPixels++;
            }
            // Check bottom 5 rows
            int botPixels = 0;
            for (int y = bmp.Height - 5; y < bmp.Height; y++) {
                for (int x = 0; x < bmp.Width; x++) if (bmp.GetPixel(x, y).A > 10) botPixels++;
            }
            // Check left 5 cols
            int leftPixels = 0;
            for (int x = 0; x < 5; x++) {
                for (int y = 0; y < bmp.Height; y++) if (bmp.GetPixel(x, y).A > 10) leftPixels++;
            }
            // Check right 5 cols
            int rightPixels = 0;
            for (int x = bmp.Width - 5; x < bmp.Width; x++) {
                for (int y = 0; y < bmp.Height; y++) if (bmp.GetPixel(x, y).A > 10) rightPixels++;
            }

            Console.WriteLine("Border padding check: Top=" + topPixels + ", Bottom=" + botPixels + ", Left=" + leftPixels + ", Right=" + rightPixels);
            
            // Check bottom text: what is at bottom rows?
            for (int y = bmp.Height - 20; y < bmp.Height; y += 4) {
                int count = 0;
                for (int x = 0; x < bmp.Width; x++) if (bmp.GetPixel(x, y).A > 50) count++;
                Console.WriteLine("y=" + y + " count=" + count);
            }
        }
    }
}
