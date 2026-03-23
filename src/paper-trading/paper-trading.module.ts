import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaperTradingService } from './paper-trading.service';
import { PaperTradingResolver } from './paper-trading.resolver';
import { PaperTrade, PaperTradeSchema } from './schemas/paper-trade.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaperTrade.name, schema: PaperTradeSchema },
    ]),
  ],
  providers: [PaperTradingService, PaperTradingResolver],
  exports: [PaperTradingService],
})
export class PaperTradingModule {}
