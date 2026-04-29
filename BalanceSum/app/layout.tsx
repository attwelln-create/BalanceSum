
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BalanceSum - Aprende Sumando',
  description: 'Un juego educativo para niños para aprender matemáticas con un sube y baja.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
