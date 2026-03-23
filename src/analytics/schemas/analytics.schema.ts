import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Strategy' })
  strategyId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Number, default: 0 })
  totalTrades: number;

  @Prop({ type: Number, default: 0 })
  winningTrades: number;

  @Prop({ type: Number, default: 0 })
  losingTrades: number;

  @Prop({ type: Number, default: 0 })
  profit: number;

  @Prop({ type: Number, default: 0 })
  volume: number;

  @Prop({ type: Number, default: 0 })
  avgTradeSize: number;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
