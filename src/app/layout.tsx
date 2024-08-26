'use client'
import { Inter } from "next/font/google";
import { ThemeProvider } from '@mui/material/styles';
import { UserProvider } from '@/context/UserContext';
import { theme } from '@/lib/theme';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content={`Circle`} />
        <title>{`Circle`}</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      
      <body className={inter.className} style={{background: 'white'}}>
        <ThemeProvider theme={theme}>
          <UserProvider>
            {children}
            <Analytics />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
