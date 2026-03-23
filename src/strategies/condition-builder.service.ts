import { Injectable } from '@nestjs/common';
import { IndicatorsService } from '../indicators/indicators.service';

export interface Condition {
  indicatorId: string;
  indicatorType: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'crosses_above' | 'crosses_below';
  threshold: number;
  secondaryIndicatorId?: string;
}

export interface StrategyCondition {
  logicalOperator?: 'AND' | 'OR';
  conditions: (Condition | StrategyCondition)[];
}

@Injectable()
export class ConditionBuilderService {
  constructor(private readonly indicatorsService: IndicatorsService) {}

  /**
   * Evaluate a single condition against indicator values
   */
  evaluateCondition(
    condition: Condition,
    indicatorValues: Record<string, number[]>,
    currentIndex: number = -1,
  ): boolean {
    const values = indicatorValues[condition.indicatorId];
    if (!values || values.length === 0) return false;

    const currentValue = values[currentIndex] ?? values[values.length - 1];

    switch (condition.operator) {
      case 'gt':
        return currentValue > condition.threshold;
      case 'lt':
        return currentValue < condition.threshold;
      case 'eq':
        return currentValue === condition.threshold;
      case 'gte':
        return currentValue >= condition.threshold;
      case 'lte':
        return currentValue <= condition.threshold;
      case 'crosses_above':
        if (currentIndex < 1) return false;
        const prevAbove = values[currentIndex - 1];
        return prevAbove <= condition.threshold && currentValue > condition.threshold;
      case 'crosses_below':
        if (currentIndex < 1) return false;
        const prevBelow = values[currentIndex - 1];
        return prevBelow >= condition.threshold && currentValue < condition.threshold;
      default:
        return false;
    }
  }

  /**
   * Evaluate a strategy condition (with logical operators)
   */
  evaluateStrategyCondition(
    strategyCondition: StrategyCondition,
    indicatorValues: Record<string, number[]>,
    currentIndex: number = -1,
  ): boolean {
    if (strategyCondition.conditions.length === 0) return true;

    let results: boolean[] = strategyCondition.conditions.map((cond) => {
      if ('indicatorId' in cond) {
        return this.evaluateCondition(cond as Condition, indicatorValues, currentIndex);
      } else {
        return this.evaluateStrategyCondition(cond as StrategyCondition, indicatorValues, currentIndex);
    });

    const logicalOperator = strategyCondition.logicalOperator || 'AND';

    if (logicalOperator === 'AND') {
      return results.every((r) => r);
    } else {
      return results.some((r) => r);
    }
  }

  /**
   * Build a condition from UI inputs
   */
  buildCondition(input: {
    indicatorType: string;
    operator: string;
    threshold: number;
    secondaryIndicatorType?: string;
  }): Condition {
    return {
      indicatorId: input.indicatorType.toLowerCase(),
      indicatorType: input.indicatorType,
      operator: input.operator as Condition['operator'],
      threshold: input.threshold,
      secondaryIndicatorId: input.secondaryIndicatorType?.toLowerCase(),
    };
  }

  /**
   * Build a strategy condition group
   */
  buildStrategyCondition(
    conditions: (Condition | StrategyCondition)[],
    logicalOperator: 'AND' | 'OR' = 'AND',
  ): StrategyCondition {
    return {
      logicalOperator,
      conditions,
    };
  }
}
