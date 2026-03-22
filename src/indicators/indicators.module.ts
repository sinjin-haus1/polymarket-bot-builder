import { Module } from '@nestjs/common';
import { IndicatorsService } from './indicators.service';
import { IndicatorsResolver } from './indicators.resolver';
import { Indicator, IndicatorSchema } from './schemas/indicator.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Indicator.name, schema: IndicatorSchema }]),
  ],
  providers: [IndicatorsService, IndicatorsResolver],
  exports: [IndicatorsService],
})
export class IndicatorsModule {}
