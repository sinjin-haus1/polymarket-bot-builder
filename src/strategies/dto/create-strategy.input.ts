import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateStrategyInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => [ID], { nullable: true })
  indicators?: string[];
}

@InputType()
export class UpdateStrategyInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [ID], { nullable: true })
  indicators?: string[];
}
