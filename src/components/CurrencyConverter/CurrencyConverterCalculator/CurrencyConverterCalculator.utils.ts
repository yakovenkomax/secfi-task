import { Currency, CurrencyNameMap } from 'api/types';

export const getCurrencySelectItems = () => {
  return Object.values(Currency)
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
};
