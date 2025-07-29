import { randomUUID } from "crypto";
import { JobEvent, JobScheduler } from "../src";
import { describe, expect, test } from "@jest/globals";

jest.useFakeTimers();

describe("JobScheduler", () => {
    test("should throw if the time zone is invalid", () => {
        // Assert
        expect(() => new JobScheduler("Unknown/Atlantis")).toThrow(TypeError);
    });

    let events: string[];
    let scheduler: JobScheduler;

    beforeEach(() => {
        events = [];

        scheduler = new JobScheduler("Europe/Copenhagen");
        scheduler.on(JobEvent.Error, () => events.push("error"));
        scheduler.on(JobEvent.Created, () => events.push("created"));
        scheduler.on(JobEvent.Started, () => events.push("started"));
        scheduler.on(JobEvent.Stopped, () => events.push("stopped"));
        scheduler.on(JobEvent.Completed, () => events.push("completed"));
    });

    afterEach(async () => {
        const jobs = scheduler.getJobIds();
        for (const job of jobs) {
            await scheduler.delete(job);
        }

        scheduler.removeAllListeners();
    });

    describe("schedule", () => {
        test("should schedule a new job", async () => {
            // Arrange
            const uuid = randomUUID();

            // Act
            scheduler.schedule(uuid, "*/1 * * * *", getMockJob(), {
                timeZone: "America/Los_Angeles"
            });

            // Assert
            expect(events).toEqual(["created"]);
        });

        test("should start and complete a new job", async () => {
            // Arrange
            const uuid = randomUUID();

            // Act
            scheduler.schedule(uuid, "* * * * * *", getMockJob(), {
                start: true,
            });

            jest.advanceTimersByTime(1000);
            await Promise.resolve();

            // Assert
            expect(events).toEqual(["created", "started", "completed"]);
        });

        test("should throw if cron time is invalid", () => {
            // Arrange
            const uuid = randomUUID();

            // Assert
            expect(() => scheduler.schedule(uuid, "* /*/* *", getMockJob())).toThrow(TypeError);
        });

        test("should throw if time zone is invalid", () => {
            // Arrange
            const uuid = randomUUID();

            // Assert
            expect(() => scheduler.schedule(uuid, "* * * * * *", getMockJob(), { timeZone: "Unknown/Atlantis" })).toThrow(TypeError);
        });

        test("should catch error in job", async () => {
            // Arrange
            const uuid = randomUUID();

            // Act
            scheduler.schedule(uuid, "* * * * * *", getJobThatThrows(), {
                start: true,
            });

            jest.advanceTimersByTime(1000);
            await Promise.resolve();

            // Assert
            expect(events).toEqual(["created", "started", "error"]);
        });
    });

    describe("getJobs", () => {
        test("should return an array of cron job instances", () => {
            // Act
            const jobs = scheduler.getJobs();

            // Assert
            expect(jobs.length).toBe(0);
        });
    });

    describe("getJobIds", () => {
        test("should return an array of job ids", () => {
            // Act
            const ids = scheduler.getJobIds();

            // Assert
            expect(ids.length).toBe(0);
        });
    });

    describe("getScheduledJobs", () => {
        test("should return a map scheduled cron jobs", () => {
            // Act
            const jobs = scheduler.getScheduledJobs();

            // Assert
            expect(jobs.size).toBe(0);
        });
    });

    describe("getTimeZone", () => {
        test("should return the current time zone", () => {
            // Act
            const tz = scheduler.getTimeZone();

            // Assert
            expect(tz).toBe("Europe/Copenhagen");
        });
    });

    describe("get", () => {
        test("should throw if the job does not exist", async () => {
            // Arrange
            const uuid = randomUUID();

            // Assert
            expect(() => scheduler.get(uuid)).toThrow(RangeError);
        });
    });

    describe("start", () => {
        test("should start a new job", async () => {
            // Arrange
            const uuid = randomUUID();

            // Act
            scheduler.schedule(uuid, "* * * * * *", getMockJob());
            scheduler.start(uuid);

            jest.advanceTimersByTime(1000);
            await Promise.resolve();

            // Assert
            expect(events).toEqual(["created", "started", "completed"]);
        });

        test("should not restart an active job", async () => {
            // Arrange
            const uuid = randomUUID();

            // Act
            scheduler.schedule(uuid, "* * * * * *", getMockJob());
            scheduler.start(uuid);
            scheduler.start(uuid);

            jest.advanceTimersByTime(1000);
            await Promise.resolve();

            // Assert
            expect(events).toEqual(["created", "started", "completed"]);
        });        
    });

    describe("delete", () => {
        test("should stop and delete a new job", async () => {
            // Arrange
            const uuid = randomUUID();

            // Act
            scheduler.schedule(uuid, "* * * * * *", getMockJob(), {
                start: true,
            });

            jest.advanceTimersByTime(1000);
            await Promise.resolve();

            scheduler.delete(uuid);

            // Assert
            expect(events).toEqual(["created", "started", "completed", "stopped"]);
        });
    });
});

/**
 * Creates a Jest mock function with a resolved value from a Promise.
 * @returns A Jest mock async function.
 */
function getMockJob() {
    return jest.fn().mockResolvedValue("done");
}

/**
 * Creates a Jest mock function that throws an error.
 * @returns A Jest mock error function.
 */
function getJobThatThrows() {
    return jest.fn().mockImplementation(() => {
        throw new Error();
    });
}
