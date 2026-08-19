import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const siteUrl = 'https://jenjo.ai';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jenjo AI — Learn the Jenjo Language',
    template: '%s | Jenjo AI',
  },
  description:
    'Jenjo AI helps you learn Jenjo, the language of the Dza people of Taraba State, Nigeria, through interactive lessons powered by AI.',
  keywords: [
    'Jenjo',
    'Jenjo AI',
    'Dza people',
    'Taraba State',
    'Nigerian languages',
    'learn Jenjo',
    'language learning',
    'endangered languages',
  ],
  authors: [{ name: 'Lemuel Emmanuel' }],
  creator: 'Lemuel Emmanuel',
  publisher: 'Jenjo AI',
  applicationName: 'Jenjo AI',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Jenjo AI',
    title: 'Jenjo AI — Learn the Jenjo Language',
    description:
      'Learn Jenjo, the language of the Dza people of Taraba State, Nigeria, through interactive lessons powered by AI.',
    images: [{ url: '/logo.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jenjo AI — Learn the Jenjo Language',
    description:
      'Learn Jenjo, the language of the Dza people of Taraba State, Nigeria, through interactive lessons powered by AI.',
    images: ['/logo.png'],
  },
  verification: {
    google: 'bRt5egSDeIAzEE3xAZw6zm7SNstUstVm3XvelTlDVJ8',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
