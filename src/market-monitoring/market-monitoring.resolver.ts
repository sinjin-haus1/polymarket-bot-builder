import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MarketMonitoringService } from './market-monitoring.service';
import { Market } from './entities/market.entity';

@Resolver(() => Market)
export class MarketMonitoringResolver {
  constructor(private readonly marketMonitoringService: MarketMonitoringService) {}

  @Query(() => [Market])
  async markets(): Promise<Market[]> {
    return this.marketMonitoringService.findAll();
  }

  @Query(() => [Market])
  async openMarkets(): Promise<Market[]> {
    return this.marketMonitoringService.findOpen();
  }

  @Query(() => Market, { nullable: true })
  async market(@Args('id', { type: () => ID }) id: string): Promise<Market | null> {
    return this.marketMonitoringService.findOne(id);
  }

  @Query(() => [Market])
  async watchedMarkets(): Promise<Market[]> {
    return this.marketMonitoringService.getWatchedMarkets();
  }

  @Mutation(() => Market)
  async watchMarket(
    @Args('marketId') marketId: string,
    @Args('question') question: string,
  ): Promise<Market> {
    return this.marketMonitoringService.watchMarket(marketId, { marketId, question });
  }

  @Mutation(() => Boolean)
  async unwatchMarket(@Args('marketId') marketId: string): Promise<boolean> {
    return this.marketMonitoringService.unwatchMarket(marketId);
  }

  @Mutation(() => Market, { nullable: true })
  async resolveMarket(
    @Args('marketId') marketId: string,
    @Args('outcome') outcome: string,
  ): Promise<Market | null> {
    return this.marketMonitoringService.resolveMarket(marketId, outcome);
  }
}
