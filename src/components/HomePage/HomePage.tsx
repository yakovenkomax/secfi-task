import Head from 'next/head';
import { ChangeEvent, useReducer } from 'react';
import { useQuery } from 'react-query';

import { currencyRateFetcher } from 'api/currencyRate';
// import { dailyRatesFetcher } from 'api/dailyRates';
import { Currency, CurrencyNameMap } from 'api/types';
import {
  ConverterActionType,
  converterReducer,
  initialConverterState,
  Side,
} from 'components/HomePage/converterReducer/converterReducer';
import { Input } from 'components/Input/Input';
import { Select } from 'components/Select/Select';

const selectItems = Object.values(Currency)
  .map(symbol => ({
    label: CurrencyNameMap[symbol],
    value: symbol,
  }))
  .sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }

    if (a.label > b.label) {
      return 1;
    }

    return 0;
  });

export const HomePage = () => {
  const [formState, dispatch] = useReducer(converterReducer, initialConverterState);

  const handleRateLoaded = (updatedRate: number) => {
    dispatch({
      type: ConverterActionType.UPDATE_RATE,
      payload: {
        rate: updatedRate,
      },
    });
  };

  const { data: currencyRate } = useQuery<number, Error>(
    [formState.symbol[Side.ONE], formState.symbol[Side.TWO]],
    currencyRateFetcher,
    {
      enabled: Boolean(formState.symbol[Side.ONE] && formState.symbol[Side.TWO]),
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
    dispatch({
      type: ConverterActionType.SET_CURRENCY,
      payload: {
        symbol: event.target.value as Currency,
        side: Side.ONE,
        rate: currencyRate,
      },
    });
  };

  const handleSelectTwoChange = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: ConverterActionType.SET_CURRENCY,
      payload: {
        symbol: event.target.value as Currency,
        side: Side.TWO,
        rate: currencyRate,
      },
    });
  };

  const handleInputOneChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ConverterActionType.SET_AMOUNT,
      payload: {
        amount: event.target.valueAsNumber,
        side: Side.ONE,
        rate: currencyRate,
      },
    });
  };

  const handleInputTwoChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ConverterActionType.SET_AMOUNT,
      payload: {
        amount: event.target.valueAsNumber,
        side: Side.TWO,
        rate: currencyRate,
      },
    });
  };

  return (
    <div className="flex justify-center align-middle">
      <Head>
        <title>Currency Converter</title>
        <meta name="description" content="Test assignment for Secfi" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="p-4 grid grid-cols-2 grid-rows-2 gap-4">
        <Select
          items={selectItems}
          value={formState.symbol[Side.ONE]}
          placeholder="Select currency"
          onChange={handleSelectOneChange}
        />
        <Select
          items={selectItems}
          value={formState.symbol[Side.TWO]}
          placeholder="Select currency"
          onChange={handleSelectTwoChange}
        />
        <Input type="number" value={formState.amount[Side.ONE]} onChange={handleInputOneChange} />
        <Input type="number" value={formState.amount[Side.TWO]} onChange={handleInputTwoChange} />
      </main>
    </div>
  );
};
