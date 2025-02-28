/*
<ai_context>
Initializes the database connection and schema for the app.
This file should only be imported from server components or server actions.
</ai_context>
*/

// This ensures this file is only used on the server
// https://nextjs.org/docs/app/building-your-application/rendering/server-components#server-only
import 'server-only';

import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// This ensures this module only runs on the server
if (typeof window !== 'undefined') {
  throw new Error('This module should only be imported on the server')
}

config({ path: ".env.local" })

// Use connection pooling in production, and a simpler connection in development
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  // Disable notice and debug logs
  onnotice: () => {},
  debug: false,
})

export const db = drizzle(client, { schema })