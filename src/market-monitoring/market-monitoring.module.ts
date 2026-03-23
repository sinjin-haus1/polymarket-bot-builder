import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketMonitoringService } from './market-monitoring.service';
import { MarketMonitoringResolver } from './market-monitoring.resolver';
import { Market, MarketSchema } from './schemas/market.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Market.name, schema: MarketSchema },
    ]),
  ],
  providers: [MarketMonitoringService, MarketMonitoringResolver],
  exports: [MarketMonitoringService],
})
export class MarketMonitoringModule {}
