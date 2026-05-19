#!/usr/bin/env node

import net from "node:net"
import { spawn } from "node:child_process"
import path from "node:path"
import process from "node:process"

const mode = process.argv[2] === "start" ? "start" : "dev"
const basePort = Number(process.env.PORT || 5000)
const maxPortAttempts = 30

const isPortFree = (port) =>
  new Promise((resolve) => {
    const server = net.createServer()

    server.once("error", () => resolve(false))
    server.once("listening", () => server.close(() => resolve(true)))
    server.listen(port, "0.0.0.0")
  })

const findFreePort = async (startPort) => {
  for (let offset = 0; offset < maxPortAttempts; offset += 1) {
    const port = startPort + offset
    if (await isPortFree(port)) {
      return port
    }
  }

  throw new Error(`No free port found near ${startPort}`)
}

const nextBin = process.platform === "win32"
  ? path.resolve("node_modules/.bin/next.cmd")
  : path.resolve("node_modules/.bin/next")

const port = await findFreePort(basePort)

console.log(`Starting Next.js ${mode} on port ${port}`)

const child = spawn(nextBin, [mode, "-p", String(port), "-H", "0.0.0.0"], {
  stdio: "inherit",
  env: {
    ...process.env,
    PORT: String(port),
  },
})

child.on("exit", (code) => {
  process.exit(code ?? 0)
})