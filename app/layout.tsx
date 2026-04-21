import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BackToTop from "@/components/back-to-top";
import Providers from "@/components/providers";
import PageLoader from "@/components/page-loader";
import { MusicPlayerButton } from "@/components/music-player-button";
import MusicHintAlert from "@/components/music-hint-alert";
import VisitorTracker from "@/components/visitor-tracker";
import { getProfile } from "@/app/actions/profile";

const font = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://iqbalfir.vercel.app'),
  title: {
    default: "M Iqbal Firmansyah | Portfolio",
    template: "%s | M Iqbal Firmansyah"
  },
  description: "Clean, minimal, and professional portfolio of M Iqbal Firmansyah - Web Developer & UI Designer. Explore my projects, skills, and experiences.",
  keywords: ["M Iqbal Firmansyah", "Web Developer", "UI Designer", "Frontend Developer", "React Developer", "Next.js", "Portfolio", "Indonesia"],
  authors: [{ name: "M Iqbal Firmansyah", url: "https://iqbalfir.vercel.app" }],
  creator: "M Iqbal Firmansyah",
  applicationName: "Iqbal Portfolio",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Iqbal Portfolio",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "M Iqbal Firmansyah | Web Developer & UI Designer",
    description: "Clean, minimal, and professional portfolio of M Iqbal Firmansyah. Explore my projects, skills, and experiences.",
    url: "https://iqbalfir.vercel.app",
    siteName: "M Iqbal Firmansyah Portfolio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M Iqbal Firmansyah | Portfolio",
    description: "Clean, minimal, and professional portfolio of M Iqbal Firmansyah - Web Developer & UI Designer.",
    creator: "@iqbalfir",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <PageLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <VisitorTracker />
            <div className="flex min-h-screen flex-col relative text-primary">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <BackToTop />
              <MusicHintAlert />
              <MusicPlayerButton />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
