// src/app/layout.js
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';


export const metadata = {
  title: 'Website Building Platform',
  description: 'Build your dream website with our interactive 3D platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body>
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}