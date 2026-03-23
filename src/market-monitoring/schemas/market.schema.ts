import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MarketDocument = Market & Document;

@Schema({ timestamps: true })
export class Market {
  @Prop({ required: true, unique: true })
  marketId: string;

  @Prop({ required: true })
  question: string;

  @Prop()
  description: string;

  @Prop({ type: Number, default: 0 })
  yesPrice: number;

  @Prop({ type: Number, default: 0 })
  noPrice: number;

  @Prop({ type: Number, default: 0 })
  volume: number;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: String, enum: ['open', 'closed', 'resolved'], default: 'open' })
  status: string;

  @Prop({ type: String })
  outcome: string;
}

export const MarketSchema = SchemaFactory.createForClass(Market);
