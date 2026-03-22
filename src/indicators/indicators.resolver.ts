import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
} from '@nestjs/graphql';
import { IndicatorsService } from './indicators.service';
import { Indicator, CalculatedIndicator, IndicatorTypeEnum } from './entities/indicator.entity';

@Resolver(() => Indicator)
export class IndicatorsResolver {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  @Query(() => [Indicator], { name: 'indicators' })
  async findAll() {
    return this.indicatorsService.findAll();
  }

  @Query(() => Indicator, { name: 'indicator', nullable: true })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return this.indicatorsService.findOne(id);
  }

  @Mutation(() => Indicator)
  async createIndicator(
    @Args('name') name: string,
    @Args('type', { type: () => IndicatorTypeEnum }) type: IndicatorTypeEnum,
    @Args('parameters', { nullable: true })
    parameters?: Record<string, number>,
    @Args('description', { nullable: true }) description?: string,
  ) {
    return this.indicatorsService.create({
      name,
      type: type as any,
      parameters: parameters ?? {},
      description: description ?? '',
      isActive: true,
    });
  }

  @Mutation(() => Indicator, { nullable: true })
  async updateIndicator(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('type', { type: () => IndicatorTypeEnum, nullable: true })
    type?: IndicatorTypeEnum,
    @Args('parameters', { nullable: true })
    parameters?: Record<string, number>,
    @Args('description', { nullable: true }) description?: string,
    @Args('isActive', { nullable: true }) isActive?: boolean,
  ) {
    return this.indicatorsService.update(id, {
      name,
      type: type as any,
      parameters,
      description,
      isActive,
    });
  }

  @Mutation(() => Boolean)
  async deleteIndicator(@Args('id', { type: () => ID }) id: string) {
    return this.indicatorsService.remove(id);
  }

  // ─── Calculation Endpoints ───────────────────────────────────────────────

  @Query(() => CalculatedIndicator, { name: 'calculateIndicator' })
  async calculateIndicator(
    @Args('type', { type: () => IndicatorTypeEnum }) type: IndicatorTypeEnum,
    @Args('prices', { type: () => [Number] }) prices: number[],
    @Args('period', { type: () => Int, nullable: true }) period?: number,
  ) {
    const result = this.indicatorsService.calculateIndicator(
      type,
      { prices },
      period ? { period } : {},
    );
    // Return first element if it's an array (SMA/EMA/RSI return number[])
    if (Array.isArray(result)) {
      return { type, values: result };
    }
    return result;
  }
}
