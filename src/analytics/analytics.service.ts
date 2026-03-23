import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics, AnalyticsDocument } from './schemas/analytics.schema';
import { PaperTradingService } from '../paper-trading/paper-trading.service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name)
    private analyticsModel: Model<AnalyticsDocument>,
    private paperTradingService: PaperTradingService,
  ) {}

  async getAnalytics(strategyId: string, days: number = 30): Promise<Analytics[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.analyticsModel.find({
      strategyId,
      date: { $gte: startDate },
    }).sort({ date: -1 }).exec();
  }

  async calculateAndSaveAnalytics(strategyId: string): Promise<Analytics> {
    const stats = await this.paperTradingService.calculateStats(strategyId);
    const trades = await this.paperTradingService.findByStrategy(strategyId);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const analytics = await this.analyticsModel.findOneAndUpdate(
      { strategyId, date: today },
      {
        strategyId: strategyId as any,
        date: today,
        totalTrades: stats.totalTrades,
        winningTrades: stats.winningTrades,
        losingTrades: stats.losingTrades,
        profit: stats.totalProfit,
        volume: trades.reduce((sum, t) => sum + t.amount, 0),
        avgTradeSize: stats.totalTrades > 0 
          ? trades.reduce((sum, t) => sum + t.amount, 0) / stats.totalTrades 
          : 0,
      },
      { upsert: true, new: true },
    );

    return analytics;
  }

  async getPerformanceSummary(strategyId: string): Promise<{
    totalProfit: number;
    winRate: number;
    totalTrades: number;
    avgProfit: number;
    bestDay: number;
    worstDay: number;
  }> {
    const analytics = await this.getAnalytics(strategyId, 365);
    
    if (analytics.length === 0) {
      return {
        totalProfit: 0,
        winRate: 0,
        totalTrades: 0,
        avgProfit: 0,
        bestDay: 0,
        worstDay: 0,
      };
    }

    const totalProfit = analytics.reduce((sum, a) => sum + a.profit, 0);
    const totalTrades = analytics.reduce((sum, a) => sum + a.totalTrades, 0);
    const winningTrades = analytics.reduce((sum, a) => sum + a.winningTrades, 0);
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const avgProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;
    const profits = analytics.map(a => a.profit);
    const bestDay = Math.max(...profits, 0);
    const worstDay = Math.min(...profits, 0);

    return { totalProfit, winRate, totalTrades, avgProfit, bestDay, worstDay };
  }
}
