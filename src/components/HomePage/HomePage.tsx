import Head from 'next/head';
import { useQuery } from 'react-query';

import { currencyRateFetcher } from 'src/api/currencyRate';
import { dailyRatesFetcher } from 'src/api/dailyRates';
import { Currency } from 'src/api/types';

export const HomePage = () => {
  const { data: currencyRateData } = useQuery('currency rates', () =>
    currencyRateFetcher({
      from_currency: Currency.USD,
      to_currency: Currency.EUR,
    }),
  );

  const { data: dailyRatesData } = useQuery('daily rates', () =>
    dailyRatesFetcher({
      from_symbol: Currency.USD,
      to_symbol: Currency.EUR,
      outputsize: 'full',
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
        <pre>{JSON.stringify(currencyRateData, null, '\t')}</pre>
        <pre>{JSON.stringify(dailyRatesData, null, '\t')}</pre>
      </main>
    </div>
  );
};
