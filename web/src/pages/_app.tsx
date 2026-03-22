import type { AppProps } from 'next/app';
import ThemeRegistry from '@/components/ThemeRegistry';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeRegistry>
      <Component {...pageProps} />
    </ThemeRegistry>
  );
}
