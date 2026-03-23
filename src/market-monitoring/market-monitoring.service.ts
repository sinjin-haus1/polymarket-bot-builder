import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Market, MarketDocument, MarketStatus } from './schemas/market.schema';

@Injectable()
export class MarketMonitoringService {
  constructor(
    @InjectModel(Market.name)
    private marketModel: Model<MarketDocument>,
  ) {}

  async create(data: Partial<Market>): Promise<Market> {
    const created = new this.marketModel(data);
    return created.save();
  }

  async findAll(): Promise<Market[]> {
    return this.marketModel.find().sort({ volume: -1 }).exec();
  }

  async findOpen(): Promise<Market[]> {
    return this.marketModel.find({ status: MarketStatus.OPEN }).sort({ volume: -1 }).exec();
  }

  async findOne(id: string): Promise<Market | null> {
    return this.marketModel.findById(id).exec();
  }

  async findByMarketId(marketId: string): Promise<Market | null> {
    return this.marketModel.findOne({ marketId }).exec();
  }

  async updatePrices(
    marketId: string,
    yesPrice: number,
    noPrice: number,
    volume?: number,
  ): Promise<Market | null> {
    const update: any = { yesPrice, noPrice };
    if (volume !== undefined) {
      update.volume = volume;
    }
    return this.marketModel.findOneAndUpdate({ marketId }, update, { new: true }).exec();
  }

  async watchMarket(marketId: string, data: Partial<Market>): Promise<Market> {
    const existing = await this.findByMarketId(marketId);
    if (existing) {
      return existing;
    }
    return this.create(data);
  }

  async unwatchMarket(marketId: string): Promise<boolean> {
    const result = await this.marketModel.findOneAndDelete({ marketId }).exec();
    return !!result;
  }

  async getWatchedMarkets(): Promise<Market[]> {
    return this.marketModel.find().sort({ updatedAt: -1 }).exec();
  }

  async resolveMarket(marketId: string, outcome: string): Promise<Market | null> {
    return this.marketModel.findOneAndUpdate(
      { marketId },
      { status: MarketStatus.RESOLVED, outcome },
      { new: true },
    ).exec();
  }
}
