using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo-clean-emblem.png"))
        {
            Console.WriteLine("Border check for clean emblem:");
            // Check top 3 rows, bottom 3 rows, left 3 cols, right 3 cols
            int topCount = 0, botCount = 0, leftCount = 0, rightCount = 0;
            for (int x = 0; x < bmp.Width; x++)
            {
                if (bmp.GetPixel(x, 0).A > 0) topCount++;
                if (bmp.GetPixel(x, bmp.Height - 1).A > 0) botCount++;
            }
            for (int y = 0; y < bmp.Height; y++)
            {
                if (bmp.GetPixel(0, y).A > 0) leftCount++;
                if (bmp.GetPixel(bmp.Width - 1, y).A > 0) rightCount++;
            }
            Console.WriteLine("Top border visible pixels: " + topCount);
            Console.WriteLine("Bottom border visible pixels: " + botCount);
            Console.WriteLine("Left border visible pixels: " + leftCount);
            Console.WriteLine("Right border visible pixels: " + rightCount);
        }
    }
}
