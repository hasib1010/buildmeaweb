// app/layout.js
import { Inter } from 'next/font/google';
import './globals.css';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

// Metadata for the application
export const metadata = {
  title: 'Website Builder Service',
  description: 'Professional website building plans for businesses and individuals',
};

// Root layout component that wraps all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* This is where Header component would go */}
        <main className="min-h-screen">
          {children}
        </main>
        {/* This is where Footer component would go */}
      </body>
    </html>
  );
}