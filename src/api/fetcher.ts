import qs from 'qs';

type Fetcher = <T>(params: Record<string, string>) => Promise<T>;

export const fetcher: Fetcher = async params => {
  const query = qs.stringify(params);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?apikey=${process.env.NEXT_PUBLIC_API_KEY}&${query}`);

  if (!response.ok) {
    throw new Error('Network error');
  }

  const data = await response.json();

  if ('Error Message' in data) {
    throw new Error('API error');
  }

  if ('Note' in data) {
    throw new Error('API limit exceeded');
  }

  return data;
};
