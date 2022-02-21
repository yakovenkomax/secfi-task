import { ChangeEvent, useReducer } from 'react';
import { useQuery } from 'react-query';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import { currencyRateFetcher } from 'api/currencyRate';
import { DailyRate, dailyRatesFetcher } from 'api/dailyRates';
import { Currency } from 'api/types';
import { Input } from 'components/Input/Input';
import { Select } from 'components/Select/Select';

import {
  ConverterActionType,
  converterReducer,
  initialConverterState,
  Side,
} from './converterReducer/converterReducer';
import { DailyRatesTrend, getCurrencySelectItems, getDailyRatesTrend } from './CurrencyConverter.utils';

const DATA_STALE_TIME = 10 * 60 * 1000; // 10 min

const selectItems = getCurrencySelectItems();

export const CurrencyConverter = () => {
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
    ['currency rate', formState.symbol[Side.ONE], formState.symbol[Side.TWO]],
    currencyRateFetcher,
    {
      enabled: Boolean(formState.symbol[Side.ONE] && formState.symbol[Side.TWO]),
      onSuccess: handleRateLoaded,
      staleTime: DATA_STALE_TIME,
    },
  );

  const { data: dailyRates } = useQuery<DailyRate[], Error>(
    ['daily rates', formState.symbol[Side.ONE], formState.symbol[Side.TWO]],
    dailyRatesFetcher,
    {
      enabled: Boolean(formState.symbol[Side.ONE] && formState.symbol[Side.TWO]),
      staleTime: DATA_STALE_TIME,
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

  const strokeColorMap = {
    [DailyRatesTrend.POSITIVE]: '#52b460',
    [DailyRatesTrend.NEGATIVE]: '#f57373',
    [DailyRatesTrend.NEUTRAL]: '#bebebe',
  };

  const YAxisDomain: AxisDomain = [
    (dataMin: number) => (dataMin * 0.995).toFixed(2),
    (dataMax: number) => (dataMax * 1.005).toFixed(2),
  ];
  const dailyRatesTrend = getDailyRatesTrend(dailyRates);
  const strokeColor = strokeColorMap[dailyRatesTrend];

  return (
    <>
      <div className="p-4 grid grid-cols-2 grid-rows-2 gap-4">
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
        <Input type="number" value={formState.amount[Side.ONE] || ''} onChange={handleInputOneChange} />
        <Input type="number" value={formState.amount[Side.TWO] || ''} onChange={handleInputTwoChange} />
      </div>

      {dailyRates && (
        <ResponsiveContainer width="99%" height={300}>
          <AreaChart data={dailyRates} margin={{ top: 10, right: 25, bottom: 10, left: 10 }}>
            <defs>
              <linearGradient id="colorRates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f1f1" vertical={false} />
            <XAxis
              dataKey="name"
              interval={4}
              axisLine={{ stroke: '#c0c0c0' }}
              tickLine={{ stroke: '#c0c0c0' }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              domain={YAxisDomain}
              width={40}
              axisLine={{ stroke: '#c0c0c0' }}
              tickLine={{ stroke: '#c0c0c0' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip isAnimationActive={false} />
            <Area
              type="linear"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRates)"
              name="Rate"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </>
  );
};
