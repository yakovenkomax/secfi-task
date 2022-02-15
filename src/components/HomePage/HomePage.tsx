import Head from 'next/head';
import { ChangeEvent, useState } from 'react';
import { useQuery } from 'react-query';

import { currencyRateFetcher } from 'src/api/currencyRate';
// import { dailyRatesFetcher } from 'src/api/dailyRates';
import { Currency, CurrencyNameMap } from 'src/api/types';
import { Input } from 'src/components/Input/Input';
import { Select } from 'src/components/Select/Select';

const selectItems = Object.values(Currency).map(symbol => ({
  label: CurrencyNameMap[symbol],
  value: symbol,
}));

enum Side {
  ONE,
  TWO,
}

type FormState = {
  symbolOne: Currency | undefined;
  symbolTwo: Currency | undefined;
  amountOne: number | '';
  amountTwo: number | '';
  lastChanged: Side | undefined;
};

const initialState: FormState = {
  symbolOne: undefined,
  symbolTwo: undefined,
  amountOne: '',
  amountTwo: '',
  lastChanged: undefined,
};

export const HomePage = () => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const handleRateLoaded = (rate: number) => {
    if (formState.lastChanged === Side.ONE) {
      setFormState({
        ...formState,
        ...(formState.amountOne && { amountTwo: formState.amountOne * rate }),
      });

      return;
    }

    setFormState({
      ...formState,
      ...(formState.amountTwo && { amountOne: formState.amountTwo / rate }),
    });
  };

  const { data: currencyRate } = useQuery<number, Error>(
    [formState.symbolOne, formState.symbolTwo],
    currencyRateFetcher,
    {
      enabled: Boolean(formState.symbolOne && formState.symbolTwo),
      onSuccess: handleRateLoaded,
    },
  );

  // const { data: dailyRatesData } = useQuery('daily rates', () =>
  //   dailyRatesFetcher({
  //     from_symbol: Currency.USD,
  //     to_symbol: Currency.EUR,
  //     outputsize: 'full',
  //   }),
  // );

  const handleSelectOneChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormState({
      ...formState,
      symbolOne: event.target.value as Currency,
      ...(currencyRate && formState.amountOne && { amountTwo: formState.amountOne * currencyRate }),
    });
  };

  const handleSelectTwoChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormState({
      ...formState,
      symbolTwo: event.target.value as Currency,
      ...(currencyRate && formState.amountTwo && { amountOne: formState.amountTwo / currencyRate }),
    });
  };

  const handleInputOneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isValueCleared = event.target.value === '';

    setFormState({
      ...formState,
      amountOne: isValueCleared ? '' : event.target.valueAsNumber,
      ...(currencyRate && !isValueCleared && { amountTwo: event.target.valueAsNumber * currencyRate }),
      lastChanged: Side.ONE,
    });
  };

  const handleInputTwoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isValueCleared = event.target.value === '';

    setFormState({
      ...formState,
      amountTwo: isValueCleared ? '' : event.target.valueAsNumber,
      ...(currencyRate && !isValueCleared && { amountOne: event.target.valueAsNumber / currencyRate }),
      lastChanged: Side.TWO,
    });
  };

  return (
    <div>
      <Head>
        <title>Currency Converter</title>
        <meta name="description" content="Test assignment for Secfi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Select
          items={selectItems}
          value={formState.symbolOne}
          placeholder="Select currency"
          onChange={handleSelectOneChange}
        />
        <Select
          items={selectItems}
          value={formState.symbolTwo}
          placeholder="Select currency"
          onChange={handleSelectTwoChange}
        />
        <Input type="number" value={formState.amountOne} onChange={handleInputOneChange} />
        <Input type="number" value={formState.amountTwo} onChange={handleInputTwoChange} />
      </main>
    </div>
  );
};
