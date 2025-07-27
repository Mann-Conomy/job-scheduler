import { CronJob } from "cron";
import EventEmitter from "events";

export interface JobSchedule {
    interval: string;
    timezone: string;
}

export enum JobEvent {
    Error = "a",
    Started = "3",
    Stopped = "4",
    Completed = "b"
}

export class JobEventT {
    public constructor() {

    }
}

export type ExecuteableJob = void | Promise<void>;

export default class JobScheduler extends EventEmitter {
    private readonly jobs: Map<string, CronJob>;
    private readonly schedules: Map<string, JobSchedule>;

    public constructor() {
        super();

        this.jobs = new Map();
        this.schedules = new Map();
    }

    public schedule<T>(source: string, interval: string, task: () => Promise<T> | T) {
        this.emit(JobEvent.Started, new JobEventT());
        
        this.jobs.set(source, new CronJob(interval, async() => {
            await task().then(schema => this.emit(JobEvent.Completed, {
                source,
                schema
            })).catch(error => this.emit(JobEvent.Error, error));
        }, null, true));
    }

    public getCronJobs() {
        return this.jobs;
    }

    public getJobSchedules() {
        return this.schedules;
    }
}
