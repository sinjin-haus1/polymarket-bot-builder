import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { GraphQLScalarType, Kind } from 'graphql';

export enum IndicatorTypeEnum {
  RSI = 'RSI',
  MACD = 'MACD',
  SMA = 'SMA',
  EMA = 'EMA',
}

registerEnumType(IndicatorTypeEnum, { name: 'IndicatorTypeEnum' });

@ObjectType()
export class Indicator {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => IndicatorTypeEnum)
  type: IndicatorTypeEnum;

  @Field(() => GraphQLJSON, { nullable: true })
  parameters: Record<string, number>;

  @Field({ nullable: true })
  description: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class CalculatedIndicator {
  @Field(() => IndicatorTypeEnum)
  type: IndicatorTypeEnum;

  @Field(() => [Number])
  values: number[];

  @Field(() => [Number], { nullable: true })
  signal?: number[];

  @Field(() => [Number], { nullable: true })
  histogram?: number[];
}

export const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value: unknown): Record<string, unknown> {
    return value as Record<string, unknown>;
  },
  parseValue(value: unknown): Record<string, unknown> {
    return value as Record<string, unknown>;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return ast.value;
    if (ast.kind === Kind.FLOAT) return parseFloat(ast.value);
    if (ast.kind === Kind.INT) return parseInt(ast.value, 10);
    if (ast.kind === Kind.OBJECT) {
      const obj: Record<string, unknown> = {};
      ast.fields.forEach((field) => {
        if (field.value.kind === Kind.STRING) {
          obj[field.name.value] = field.value.value;
        } else if (field.value.kind === Kind.FLOAT) {
          obj[field.name.value] = parseFloat(field.value.value);
        } else if (field.value.kind === Kind.INT) {
          obj[field.name.value] = parseInt(field.value.value, 10);
        }
      });
      return obj;
    }
    return null;
  },
});
