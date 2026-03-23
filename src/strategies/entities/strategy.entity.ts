import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLISODateTime } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type StrategyDocument = Strategy & Document;

export enum StrategyStatus {
  DRAFT = 'draft',
  PAPER_TRADING = 'paper_trading',
  LIVE = 'live',
}

registerEnumType(StrategyStatus, { name: 'StrategyStatus' });

@ObjectType()
@Schema({ timestamps: true, collection: 'strategies' })
export class Strategy {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  description: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Field(() => [String], { nullable: true })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Indicator' }] })
  indicators: Types.ObjectId[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop()
  updatedAt: Date;
}

export const StrategySchema = SchemaFactory.createForClass(Strategy);
