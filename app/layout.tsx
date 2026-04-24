import { Plus_Jakarta_Sans as FontBody } from "next/font/google";
import "./globals.css";

const plusJakarta = FontBody({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Fruitly | Soluciones DRC",
  description: "Gestión premium para el sector hortofrutícola",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-body">
        {children}
      </body>
    </html>
  );
}
