import { Metadata } from "next";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Offline | M Iqbal Firmansyah",
};

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-muted p-6 rounded-full mb-6">
        <WifiOff className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-3">You are offline</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        It seems there's a problem with your connection. Please check your network settings and try again to view my portfolio.
      </p>
      <a 
        href="/" 
        className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium inline-block"
      >
        Try Again
      </a>
    </div>
  );
}
