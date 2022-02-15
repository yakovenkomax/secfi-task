import qs from 'qs';

type ApiLimitExceededError = {
  Note: string;
};

type Fetcher = <T>(params: Record<string, string>) => Promise<T | ApiLimitExceededError>;

export const fetcher: Fetcher = async params => {
  const query = qs.stringify(params);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}?apikey=${process.env.NEXT_PUBLIC_API_KEY}&${query}`);

  if (!response.ok) {
    throw new Error('Network error');
  }

  const data = await response.json();

  return data;
};
