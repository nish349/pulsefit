
import 'dotenv/config';
import { db } from '../lib/db';
import { plans } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';

async function run() {
  const logs: string[] = [];
  const log = (...args: any[]) => {
      console.log(...args);
      logs.push(args.map(a => JSON.stringify(a, null, 2)).join(' '));
  };
  
  log("🔍 STARTING DATABASE DEBUG CHECKS...");
  
  try {
      // 1. Check Connection
      log("1️⃣ Testing connection...");
      const result = await db.select().from(plans);
      log(`✅ Connection success. Found ${result.length} existing plans.`);
      log("Current rows:", result);

      // 2. Attempt Insert
      log("\n2️⃣ Attempting DIRECT INSERT via script...");
      const testName = `Debug Plan ${Date.now()}`;
      const inserted = await db.insert(plans).values({
          name: testName,
          price: 9999,
          features: ['Debug Feature'],
          isActive: true
      }).returning();
      
      log("✅ Insert returned:", inserted);

      // 3. Verify Persistence immediately
      log("\n3️⃣ Verifying persistence (Fetching again)...");
      const resultAfter = await db.select().from(plans);
      const found = resultAfter.find(p => p.name === testName);
      
      if (found) {
          log("🎉 SUCCESS: Plan persisted and retrieved!");
      } else {
          log("❌ FAILURE: Inserted plan NOT found in subsequent select!");
      }

  } catch (error) {
      log("❌ CRITICAL ERROR:", error);
  } finally {
      fs.writeFileSync('debug_result.txt', logs.join('\n'));
      process.exit(0);
  }
}

run();
