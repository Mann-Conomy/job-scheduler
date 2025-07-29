import { randomUUID } from "crypto";
import { JobScheduler, JobEvent } from "../src/index";

// Create a new scheduler with a set time zone
const scheduler = new JobScheduler("Europe/Copenhagen");

// Register the necessary event handlers for this example
scheduler.on(JobEvent.Created, handleJobCreated);
scheduler.on(JobEvent.Stopped, handleJobStopped);
scheduler.on(JobEvent.Completed, handleJobCompleted);

const uuid = randomUUID();

// Schedule a new "doWork" job every minute
scheduler.schedule(uuid, "*/1 * * * *", doWork, {
    start: true, // Start the job immediately after scheduling
    name: "doWork", // A name helps you find the job in your Node.js logs
});

// Handle the JobCreated event
function handleJobCreated(id: string) {
    console.log(`Scheduled a new job ${id}`);
}

// Handle the JobStopped event
function handleJobStopped(id: string) {
    console.log(`Stopped job ${id}`);
}

// Handle the JobCompleted event
async function handleJobCompleted(id: string, result: { id: number, userId: number }[]) {
    console.log(result);
    //>console.log(`Job ${id} completed with ${result.length} results`);

    // Stop the job the first time it completes
    await scheduler.stop(id);
}

// An example of a function that would do a job
async function doWork() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await response.json();
    return data as { id: number, userId: number }[];
}
