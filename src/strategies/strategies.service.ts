import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Strategy, StrategyDocument } from './schemas/strategy.schema';

@Injectable()
export class StrategiesService {
  constructor(
    @InjectModel(Strategy.name)
    private strategyModel: Model<StrategyDocument>,
  ) {}

  async create(data: Partial<Strategy>): Promise<Strategy> {
    const created = new this.strategyModel(data);
    return created.save();
  }

  async findAll(): Promise<Strategy[]> {
    return this.strategyModel.find().exec();
  }

  async findByUser(userId: string): Promise<Strategy[]> {
    return this.strategyModel.find({ userId }).exec();
  }

  async findOne(id: string): Promise<Strategy | null> {
    return this.strategyModel.findById(id).exec();
  }

  async update(
    id: string,
    data: Partial<Strategy>,
  ): Promise<Strategy | null> {
    return this.strategyModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.strategyModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
