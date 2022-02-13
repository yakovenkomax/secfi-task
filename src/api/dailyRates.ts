import { fetcher } from 'src/api/fetcher';
import { Currency, FetcherFunction } from 'src/api/types';

type DailyRateData = {
  'Meta Data': {
    '1. Information': string;
    '2. From Symbol': Currency;
    '3. To Symbol': Currency;
    '4. Output Size': string;
    '5. Last Refreshed': string;
    '6. Time Zone': string;
  };
  'Time Series FX (Daily)': {
    [key in string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
    };
  };
};

export type DailyRatesFetcherParams = {
  from_symbol: Currency;
  to_symbol: Currency;
  outputsize?: 'compact' | 'full';
};

export const dailyRatesFetcher = (params: DailyRatesFetcherParams) => {
  return fetcher<DailyRateData>({ function: FetcherFunction.FX_DAILY, ...params });
};
