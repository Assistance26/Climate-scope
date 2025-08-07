// src/utils/colorLogic.ts

export interface Rule {
  operator: '=' | '<' | '>' | '<=' | '>=';
  value: number;
  color: string;
}

/**
 * Returns the color for a given numeric value based on provided rules.
 * Rules are evaluated in order; the first matching rule's color is returned.
 * Returns 'gray' if no rules match.
 *
 * @param value - The numeric value to evaluate.
 * @param rules - Array of Rule objects to match against.
 * @returns The color string from the matching rule or 'gray' as default.
 */
export function getColorForValue(value: number, rules: Rule[]): string {
  for (const rule of rules) {
    switch (rule.operator) {
      case '=':
        if (value === rule.value) return rule.color;
        break;
      case '<':
        if (value < rule.value) return rule.color;
        break;
      case '>':
        if (value > rule.value) return rule.color;
        break;
      case '<=':
        if (value <= rule.value) return rule.color;
        break;
      case '>=':
        if (value >= rule.value) return rule.color;
        break;
    }
  }
  return 'gray'; // fallback color if no rule matches
}
