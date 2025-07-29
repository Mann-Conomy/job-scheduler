# job-scheduler

A simple background job scheduler for the Mann-Conomy project.

[![npm version](https://img.shields.io/npm/v/@mann-conomy/job-scheduler?style=flat-square&logo=npm)](https://npmjs.com/package/@mann-conomy/job-scheduler)
[![npm downloads](https://img.shields.io/npm/d18m/@mann-conomy/job-scheduler?style=flat-square&logo=npm)](https://npmjs.com/package/@mann-conomy/job-scheduler)
[![Node.js version](https://img.shields.io/node/v/@mann-conomy/job-scheduler?style=flat-square&logo=nodedotjs)](https://nodejs.org/en/about/releases/)
[![GitHub actions](https://img.shields.io/github/actions/workflow/status/Mann-Conomy/job-scheduler/test.yml?branch=main&style=flat-square&logo=github&label=test)](https://github.com/Mann-Conomy/job-scheduler/blob/main/.github/workflows/test.yml)
[![GitHub license](https://img.shields.io/github/license/Mann-Conomy/job-scheduler?style=flat-square&logo=github)](https://github.com/Mann-Conomy/job-scheduler/blob/main/LICENSE)

## Installation

Using [npm](https://www.npmjs.com/package/@mann-conomy/job-scheduler):

```bash
$ npm install @mann-conomy/job-scheduler
```

Using [yarn](https://yarnpkg.com/package/@mann-conomy/job-scheduler):

```bash
$ yarn add @mann-conomy/job-scheduler
```

## Testing

Using [npm](https://docs.npmjs.com/cli/v8/commands/npm-run-script):
```bash
$ npm test
```

Using [yarn](https://classic.yarnpkg.com/lang/en/docs/cli/run/):
```bash
$ yarn test
```

## Examples

Fetching the full Team Fortress 2 item schema from the Steam Web API every day at 04:05.

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

Some more examples are available in the [examples](https://github.com/Mann-Conomy/job-scheduler/tree/main/examples) and [test](https://github.com/Mann-Conomy/job-scheduler/tree/main/test) directories.

## Documentation

See the [Wiki pages](https://github.com/Mann-Conomy/job-scheduler/wiki) for further documentation.

## License

[MIT](LICENSE)

Copyright 2025, The Mann-Conomy Project
