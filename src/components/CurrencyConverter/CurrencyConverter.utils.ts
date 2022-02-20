import { DailyRate } from 'api/dailyRates';

export enum DailyRatesTrend {
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  POSITIVE = 'positive',
}

const TREND_CHANGE_THRESHOLD = 0.01;

export const getDailyRatesTrend = (dailyRates?: DailyRate[]) => {
  if (!dailyRates) {
    return DailyRatesTrend.NEUTRAL;
  }

  const startRate = dailyRates[0].value;
  const endRate = dailyRates[dailyRates.length - 1].value;
  const absoluteDifference = endRate - startRate;
  const relativeDifference = absoluteDifference / startRate;

  if (relativeDifference < 0 && relativeDifference < -1 * TREND_CHANGE_THRESHOLD) {
    return DailyRatesTrend.NEGATIVE;
  }

  if (relativeDifference > 0 && relativeDifference > TREND_CHANGE_THRESHOLD) {
    return DailyRatesTrend.POSITIVE;
  }

  return DailyRatesTrend.NEUTRAL;
};
