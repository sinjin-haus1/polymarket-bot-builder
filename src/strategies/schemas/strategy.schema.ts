import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StrategyDocument = Strategy & Document;

@Schema({ timestamps: true })
export class Strategy {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Indicator' }] })
  indicators: Types.ObjectId[];

  @Prop({ type: Object, default: {} })
  conditions: Record<string, any>;

  @Prop({ type: String, enum: ['draft', 'paper_trading', 'live'], default: 'draft' })
  status: string;

  @Prop({ type: Number, default: 0 })
  paperTrades: number;

  @Prop({ type: Number, default: 0 })
  paperProfit: number;
}

export const StrategySchema = SchemaFactory.createForClass(Strategy);
