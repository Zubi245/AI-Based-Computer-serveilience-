import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import TopNavbar from '@/components/TopNavbar';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | TexVision AI',
    default: 'TexVision AI - AI-Based Surveillance System',
  },
  description:
    'TexVision AI - AI-Based Computer Vision Surveillance System designed specifically for Textile Industries. Real-time monitoring, AI-powered violation detection, and advanced analytics for factory safety and compliance.',
  keywords: [
    'TexVision AI',
    'surveillance system',
    'computer vision',
    'AI detection',
    'textile industry',
    'factory safety',
    'compliance monitoring',
    'CCTV monitoring',
  ],
  authors: [{ name: 'TexVision AI Team' }],
  creator: 'TexVision AI',
  publisher: 'TexVision AI',
  robots: 'index, follow',
  openGraph: {
    title: 'TexVision AI - AI-Based Surveillance System',
    description:
      'Real-time monitoring, AI-powered violation detection, and advanced analytics for factory safety and compliance.',
    url: 'https://texvision.ai',
    siteName: 'TexVision AI',
    images: [
      {
        url: '/favicon.svg',
        width: 512,
        height: 512,
        alt: 'TexVision AI Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TexVision AI - AI-Based Surveillance System',
    description:
      'Real-time monitoring, AI-powered violation detection, and advanced analytics for factory safety and compliance.',
    images: ['/favicon.svg'],
    creator: '@texvisionai',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-navy-900 text-white antialiased" suppressHydrationWarning>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0f1729',
              color: '#fff',
              border: '1px solid #1e3a5f',
            },
          }}
        />
        <TopNavbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto pl-64 pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
