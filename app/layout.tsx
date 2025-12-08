// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from './providers'; // <-- new client component
import Script from 'next/script';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FloatingCallButton from '@/components/FloatingCallButton';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  title: 'Syed gifts',
  description: 'Syed gifts - Your one-stop shop for all occasions!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2630931557252341');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* NoScript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2630931557252341&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body className={`${nunito.className} bg-background text-foreground`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow ">{children}</main>
            <Footer />
            <FloatingCallButton />
            <FloatingWhatsApp />
          </div>
        </Providers>
      </body>
    </html>
  );
}
