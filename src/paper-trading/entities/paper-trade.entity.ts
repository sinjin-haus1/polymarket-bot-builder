import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLISODateTime } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type PaperTradeDocument = PaperTrade & Document;

export enum TradeSide {
  YES = 'YES',
  NO = 'NO',
}

registerEnumType(TradeSide, { name: 'TradeSide' });

@ObjectType()
@Schema({ timestamps: true, collection: 'paper_trades' })
export class PaperTrade {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Strategy' })
  strategyId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  marketId: string;

  @Field(() => TradeSide)
  @Prop({ required: true, enum: TradeSide })
  side: TradeSide;

  @Field()
  @Prop({ required: true })
  amount: number;

  @Field()
  @Prop({ required: true })
  price: number;

  @Field({ nullable: true })
  @Prop()
  outcome?: string;

  @Field()
  @Prop({ type: Number, default: 0 })
  profit: number;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const PaperTradeSchema = SchemaFactory.createForClass(PaperTrade);
