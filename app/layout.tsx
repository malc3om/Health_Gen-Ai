import type { Metadata } from "next";
import { Inter, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThreeBackground from "@/components/ThreeBackground";
import { HealthDataProvider } from "@/context/HealthDataContext";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: '--font-roboto'
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: '--font-roboto-mono'
});

export const metadata: Metadata = {
  title: "HealthAI Guardian - AI-Driven Health Monitoring",
  description: "Predictive health monitoring system for chronic disease management using AI",
  keywords: ["health", "AI", "monitoring", "chronic disease", "predictive analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${roboto.variable} ${robotoMono.variable} font-mono`}>
        <HealthDataProvider>
          <div className="flex h-screen overflow-hidden bg-dark-bg">
            <ThreeBackground />
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative z-10">
              {children}
            </main>
          </div>
        </HealthDataProvider>
      </body>
    </html>
  );
}
