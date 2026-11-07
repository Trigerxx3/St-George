using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Scanning logo.jpg for outer borders:");
            // Check top 10 rows
            for (int y = 0; y < 10; y++) {
                int dark = 0;
                for (int x = 0; x < bmp.Width; x++) {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 220 || c.G < 220 || c.B < 220) dark++;
                }
                if (dark > 0) Console.WriteLine("Top row y=" + y + " has " + dark + " dark pixels");
            }
            // Check left 20 columns
            for (int x = 0; x < 20; x++) {
                int dark = 0;
                for (int y = 0; y < bmp.Height; y++) {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 220 || c.G < 220 || c.B < 220) dark++;
                }
                if (dark > 0) Console.WriteLine("Left col x=" + x + " has " + dark + " dark pixels");
            }
            // Check right 20 columns
            for (int x = bmp.Width - 20; x < bmp.Width; x++) {
                int dark = 0;
                for (int y = 0; y < bmp.Height; y++) {
                    Color c = bmp.GetPixel(x, y);
                    if (c.R < 220 || c.G < 220 || c.B < 220) dark++;
                }
                if (dark > 0) Console.WriteLine("Right col x=" + x + " has " + dark + " dark pixels");
            }
        }
    }
}
