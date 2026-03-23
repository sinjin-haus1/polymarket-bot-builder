import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deployment, DeploymentDocument, DeploymentStatus } from './schemas/deployment.schema';

@Injectable()
export class DeploymentService {
  constructor(
    @InjectModel(Deployment.name)
    private deploymentModel: Model<DeploymentDocument>,
  ) {}

  async create(data: Partial<Deployment>): Promise<Deployment> {
    const created = new this.deploymentModel(data);
    return created.save();
  }

  async findAll(): Promise<Deployment[]> {
    return this.deploymentModel.find().exec();
  }

  async findByStrategy(strategyId: string): Promise<Deployment[]> {
    return this.deploymentModel.find({ strategyId }).sort({ startedAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Deployment | null> {
    return this.deploymentModel.findById(id).exec();
  }

  async updateStatus(
    id: string,
    status: DeploymentStatus,
    additionalData?: Partial<Deployment>,
  ): Promise<Deployment | null> {
    const update: any = { status };
    if (additionalData) {
      Object.assign(update, additionalData);
    }
    if (status === DeploymentStatus.STOPPED) {
      update.stoppedAt = new Date();
    }
    return this.deploymentModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deploy(strategyId: string, name: string): Promise<Deployment> {
    const deployment = await this.create({
      strategyId: strategyId as any,
      name,
      status: DeploymentStatus.PENDING,
    });

    // Simulate deployment process
    // In production, this would trigger Docker/K8s deployment
    await this.updateStatus(deployment._id.toString(), DeploymentStatus.DEPLOYING, {
      containerId: `container-${deployment._id.toString().slice(0, 8)}`,
    });

    // After "deployment", mark as running
    setTimeout(async () => {
      await this.updateStatus(deployment._id.toString(), DeploymentStatus.RUNNING, {
        endpoint: `https://bots.example.com/${deployment._id.toString()}`,
      });
    }, 3000);

    return deployment;
  }

  async stop(id: string): Promise<Deployment | null> {
    // In production, this would stop the container
    return this.updateStatus(id, DeploymentStatus.STOPPED);
  }

  async getUptime(id: string): Promise<number> {
    const deployment = await this.findOne(id);
    if (!deployment || !deployment.startedAt) return 0;
    
    const endTime = deployment.stoppedAt || new Date();
    return Math.floor((endTime.getTime() - deployment.startedAt.getTime()) / 1000);
  }
}
