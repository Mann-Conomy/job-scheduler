import type { CronJob } from "cron";
import type { DateTime } from "luxon";

/**
 * A scheduled job instance created from a cron expression.
 */
export type ScheduledJob = CronJob<() => void, () => void>;

/**
 * A function that will be executed when the scheduled job is triggered.
 */
export type JobResolver<T> = () => T | Promise<T>;

/**
 * A valid expression that defines when a job should run.
 */
export type JobExpression = string | Date | DateTime;

/**
 * Configuration options for a scheduled job.
 */
export interface JobOptions {
    /**
     * Execution context for the onTick method.
     */
    context: () => void;
    /**
     * An optional name for the job.
     */
    name: string | null;
    /**
     * Whether the job should start immediately after scheduling.
     */
    start: boolean | null;
    /**
     * Sets the execution time zone for the scheduled job. Default is local time. 
     */
    timeZone: string | null;
    /**
     * Threshold in ms to control whether to execute or skip missed execution deadlines caused by slow or busy hardware. Default is 250.
     */
    threshold: number | null;
    /**
     * Instantly triggers the onTick function post initialization. Default is false.
     */
    runOnInit: boolean | null;
    /**
     * Useful for controlling event loop behavior.
     */
    unrefTimeout: boolean | null;
    /**
     * If true, no additional instances of the onTick callback function will run until the current onTick callback has completed.
     */
    waitForCompletion: boolean | null;
}
