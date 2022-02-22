import { useQuery } from 'react-query';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import { ConverterState, Side } from 'components/CurrencyConverter/CurrencyConverter.types';
import { DailyRate, dailyRatesFetcher } from 'api/dailyRates';

import ChartSvg from './images/chart.svg';
import { DailyRatesTrend, getDailyRatesTrend } from './CurrencyConverterChart.utils';

type CurrencyConverterChartProps = {
  converterState: ConverterState;
};

export const CurrencyConverterChart = (props: CurrencyConverterChartProps) => {
  const { converterState } = props;

  const { data: dailyRates } = useQuery<DailyRate[], Error>(
    ['daily rates', converterState.symbol[Side.ONE], converterState.symbol[Side.TWO]],
    dailyRatesFetcher,
    {
      enabled: Boolean(converterState.symbol[Side.ONE] && converterState.symbol[Side.TWO]),
    },
  );

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
      {!dailyRates && (
        <div className="w-full h-[300px] bg-neutral-50 rounded-xl relative">
          <ChartSvg className="absolute left-1/2 top-1/2 -ml-6 -mt-6 w-12 h-12 fill-neutral-200 pointer-events-none" />
        </div>
      )}
      {dailyRates && (
        <ResponsiveContainer width="99%" height={300}>
          <AreaChart data={dailyRates} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <defs>
              <linearGradient id="colorRates" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f1f1" vertical={false} />
            <XAxis
              dataKey="name"
              interval={6}
              axisLine={{ display: 'none' }}
              tickLine={{ display: 'none' }}
              tick={{ fontSize: 12, fill: '#bababa' }}
            />
            <YAxis
              type="number"
              domain={YAxisDomain}
              width={40}
              axisLine={{ display: 'none' }}
              tickLine={{ display: 'none' }}
              tick={{ fontSize: 12, fill: '#bababa' }}
            />
            <Tooltip
              isAnimationActive={false}
              contentStyle={{ borderRadius: '0.75em', borderColor: '#bababa' }}
              cursor={{ stroke: '#bababa', strokeDasharray: '3 3' }}
            />
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
