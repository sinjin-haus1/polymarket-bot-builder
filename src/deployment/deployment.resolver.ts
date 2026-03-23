import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DeploymentService } from './deployment.service';
import { Deployment } from './entities/deployment.entity';

@Resolver(() => Deployment)
export class DeploymentResolver {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Query(() => [Deployment])
  async deployments(): Promise<Deployment[]> {
    return this.deploymentService.findAll();
  }

  @Query(() => Deployment, { nullable: true })
  async deployment(@Args('id', { type: () => ID }) id: string): Promise<Deployment | null> {
    return this.deploymentService.findOne(id);
  }

  @Query(() => [Deployment])
  async deploymentsByStrategy(
    @Args('strategyId', { type: () => ID }) strategyId: string,
  ): Promise<Deployment[]> {
    return this.deploymentService.findByStrategy(strategyId);
  }

  @Mutation(() => Deployment)
  async deployStrategy(
    @Args('strategyId', { type: () => ID }) strategyId: string,
    @Args('name') name: string,
  ): Promise<Deployment> {
    return this.deploymentService.deploy(strategyId, name);
  }

  @Mutation(() => Deployment, { nullable: true })
  async stopDeployment(@Args('id', { type: () => ID }) id: string): Promise<Deployment | null> {
    return this.deploymentService.stop(id);
  }

  @Query(() => Number)
  async deploymentUptime(@Args('id', { type: () => ID }) id: string): Promise<number> {
    return this.deploymentService.getUptime(id);
  }
}
