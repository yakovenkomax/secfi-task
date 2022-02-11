import { fetcher, FetcherFunction } from 'src/api/fetcher';
import { Currency } from 'src/api/types';

type CurrencyRate = {
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

export type CurrencyRateFetcherParams = {
  from_currency: Currency;
  to_currency: Currency;
};

export const currencyRateFetcher = (params: CurrencyRateFetcherParams) => {
  return fetcher<CurrencyRate>({ function: FetcherFunction.CURRENCY_EXCHANGE_RATE, ...params });
};
