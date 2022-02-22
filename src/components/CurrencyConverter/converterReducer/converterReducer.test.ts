import { Currency } from 'api/types';
import { converterReducer } from 'components/CurrencyConverter/converterReducer/converterReducer';
import {
  ConverterState,
  ConverterActionType,
  SetCurrencyAction,
  SetAmountAction,
  UpdateRateAction,
  Side,
} from 'components/CurrencyConverter/CurrencyConverter.types';

const emptyState: ConverterState = {
  symbol: {
    [Side.ONE]: undefined,
    [Side.TWO]: undefined,
  },
  amount: {
    [Side.ONE]: undefined,
    [Side.TWO]: undefined,
  },
  sourceSide: undefined,
};

const filledState: ConverterState = {
  symbol: {
    [Side.ONE]: Currency.EUR,
    [Side.TWO]: Currency.USD,
  },
  amount: {
    [Side.ONE]: 1,
    [Side.TWO]: 2,
  },
  sourceSide: Side.ONE,
};

describe('converterReducer', () => {
  describe('with SET_CURRENCY action', () => {
    it('sets the currency', () => {
      const setCurrencyOne: SetCurrencyAction = {
        type: ConverterActionType.SET_CURRENCY,
        payload: {
          symbol: Currency.USD,
          side: Side.ONE,
        },
      };

      const setCurrencyTwo: SetCurrencyAction = {
        type: ConverterActionType.SET_CURRENCY,
        payload: {
          symbol: Currency.EUR,
          side: Side.TWO,
        },
      };

      expect(converterReducer(emptyState, setCurrencyOne)).toEqual({
        ...emptyState,
        symbol: {
          ...emptyState.symbol,
          [Side.ONE]: Currency.USD,
        },
      });
      expect(converterReducer(emptyState, setCurrencyTwo)).toEqual({
        ...emptyState,
        symbol: {
          ...emptyState.symbol,
          [Side.TWO]: Currency.EUR,
        },
      });
    });

    it('updates another side amount if amount is set and rate is available', () => {
      const setCurrencyOne: SetCurrencyAction = {
        type: ConverterActionType.SET_CURRENCY,
        payload: {
          symbol: Currency.SEK,
          side: Side.ONE,
          rate: 2,
        },
      };

      const setCurrencyTwo: SetCurrencyAction = {
        type: ConverterActionType.SET_CURRENCY,
        payload: {
          symbol: Currency.SEK,
          side: Side.TWO,
          rate: 2,
        },
      };

      expect(converterReducer(filledState, setCurrencyOne)).toEqual({
        ...filledState,
        symbol: {
          ...filledState.symbol,
          [Side.ONE]: Currency.SEK,
        },
        amount: {
          ...filledState.amount,
          [Side.TWO]: 2,
        },
      });
      expect(converterReducer(filledState, setCurrencyTwo)).toEqual({
        ...filledState,
        symbol: {
          ...filledState.symbol,
          [Side.TWO]: Currency.SEK,
        },
        amount: {
          ...filledState.amount,
          [Side.ONE]: 1,
        },
      });
    });

    it('swaps currencies if they match', () => {
      const setCurrencyOne: SetCurrencyAction = {
        type: ConverterActionType.SET_CURRENCY,
        payload: {
          symbol: Currency.USD,
          side: Side.ONE,
          rate: 2,
        },
      };

      const setCurrencyTwo: SetCurrencyAction = {
        type: ConverterActionType.SET_CURRENCY,
        payload: {
          symbol: Currency.EUR,
          side: Side.TWO,
          rate: 2,
        },
      };

      const finalState = {
        ...filledState,
        symbol: {
          [Side.ONE]: Currency.USD,
          [Side.TWO]: Currency.EUR,
        },
        amount: {
          [Side.ONE]: 2,
          [Side.TWO]: 1,
        },
      };

      expect(converterReducer(filledState, setCurrencyOne)).toEqual(finalState);
      expect(converterReducer(filledState, setCurrencyTwo)).toEqual(finalState);
    });
  });

  describe('with SET_AMOUNT action', () => {
    it('sets amount and conversion source side', () => {
      const setValueOne: SetAmountAction = {
        type: ConverterActionType.SET_AMOUNT,
        payload: {
          side: Side.ONE,
          amount: 1,
        },
      };

      const setValueTwo: SetAmountAction = {
        type: ConverterActionType.SET_AMOUNT,
        payload: {
          side: Side.TWO,
          amount: 1,
        },
      };

      expect(converterReducer(emptyState, setValueOne)).toEqual({
        ...emptyState,
        amount: {
          ...emptyState.amount,
          [Side.ONE]: 1,
        },
        sourceSide: Side.ONE,
      });
      expect(converterReducer(emptyState, setValueTwo)).toEqual({
        ...emptyState,
        amount: {
          ...emptyState.amount,
          [Side.TWO]: 1,
        },
        sourceSide: Side.TWO,
      });
    });

    it('updates another side amount if amount is set and rate is available', () => {
      const setValueOne: SetAmountAction = {
        type: ConverterActionType.SET_AMOUNT,
        payload: {
          side: Side.ONE,
          amount: 10,
          rate: 2,
        },
      };

      const setValueTwo: SetAmountAction = {
        type: ConverterActionType.SET_AMOUNT,
        payload: {
          side: Side.TWO,
          amount: 10,
          rate: 2,
        },
      };

      expect(converterReducer(filledState, setValueOne)).toEqual({
        ...filledState,
        amount: {
          [Side.ONE]: 10,
          [Side.TWO]: 20,
        },
        sourceSide: Side.ONE,
      });
      expect(converterReducer(filledState, setValueTwo)).toEqual({
        ...filledState,
        amount: {
          [Side.ONE]: 5,
          [Side.TWO]: 10,
        },
        sourceSide: Side.TWO,
      });
    });

    it('clears another side amount if cleared', () => {
      const setValueOne: SetAmountAction = {
        type: ConverterActionType.SET_AMOUNT,
        payload: {
          side: Side.ONE,
          amount: undefined,
          rate: 2,
        },
      };

      const setValueTwo: SetAmountAction = {
        type: ConverterActionType.SET_AMOUNT,
        payload: {
          side: Side.TWO,
          amount: undefined,
          rate: 2,
        },
      };

      expect(converterReducer(filledState, setValueOne)).toEqual({
        ...filledState,
        amount: {
          [Side.ONE]: undefined,
          [Side.TWO]: undefined,
        },
        sourceSide: Side.ONE,
      });
      expect(converterReducer(filledState, setValueTwo)).toEqual({
        ...filledState,
        amount: {
          [Side.ONE]: undefined,
          [Side.TWO]: undefined,
        },
        sourceSide: Side.TWO,
      });
    });
  });

  describe('with UPDATE_RATE action', () => {
    it('does not update anything if source amount are not set', () => {
      const noAmountState: ConverterState = {
        symbol: {
          [Side.ONE]: Currency.EUR,
          [Side.TWO]: Currency.USD,
        },
        amount: {
          [Side.ONE]: undefined,
          [Side.TWO]: undefined,
        },
        sourceSide: Side.ONE,
      };

      const updateRate: UpdateRateAction = {
        type: ConverterActionType.UPDATE_RATE,
        payload: {
          rate: 10,
        },
      };

      expect(converterReducer(noAmountState, updateRate)).toEqual(noAmountState);
    });
    it('updates another side amount if source amount is set', () => {
      const filledStateWithSourceTwo: ConverterState = {
        ...filledState,
        sourceSide: Side.TWO,
      };

      const updateRate: UpdateRateAction = {
        type: ConverterActionType.UPDATE_RATE,
        payload: {
          rate: 10,
        },
      };

      expect(converterReducer(filledState, updateRate)).toEqual({
        ...filledState,
        amount: {
          ...filledState.amount,
          [Side.TWO]: 10,
        },
      });
      expect(converterReducer(filledStateWithSourceTwo, updateRate)).toEqual({
        ...filledStateWithSourceTwo,
        amount: {
          ...filledStateWithSourceTwo.amount,
          [Side.ONE]: 0.2,
        },
      });
    });
  });
});
