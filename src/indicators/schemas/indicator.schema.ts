import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IndicatorDocument = Indicator & Document;

export enum IndicatorType {
  RSI = 'RSI',
  MACD = 'MACD',
  SMA = 'SMA',
  EMA = 'EMA',
}

@Schema({ timestamps: true, collection: 'indicators' })
export class Indicator {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: IndicatorType })
  type: IndicatorType;

  @Prop({ type: Object, default: {} })
  parameters: Record<string, number>;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const IndicatorSchema = SchemaFactory.createForClass(Indicator);
