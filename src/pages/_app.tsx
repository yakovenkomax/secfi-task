import 'styles/reset.css';
import 'styles/normalize.css';
import 'styles/global.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

const DATA_STALE_TIME = 10 * 60 * 1000; // 10 min
const ERROR_RETRY_DELAY = 10 * 1000; // 10 sec

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: ERROR_RETRY_DELAY,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: DATA_STALE_TIME,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
