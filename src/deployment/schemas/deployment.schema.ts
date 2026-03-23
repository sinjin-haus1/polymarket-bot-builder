import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeploymentDocument = Deployment & Document;

export enum DeploymentStatus {
  PENDING = 'pending',
  DEPLOYING = 'deploying',
  RUNNING = 'running',
  STOPPED = 'stopped',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Deployment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Strategy' })
  strategyId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: DeploymentStatus, default: DeploymentStatus.PENDING })
  status: DeploymentStatus;

  @Prop()
  containerId: string;

  @Prop()
  endpoint: string;

  @Prop({ type: Date, default: Date.now })
  startedAt: Date;

  @Prop({ type: Date })
  stoppedAt: Date;

  @Prop({ type: Number, default: 0 })
  uptime: number;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);
