import Script from "next/script";
import { Lora, Poppins, Anek_Malayalam, Arimo, Catamaran, Roboto, Plus_Jakarta_Sans, Zen_Dots } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import StyledJsxRegistry from "../lib/StyledJsxRegistry";
import "./globals.css";

// Global CSS imports
import "./styles/bootstrap.min.css";
import "./styles/slicknav.min.css";
import "./styles/swiper-bundle.min.css";
import "./styles/all.min.css";
import "./styles/animate.css";
import "./styles/magnific-popup.css";
import "./styles/mousecursor.css";
import "./styles/custom.css";
import "./styles/header.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const anekMalayalam = Anek_Malayalam({
  subsets: ["latin"],
  variable: "--font-anek",
  display: "swap",
});

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
  display: "swap",
});

const catamaran = Catamaran({
  subsets: ["latin"],
  variable: "--font-catamaran",
  display: "swap",
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const zenDots = Zen_Dots({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-dots",
  display: "swap",
});

export const metadata = {
  title: "MyMelova | Premium Chocolate Factory & Artisanal Chocolates",
  description:
    "Discover MyMelova, a premium chocolate factory crafting artisanal chocolates and cocoa delights. Indulge in our handcrafted creations made from the finest ingredients.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${lora.variable} ${poppins.variable} ${anekMalayalam.variable} ${arimo.variable} ${catamaran.variable} ${roboto.variable} ${plusJakartaSans.variable} ${zenDots.variable}`}>

      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <link href="https://fonts.googleapis.com/css2?family=Story+Script&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        <AuthProvider>
          <StyledJsxRegistry>{children}</StyledJsxRegistry>
        </AuthProvider>

        <Script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/js/gsap.min.js" strategy="beforeInteractive" />
        <Script src="/js/ScrollTrigger.min.js" strategy="beforeInteractive" />
        <Script src="/js/bootstrap.min.js" strategy="lazyOnload" />
        <Script src="/js/validator.min.js" strategy="lazyOnload" />
        <Script src="/js/jquery.slicknav.js" strategy="lazyOnload" />
        <Script src="/js/swiper-bundle.min.js" strategy="lazyOnload" />
        <Script src="/js/jquery.waypoints.min.js" strategy="lazyOnload" />
        <Script src="/js/jquery.counterup.min.js" strategy="lazyOnload" />
        <Script src="/js/jquery.magnific-popup.min.js" strategy="lazyOnload" />
        <Script src="/js/SmoothScroll.js" strategy="lazyOnload" />
        <Script src="/js/parallaxie.js" strategy="lazyOnload" />
        <Script src="/js/SplitText.js" strategy="lazyOnload" />
        <Script src="/js/jquery.mb.YTPlayer.min.js" strategy="lazyOnload" />
        <Script src="/js/wow.min.js" strategy="lazyOnload" />
        <Script src="/js/function.js" strategy="lazyOnload" />
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/chart.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
