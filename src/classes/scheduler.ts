import { CronJob } from "cron";
import EventEmitter from "events";
import { JobEvent } from "../resources/enums";
import { validateCronOptions, validateCronTime, validateTimeZone } from "../lib/utils";
import type { JobExpression, JobOptions, JobResolver, ScheduledJob } from "../types/job";

/**
 * A simple scheduler class that manages cron-based background jobs.
 */
export default class JobScheduler extends EventEmitter {
    private readonly timeZone: string;
    private readonly jobs = new Map<string, ScheduledJob>();

    /**
     * Creates a new JobScheduler.
     * @param timeZone The time zone used for scheduling jobs.
     */
    public constructor(timeZone: string) {
        super();

        const result = validateTimeZone(timeZone);
        if (!result.valid && result.error) {
            throw new TypeError("Invalid format or value for the specified time zone.");
        }
        
        this.timeZone = timeZone;
    }

    /**
     * Schedules a new job.
     * @param id A unique identifier for the job.
     * @param expression A cron expression or Date representing when the job should run.
     * @param resolver A function to execute when the job is triggered.
     * @param options Optional settings for the job such as `start`, `runOnInit`, etc.
     */
    public schedule<T>(id: string, expression: JobExpression, resolver: JobResolver<T>, options: Partial<JobOptions> = {}): void {
        const cronTime = validateCronTime(expression);
        const cronOptions = validateCronOptions(this.timeZone, options);

        const job = CronJob.from({
            cronTime,
            onTick: async () => {
                this.emit(JobEvent.Started, id);

                try {
                    const result = await resolver();
                    this.emit(JobEvent.Completed, id, result);
                } catch (error) {
                    this.emit(JobEvent.Error, id, error);
                }
            },
            onComplete: () => {
                this.emit(JobEvent.Stopped, id);
            },
            ...cronOptions,
        });

        this.jobs.set(id, job);
        this.emit(JobEvent.Created, id);

        if (cronOptions.start) {
            job.start();
        }
    }

    /**
     * Returns all currently scheduled jobs.
     * @returns An array of ScheduledJob instances.
     */
    public getJobs(): ScheduledJob[] {
        return Array.from(this.jobs.values());
    }

    /**
     * Returns the unique identifiers of all scheduled jobs.
     * @returns An array of job IDs.
     */
    public getJobIds(): string[] {
        return Array.from(this.jobs.keys());
    }

    /**
     * Returns a map of the scheduled jobs.
     * @returns A Map of job IDs to ScheduledJob instances.
     */
    public getScheduledJobs(): Map<string, ScheduledJob> {
        return this.jobs;
    }

    /**
     * Retrieves a specific job by its ID.
     * @param id The ID of the job.
     * @throws A RangeError if the job does not exist.
     * @returns The ScheduledJob instance.
     */
    public get(id: string): ScheduledJob {
        const job = this.jobs.get(id);
        if (job == null) {
            throw new RangeError();
        }

        return job;
    }

    /**
     * Starts a scheduled job by ID if it is not already running.
     * @param id The ID of the job to start.
     */
    public start(id: string): void {
        const job = this.get(id);
        if (!job.isActive && !job.isCallbackRunning) {
            job.start();
        }
    }

    /**
     * Stops a scheduled job by ID if it is running.
     * @param id The ID of the job to stop.
     * @returns A Promise that resolves once the job is stopped.
     */
    public async stop(id: string): Promise<void> {
        const job = this.get(id);
        if (job.isActive || job.isCallbackRunning) {
            await job.stop();
        }
    }

    /**
     * Deletes a scheduled job by ID after stopping it.
     * @param id The ID of the job to delete.
     * @returns A Promise that resolves to `true` if the job was deleted, or `false` if it did not exist.
     */
    public async delete(id: string): Promise<boolean> {
        await this.stop(id);
        return this.jobs.delete(id);
    }

    /**
     * Gets the time zone used by the scheduler.
     * @returns The configured time zone.
     */
    public getTimeZone(): string {
        return this.timeZone;
    }
}
