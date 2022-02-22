import { ChangeEvent, Dispatch } from 'react';
import { useQuery } from 'react-query';

import {
  ConverterAction,
  ConverterActionType,
  ConverterState,
  Side,
} from 'components/CurrencyConverter/CurrencyConverter.types';
import { currencyRateFetcher } from 'api/currencyRate';
import { Currency } from 'api/types';
import { Input } from 'components/Input/Input';
import { Select } from 'components/Select/Select';

import { getCurrencySelectItems } from './CurrencyConverterCalculator.utils';

type CurrencyConverterCalculatorProps = {
  converterState: ConverterState;
  dispatch: Dispatch<ConverterAction>;
};

const selectItems = getCurrencySelectItems();

export const CurrencyConverterCalculator = (props: CurrencyConverterCalculatorProps) => {
  const { converterState, dispatch } = props;

  const handleRateLoaded = (updatedRate: number) => {
    dispatch({
      type: ConverterActionType.UPDATE_RATE,
      payload: {
        rate: updatedRate,
      },
    });
  };

  const { data: currencyRate } = useQuery<number, Error>(
    ['currency rate', converterState.symbol[Side.ONE], converterState.symbol[Side.TWO]],
    currencyRateFetcher,
    {
      enabled: Boolean(converterState.symbol[Side.ONE] && converterState.symbol[Side.TWO]),
      onSuccess: handleRateLoaded,
    },
  );

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
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Select
        items={selectItems}
        value={converterState.symbol[Side.ONE]}
        placeholder="Select currency"
        onChange={handleSelectOneChange}
      />
      <Select
        items={selectItems}
        value={converterState.symbol[Side.TWO]}
        placeholder="Select currency"
        onChange={handleSelectTwoChange}
      />
      <Input
        type="number"
        placeholder="Enter amount"
        value={converterState.amount[Side.ONE] || ''}
        onChange={handleInputOneChange}
      />
      <Input
        type="number"
        placeholder="Enter amount"
        value={converterState.amount[Side.TWO] || ''}
        onChange={handleInputTwoChange}
      />
    </div>
  );
};
