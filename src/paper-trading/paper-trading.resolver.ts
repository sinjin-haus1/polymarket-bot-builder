import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PaperTradingService } from './paper-trading.service';
import { PaperTrade } from './entities/paper-trade.entity';

@Resolver(() => PaperTrade)
export class PaperTradingResolver {
  constructor(private readonly paperTradingService: PaperTradingService) {}

  @Query(() => [PaperTrade])
  async paperTrades(): Promise<PaperTrade[]> {
    return this.paperTradingService.findAll();
  }

  @Query(() => [PaperTrade])
  async paperTradesByStrategy(
    @Args('strategyId', { type: () => ID }) strategyId: string,
  ): Promise<PaperTrade[]> {
    return this.paperTradingService.findByStrategy(strategyId);
  }

  @Query(() => String)
  async paperTradingStats(
    @Args('strategyId', { type: () => ID }) strategyId: string,
  ): Promise<string> {
    const stats = await this.paperTradingService.calculateStats(strategyId);
    return JSON.stringify(stats);
  }

  @Mutation(() => PaperTrade)
  async executePaperTrade(
    @Args('strategyId', { type: () => ID }) strategyId: string,
    @Args('marketId') marketId: string,
    @Args('side') side: 'YES' | 'NO',
    @Args('amount') amount: number,
    @Args('price') price: number,
  ): Promise<PaperTrade> {
    return this.paperTradingService.executePaperTrade({
      strategyId,
      marketId,
      side,
      amount,
      price,
    });
  }
}
