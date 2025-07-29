---
name: "Bug report"
about: "Report a bug with the job-scheduler library"
title: "[BUG] - "
labels: ["bug"]
---

## Describe the bug

Please provide a clear and concise description of the bug. Include any relevant information that might help us understand the issue.

## Steps to reproduce the behaviour

Please provide detailed steps for reproducing the issue.
1. Import class '...'
2. Call toKeys '....'
3. Run '....'
4. Throws error

## Expected behaviour

A clear and concise description of what you expected to happen.

## Actual behaviour

A clear and concise description of what happens.

## Minimal reproducible example
Calling `schedule()` on a new `JobScheduler` instance returns "Error scheduling job...".

```js
import { randomUUID } from "crypto";
import { SchemaClient } from "@mann-conomy/tf-schema";
import { JobScheduler, JobEvent } from "@mann-conomy/job-scheduler";

const client = new SchemaClient(process.env.STEAM_WEB_API_KEY!);

const scheduler = new JobScheduler("Europe/Copenhagen");
scheduler.on(JobEvent.Created, (id: string) => {
    scheduler.start(id);
});

const uuid = randomUUID();

try {
    scheduler.schedule(uuid, "5 4 * * *", async () => await client.getItemSchema());
} catch(error) {
    if (error instanceof Error) {
        console.error("Error scheduling job", error.message);
    }
}
```

## Environment

- OS: [e.g. Windows 11, macOS 14 Sonoma, Ubuntu 24.04]
- IDE: [e.g. Visual Studio Code, WebStorm]

## Stacktrace

If applicable, add any error messages you are receiving. Please include the full stacktrace or add a screenshot.

## Additional Context

Add any other context about the problem here, such as specific files or configurations that might be causing the issue. If the problem is specific to a particular setup, please provide details.

## Screenshots

If applicable, add screenshots to help explain your problem.

## Potential Solutions

If you have an idea of what might be causing the problem or how to fix it, please share it here.

## Related Issues

If there are any related issues, please link them here.

---

**Please note that if the issue is not reproducible, it may not be addressed. Make sure to provide as much information as possible.**

Your feedback is invaluable. Thank you for helping improve the Mann-Conomy Project!
