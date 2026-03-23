import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLISODateTime } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@ObjectType()
@Schema({ timestamps: true, collection: 'analytics' })
export class Analytics {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Strategy' })
  strategyId: Types.ObjectId;

  @Field(() => GraphQLISODateTime)
  @Prop({ required: true })
  date: Date;

  @Field()
  @Prop({ type: Number, default: 0 })
  totalTrades: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  winningTrades: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  losingTrades: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  profit: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  volume: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  avgTradeSize: number;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
