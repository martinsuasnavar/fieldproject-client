import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar"; // ✅ Importación correcta

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Field Project",
  description: "Sistema de gestión de usuarios y proyectos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        {/* ✅ La Navbar ahora envuelve a toda la aplicación */}
        <Navbar />
        
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}