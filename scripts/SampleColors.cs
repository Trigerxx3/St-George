using System;
using System.Drawing;

class Program
{
    static void Main()
    {
        using (Bitmap bmp = new Bitmap(@"D:\St George\public\brand\logo.jpg"))
        {
            Console.WriteLine("Size: " + bmp.Width + "x" + bmp.Height);
            Color cShield = bmp.GetPixel(320, 250);
            Console.WriteLine("Shield: R=" + cShield.R + ", G=" + cShield.G + ", B=" + cShield.B + ", Hue=" + cShield.GetHue());

            Color cDragon = bmp.GetPixel(480, 320);
            Console.WriteLine("Dragon: R=" + cDragon.R + ", G=" + cDragon.G + ", B=" + cDragon.B + ", Hue=" + cDragon.GetHue());

            Color cSwoosh = bmp.GetPixel(100, 300);
            Console.WriteLine("Swoosh: R=" + cSwoosh.R + ", G=" + cSwoosh.G + ", B=" + cSwoosh.B + ", Hue=" + cSwoosh.GetHue());

            Color cText = bmp.GetPixel(200, 400);
            Console.WriteLine("Text: R=" + cText.R + ", G=" + cText.G + ", B=" + cText.B + ", Hue=" + cText.GetHue());
        }
    }
}
