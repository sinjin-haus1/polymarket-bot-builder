import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Indicator, IndicatorDocument } from './schemas/indicator.schema';
import {
  IndicatorTypeEnum,
  CalculatedIndicator,
} from './entities/indicator.entity';

export interface PriceData {
  prices: number[];
  timestamps?: string[];
}

@Injectable()
export class IndicatorsService {
  constructor(
    @InjectModel(Indicator.name)
    private indicatorModel: Model<IndicatorDocument>,
  ) {}

  // ─── CRUD Operations ───────────────────────────────────────────────────────

  async create(data: Partial<Indicator>): Promise<Indicator> {
    const created = new this.indicatorModel(data);
    return created.save();
  }

  async findAll(): Promise<Indicator[]> {
    return this.indicatorModel.find().exec();
  }

  async findOne(id: string): Promise<Indicator | null> {
    return this.indicatorModel.findById(id).exec();
  }

  async update(
    id: string,
    data: Partial<Indicator>,
  ): Promise<Indicator | null> {
    return this.indicatorModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.indicatorModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  // ─── Indicator Calculations ───────────────────────────────────────────────

  /**
   * Simple Moving Average (SMA)
   * SMA = Sum(price_i for i = 0 to period-1) / period
   */
  calculateSMA({ prices }: PriceData, period: number = 14): number[] {
    if (prices.length < period) return [];
    const result: number[] = [];

    for (let i = period - 1; i < prices.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i - j];
      }
      result.push(sum / period);
    }

    return result;
  }

  /**
   * Exponential Moving Average (EMA)
   * EMA = price_t * k + EMA_prev * (1 - k)
   * where k = 2 / (period + 1)
   */
  calculateEMA({ prices }: PriceData, period: number = 14): number[] {
    if (prices.length < period) return [];
    const result: number[] = [];
    const k = 2 / (period + 1);

    // Seed with SMA for the first value
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += prices[i];
    }
    let ema = sum / period;
    result.push(ema);

    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
      result.push(ema);
    }

    return result;
  }

  /**
   * Relative Strength Index (RSI)
   * RSI = 100 - (100 / (1 + RS))
   * RS = Average Gain / Average Loss over period
   */
  calculateRSI({ prices }: PriceData, period: number = 14): number[] {
    if (prices.length < period + 1) return [];

    const gains: number[] = [];
    const losses: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    const result: number[] = [];

    // First RSI uses simple average
    let avgGain =
      gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss =
      losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      result.push(100 - 100 / (1 + rs));
    }

    // Subsequent RSI uses smoothed average
    for (let i = period; i < gains.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    }

    return result;
  }

  /**
   * Moving Average Convergence Divergence (MACD)
   * MACD Line = EMA_12 - EMA_26
   * Signal Line = EMA_9 of MACD Line
   * Histogram = MACD Line - Signal Line
   */
  calculateMACD({ prices }: PriceData): CalculatedIndicator {
    const ema12 = this.calculateEMA({ prices }, 12);
    const ema26 = this.calculateEMA({ prices }, 26);

    // Align to longer series (ema26 is shorter)
    const offset = ema12.length - ema26.length;
    const macdLine: number[] = [];

    for (let i = 0; i < ema26.length; i++) {
      macdLine.push(ema12[i + offset] - ema26[i]);
    }

    const signalLine = this.calculateEMA(
      { prices: macdLine },
      9,
    );
    const histogram: number[] = [];

    const signalOffset = macdLine.length - signalLine.length;
    for (let i = 0; i < signalLine.length; i++) {
      histogram.push(macdLine[i + signalOffset] - signalLine[i]);
    }

    // macdLine is shortened to match signalLine length
    const alignedMacd = macdLine.slice(-signalLine.length);

    return {
      type: IndicatorTypeEnum.MACD,
      values: alignedMacd,
      signal: signalLine,
      histogram,
    };
  }

  /**
   * Calculate any indicator by type
   */
  calculateIndicator(
    type: IndicatorTypeEnum,
    priceData: PriceData,
    parameters: Record<string, number> = {},
  ): CalculatedIndicator | number[] {
    switch (type) {
      case IndicatorTypeEnum.RSI:
        return {
          type,
          values: this.calculateRSI(priceData, parameters.period ?? 14),
        };
      case IndicatorTypeEnum.MACD:
        return this.calculateMACD(priceData);
      case IndicatorTypeEnum.SMA:
        return {
          type,
          values: this.calculateSMA(priceData, parameters.period ?? 14),
        };
      case IndicatorTypeEnum.EMA:
        return {
          type,
          values: this.calculateEMA(priceData, parameters.period ?? 14),
        };
      default:
        return [];
    }
  }
}
