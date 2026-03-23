import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndicatorsModule } from './indicators/indicators.module';
import { StrategiesModule } from './strategies/strategies.module';
import { PaperTradingModule } from './paper-trading/paper-trading.module';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/polymarket-bot-builder'),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    IndicatorsModule,
    StrategiesModule,
    PaperTradingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
