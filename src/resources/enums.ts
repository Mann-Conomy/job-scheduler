/**
 * Enumeration of job lifecycle events emitted by the JobScheduler.
 */
export enum JobEvent {
    /**
     * Emitted when a job throws an error during execution.
     * Listener arguments: (id: string, error: Error)
     */
    Error = "scheduledJobError",
    /**
     * Emitted when a job starts executing.
     * Listener arguments: (id: string)
     */
    Started = "scheduledJobStarted",
    /**
     * Emitted when a job stops (manually or on complete).
     * Listener arguments: (id: string)
     */
    Stopped = "scheduledJobStpped",
    /**
     * Emitted when a job has been scheduled/created.
     * Listener arguments: (id: string)
     */
    Created = "scheduledJobCreated",
    /**
     * Emitted when a job completes execution successfully.
     * Listener arguments: (id: string, result: T)
     */
    Completed = "jobCompleted",
}
