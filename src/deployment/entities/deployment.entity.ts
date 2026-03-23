import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLISODateTime } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export type DeploymentDocument = Deployment & Document;

export enum DeploymentStatus {
  PENDING = 'pending',
  DEPLOYING = 'deploying',
  RUNNING = 'running',
  STOPPED = 'stopped',
  FAILED = 'failed',
}

registerEnumType(DeploymentStatus, { name: 'DeploymentStatus' });

@ObjectType()
@Schema({ timestamps: true, collection: 'deployments' })
export class Deployment {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Strategy' })
  strategyId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => DeploymentStatus)
  @Prop({ type: String, enum: DeploymentStatus, default: DeploymentStatus.PENDING })
  status: DeploymentStatus;

  @Field({ nullable: true })
  @Prop()
  containerId?: string;

  @Field({ nullable: true })
  @Prop()
  endpoint?: string;

  @Field(() => GraphQLISODateTime)
  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Prop({ type: Date })
  stoppedAt?: Date;

  @Field()
  @Prop({ type: Number, default: 0 })
  uptime: number;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);
