import add from 'date-fns/add';
import isAfter from 'date-fns/isAfter';
import { QueryFunction } from 'react-query/types/core/types';

import { fetcher } from 'api/fetcher';
import { Currency, FetcherFunction } from 'api/types';

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

export type DailyRate = {
  name: string;
  value: number;
};

export const dailyRatesFetcher: QueryFunction<DailyRate[]> = async params => {
  const { queryKey } = params;
  const [, from_symbol, to_symbol] = queryKey;

  if (typeof from_symbol !== 'string' || typeof to_symbol !== 'string') {
    throw new Error('Wrong query key');
  }

  const dailyRatesData = await fetcher<DailyRateData>({
    function: FetcherFunction.FX_DAILY,
    from_symbol,
    to_symbol,
  });

  const dailyRates = dailyRatesData['Time Series FX (Daily)'];

  const monthAgoDate = add(new Date(Date.now()), { days: -31 });
  const dailyRatesArray = Object.keys(dailyRates)
    .filter(key => isAfter(new Date(key), monthAgoDate))
    .reverse()
    .map(key => ({
      name: new Date(key).toLocaleString('default', { month: 'short', day: 'numeric' }),
      value: Number(dailyRates[key]['4. close']),
    }));

  return dailyRatesArray;
};
