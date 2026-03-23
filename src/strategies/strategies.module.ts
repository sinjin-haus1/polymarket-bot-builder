import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StrategiesService } from './strategies.service';
import { StrategiesResolver } from './strategies.resolver';
import { Strategy, StrategySchema } from './schemas/strategy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Strategy.name, schema: StrategySchema },
    ]),
  ],
  providers: [StrategiesService, StrategiesResolver],
  exports: [StrategiesService],
})
export class StrategiesModule {}
