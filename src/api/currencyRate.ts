import { QueryFunction } from 'react-query/types/core/types';

import { fetcher } from 'api/fetcher';
import { Currency, FetcherFunction } from 'api/types';

type CurrencyRateData = {
  'Realtime Currency Exchange Rate': {
    '1. From_Currency Code': Currency;
    '2. From_Currency Name': string;
    '3. To_Currency Code': Currency;
    '4. To_Currency Name': string;
    '5. Exchange Rate': number;
    '6. Last Refreshed': string;
    '7. Time Zone': string;
    '8. Bid Price': number;
    '9. Ask Price': number;
  };
};

export const currencyRateFetcher: QueryFunction<number> = async params => {
  const { queryKey } = params;
  const [, from_currency, to_currency] = queryKey;

  if (typeof from_currency !== 'string' || typeof to_currency !== 'string') {
    throw new Error('Wrong query key');
  }

  const currencyRateData = await fetcher<CurrencyRateData>({
    function: FetcherFunction.CURRENCY_EXCHANGE_RATE,
    from_currency,
    to_currency,
  });

  const rate = Number(currencyRateData['Realtime Currency Exchange Rate']['5. Exchange Rate']);

  return rate;
};
