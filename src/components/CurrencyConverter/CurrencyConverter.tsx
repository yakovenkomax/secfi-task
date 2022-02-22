import { useReducer } from 'react';

import { Card } from 'components/Card/Card';
import { CurrencyConverterCalculator } from 'components/CurrencyConverter/CurrencyConverterCalculator/CurrencyConverterCalculator';
import { CurrencyConverterChart } from 'components/CurrencyConverter/CurrencyConverterChart/CurrencyConverterChart';

import { converterReducer, initialConverterState } from './converterReducer/converterReducer';

export const CurrencyConverter = () => {
  const [converterState, dispatch] = useReducer(converterReducer, initialConverterState);

  return (
    <Card className="flex flex-col space-y-4 md:space-y-8">
      <CurrencyConverterCalculator converterState={converterState} dispatch={dispatch} />
      <CurrencyConverterChart converterState={converterState} />
    </Card>
  );
};
