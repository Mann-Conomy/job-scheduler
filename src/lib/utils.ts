import { validateCronExpression } from "cron";
import type { JobExpression, JobOptions } from "../types/job";

/**
 * Validates a job expression to ensure it is a valid cron expression.
 * @param expression The job expression to validate. Can be a cron string, Date, or Luxon DateTime.
 * @returns The original expression if valid.
 * @throws A TypeError If the cron expression is invalid, with an optional cause.
 */
export function validateCronTime(expression: JobExpression): JobExpression {
    const result = validateCronExpression(expression.toString());
    if (!result.valid && result.error) {
        throw new TypeError(result.error.message, {
            cause: result.error.cause
        });
    }

    return expression;
}

/**
 * Validates a time zone to ensure it is a valid.
 * @param timeZone The time zone to validate.
 * @returns The validation result object.
 */
export function validateTimeZone(timeZone: string) {
    try {
        Intl.DateTimeFormat(undefined, { timeZone });
        return {
            valid: true,
            error: null,
        };
    } catch (error) {
        return {
            error,
            valid: false,
        };
    }
}

/**
 * Merges the default time zone with user-supplied job options.
 * @param timeZone The default time zone to use for the job.
 * @param options Partial job options that may include an overriding time zone or other scheduling options.
 * @returns A new object combining the default time zone with the provided options.
 */
export function validateCronOptions(timeZone: string, options: Partial<JobOptions>) {
    if (options.timeZone) {
        const result = validateTimeZone(options.timeZone);
        if (!result.valid && result.error) {
            throw new TypeError("Invalid format or value for the specified time zone.");
        }
    }

    return { timeZone, ...options };
}
