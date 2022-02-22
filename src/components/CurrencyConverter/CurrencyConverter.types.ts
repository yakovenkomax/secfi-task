import { Currency } from 'api/types';

export enum Side {
  ONE = 'one',
  TWO = 'two',
}

export enum ConverterActionType {
  SET_CURRENCY = 'set-currency',
  SET_AMOUNT = 'set-amount',
  UPDATE_RATE = 'update-rate',
}

export type SetCurrencyAction = {
  type: ConverterActionType.SET_CURRENCY;
  payload: {
    symbol: Currency;
    side: Side;
    rate?: number;
  };
};

export type SetAmountAction = {
  type: ConverterActionType.SET_AMOUNT;
  payload: {
    amount?: number;
    side: Side;
    rate?: number;
  };
};

export type UpdateRateAction = {
  type: ConverterActionType.UPDATE_RATE;
  payload: {
    rate: number;
  };
};

export type ConverterAction = SetCurrencyAction | SetAmountAction | UpdateRateAction;

export type ConverterState = {
  symbol: {
    [Side.ONE]: Currency | undefined;
    [Side.TWO]: Currency | undefined;
  };
  amount: {
    [Side.ONE]: number | undefined;
    [Side.TWO]: number | undefined;
  };
  sourceSide: Side | undefined;
};
