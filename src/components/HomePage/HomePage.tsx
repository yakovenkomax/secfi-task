import Head from 'next/head';
import { useQuery } from 'react-query';

import { currencyRateFetcher } from 'src/api/currencyRate';
import { Currency } from 'src/api/types';

export const HomePage = () => {
  const { data } = useQuery('currency rates', () =>
    currencyRateFetcher({
      from_currency: Currency.USD,
      to_currency: Currency.EUR,
    }),
  );

  return (
    <div>
      <Head>
        <title>Currency Converter</title>
        <meta name="description" content="Test assignment for Secfi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <pre>{JSON.stringify(data, null, '\t')}</pre>
      </main>
    </div>
  );
};
