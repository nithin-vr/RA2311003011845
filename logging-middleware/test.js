import { Log } from "./logger.js";

async function test() {
  await Log("backend", "info", "handler", "Logger working successfully");
}

test();
