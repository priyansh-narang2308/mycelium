import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Carbon Pulse',
  description: 'AI-powered personal carbon coach.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-canvas text-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
