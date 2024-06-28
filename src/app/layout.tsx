import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Provider from '@/provider/Provider';
import { Toaster } from '@/components/ui/toaster';
import { server_useUserInfo } from '@/hooks/user';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'product',
  description: 'info',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user } = await server_useUserInfo();

  return (
    <Provider>
      <html lang='en'>
        <body className={inter.className}>
          <main>{children} </main>
          <Toaster />
        </body>
      </html>
    </Provider>
  );
};

export default RootLayout;
