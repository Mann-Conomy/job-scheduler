import { validateCronExpression } from "cron";
import type { JobExpression } from "../types/job";

/**
 * Validates a job expression to ensure it is a valid cron expression.
 * @param expression - The job expression to validate. Can be a cron string, Date, or Luxon DateTime.
 * @returns The original expression if valid.
 * @throws a TypeError If the cron expression is invalid, with an optional cause.
 */
export function validateCronTime(expression: JobExpression) {
    const result = validateCronExpression(expression.toString());
    if (!result.valid && result.error) {
        throw new TypeError(result.error.message, {
            cause: result.error.cause
        });
    }
    
    return expression;
}
