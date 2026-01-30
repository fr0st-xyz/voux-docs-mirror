import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Voux Docs',
  description: 'Documentation for Voux.',
  openGraph: {
    title: 'Voux Docs',
    description: 'Documentation for Voux.',
    images: [
      {
        url: '/assets/banner.png',
        width: 1200,
        height: 630,
        alt: 'Voux Docs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voux Docs',
    description: 'Documentation for Voux.',
    images: ['/assets/banner.png'],
  },
  icons: {
    icon: [
      {
        url: '/assets/logo-dark.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/assets/logo-light.svg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
