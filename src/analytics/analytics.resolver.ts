import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import { Analytics } from './entities/analytics.entity';

@Resolver(() => Analytics)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => [Analytics])
  async analytics(
    @Args('strategyId', { type: () => ID }) strategyId: string,
    @Args('days', { nullable: true }) days?: number,
  ): Promise<Analytics[]> {
    return this.analyticsService.getAnalytics(strategyId, days || 30);
  }

  @Query(() => String)
  async performanceSummary(
    @Args('strategyId', { type: () => ID }) strategyId: string,
  ): Promise<string> {
    const summary = await this.analyticsService.getPerformanceSummary(strategyId);
    return JSON.stringify(summary);
  }
}
