import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaperTrade, PaperTradeDocument } from './schemas/paper-trade.schema';

@Injectable()
export class PaperTradingService {
  constructor(
    @InjectModel(PaperTrade.name)
    private paperTradeModel: Model<PaperTradeDocument>,
  ) {}

  async create(data: Partial<PaperTrade>): Promise<PaperTrade> {
    const created = new this.paperTradeModel(data);
    return created.save();
  }

  async findByStrategy(strategyId: string): Promise<PaperTrade[]> {
    return this.paperTradeModel.find({ strategyId }).sort({ timestamp: -1 }).exec();
  }

  async findAll(): Promise<PaperTrade[]> {
    return this.paperTradeModel.find().sort({ timestamp: -1 }).exec();
  }

  async calculateStats(strategyId: string): Promise<{
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    totalProfit: number;
    winRate: number;
  }> {
    const trades = await this.findByStrategy(strategyId);
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.profit > 0).length;
    const losingTrades = trades.filter(t => t.profit < 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    return { totalTrades, winningTrades, losingTrades, totalProfit, winRate };
  }

  async executePaperTrade(data: {
    strategyId: string;
    marketId: string;
    side: 'YES' | 'NO';
    amount: number;
    price: number;
  }): Promise<PaperTrade> {
    // For now, we don't know the outcome until the market resolves
    // Just record the trade
    return this.create({
      strategyId: data.strategyId as any,
      marketId: data.marketId,
      side: data.side,
      amount: data.amount,
      price: data.price,
      profit: 0,
    });
  }

  async settleTrade(tradeId: string, outcome: string, finalPrice: number): Promise<PaperTrade | null> {
    const trade = await this.paperTradeModel.findById(tradeId).exec();
    if (!trade) return null;

    // Calculate profit based on outcome
    const won = (trade.side === 'YES' && finalPrice > 0.5) || 
                (trade.side === 'NO' && finalPrice < 0.5);
    
    trade.outcome = outcome;
    trade.profit = won ? trade.amount * (1 - trade.price) : -trade.amount * trade.price;
    
    return trade.save();
  }
}
