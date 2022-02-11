import qs from 'qs';

export enum FetcherFunction {
  CURRENCY_EXCHANGE_RATE = 'CURRENCY_EXCHANGE_RATE',
}

type Fetcher = <T>(params: Record<string, string>) => Promise<T>;

export const fetcher: Fetcher = async params => {
  const query = qs.stringify(params);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?apikey=${process.env.NEXT_PUBLIC_API_KEY}&${query}`);
  const data = await response.json();

  return data;
};
