import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeploymentService } from './deployment.service';
import { DeploymentResolver } from './deployment.resolver';
import { Deployment, DeploymentSchema } from './schemas/deployment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deployment.name, schema: DeploymentSchema },
    ]),
  ],
  providers: [DeploymentService, DeploymentResolver],
  exports: [DeploymentService],
})
export class DeploymentModule {}
