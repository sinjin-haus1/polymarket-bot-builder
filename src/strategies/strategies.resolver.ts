import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StrategiesService } from './strategies.service';
import { Strategy } from './entities/strategy.entity';
import { CreateStrategyInput } from './dto/create-strategy.input';

@Resolver(() => Strategy)
export class StrategiesResolver {
  constructor(private readonly strategiesService: StrategiesService) {}

  @Query(() => [Strategy])
  async strategies(): Promise<Strategy[]> {
    return this.strategiesService.findAll();
  }

  @Query(() => Strategy, { nullable: true })
  async strategy(@Args('id', { type: () => ID }) id: string): Promise<Strategy | null> {
    return this.strategiesService.findOne(id);
  }

  @Mutation(() => Strategy)
  async createStrategy(
    @Args('createStrategyInput') createStrategyInput: CreateStrategyInput,
  ): Promise<Strategy> {
    return this.strategiesService.create(createStrategyInput);
  }

  @Mutation(() => Strategy, { nullable: true })
  async updateStrategy(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateStrategyInput') updateStrategyInput: Partial<Strategy>,
  ): Promise<Strategy | null> {
    return this.strategiesService.update(id, updateStrategyInput);
  }

  @Mutation(() => Boolean)
  async deleteStrategy(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.strategiesService.remove(id);
  }
}
