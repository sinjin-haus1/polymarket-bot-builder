import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaperTradeDocument = PaperTrade & Document;

@Schema({ timestamps: true })
export class PaperTrade {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Strategy' })
  strategyId: Types.ObjectId;

  @Prop({ required: true })
  marketId: string;

  @Prop({ required: true, enum: ['YES', 'NO'] })
  side: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  outcome: string;

  @Prop({ type: Number, default: 0 })
  profit: number;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const PaperTradeSchema = SchemaFactory.createForClass(PaperTrade);
