import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';

export type MarketDocument = Market & Document;

export enum MarketStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  RESOLVED = 'resolved',
}

registerEnumType(MarketStatus, { name: 'MarketStatus' });

@ObjectType()
@Schema({ timestamps: true, collection: 'markets' })
export class Market {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  @Prop({ required: true, unique: true })
  marketId: string;

  @Field()
  @Prop({ required: true })
  question: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field()
  @Prop({ type: Number, default: 0 })
  yesPrice: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  noPrice: number;

  @Field()
  @Prop({ type: Number, default: 0 })
  volume: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  endDate?: Date;

  @Field(() => MarketStatus)
  @Prop({ type: String, enum: MarketStatus, default: MarketStatus.OPEN })
  status: MarketStatus;

  @Field({ nullable: true })
  @Prop({ type: String })
  outcome?: string;
}

export const MarketSchema = SchemaFactory.createForClass(Market);
