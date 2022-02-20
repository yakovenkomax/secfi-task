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

type ConverterAction = SetCurrencyAction | SetAmountAction | UpdateRateAction;

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

export const initialConverterState: ConverterState = {
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

const getDestinationSideAmount = (state: ConverterState, rate: number | undefined) => {
  let destinationRate;
  let destinationSideAmount;

  if (rate) {
    destinationRate = state.sourceSide === Side.ONE ? rate : 1 / rate;
  }

  if (state.sourceSide && destinationRate) {
    const sourceAmount = state.amount[state.sourceSide];

    destinationSideAmount = sourceAmount && sourceAmount * destinationRate;
  }

  return destinationSideAmount;
};

export const converterReducer = (state: ConverterState, action: ConverterAction): ConverterState => {
  const { rate } = action.payload;

  switch (action.type) {
    case ConverterActionType.SET_CURRENCY: {
      const { side, symbol } = action.payload;
      const anotherSide = side === Side.ONE ? Side.TWO : Side.ONE;

      if (state.symbol[anotherSide] === symbol) {
        return {
          ...state,
          symbol: {
            ...state.symbol,
            [side]: state.symbol[anotherSide],
            [anotherSide]: state.symbol[side],
          },
          amount: {
            ...state.amount,
            [side]: state.amount[anotherSide],
            [anotherSide]: state.amount[side],
          },
        };
      }

      const destinationSide = state.sourceSide ? (state.sourceSide === Side.ONE ? Side.TWO : Side.ONE) : undefined;
      const destinationSideAmount = getDestinationSideAmount(state, rate);

      return {
        ...state,
        symbol: {
          ...state.symbol,
          [side]: symbol,
        },
        amount: {
          ...state.amount,
          ...(destinationSide && { [destinationSide]: destinationSideAmount }),
        },
      };
    }
    case ConverterActionType.SET_AMOUNT: {
      const { side, amount } = action.payload;
      const intermediateState = {
        ...state,
        amount: {
          ...state.amount,
          [side]: amount,
        },
        sourceSide: side,
      };

      const destinationSide = side === Side.ONE ? Side.TWO : Side.ONE;
      const destinationSideAmount = getDestinationSideAmount(intermediateState, rate);

      return {
        ...intermediateState,
        amount: {
          ...intermediateState.amount,
          ...(destinationSide && { [destinationSide]: destinationSideAmount }),
        },
      };
    }
    case ConverterActionType.UPDATE_RATE: {
      const destinationSide = state.sourceSide ? (state.sourceSide === Side.ONE ? Side.TWO : Side.ONE) : undefined;
      const destinationSideAmount = getDestinationSideAmount(state, rate);

      return {
        ...state,
        amount: {
          ...state.amount,
          ...(destinationSide && { [destinationSide]: destinationSideAmount }),
        },
      };
    }
    default:
      throw new Error('Wrong currency converter action type');
  }
};
