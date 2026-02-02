
import 'dotenv/config';
import { db } from '../lib/db';
import { plans } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
  console.log("🔍 STARTING DATABASE DEBUG CHECKS...");
  
  try {
      // 1. Check Connection
      console.log("1️⃣ Testing connection...");
      const result = await db.select().from(plans);
      console.log(`✅ Connection success. Found ${result.length} existing plans.`);
      console.log("Current rows:", result);

      // 2. Attempt Insert
      console.log("\n2️⃣ Attempting DIRECT INSERT via script...");
      const testName = `Debug Plan ${Date.now()}`;
      const inserted = await db.insert(plans).values({
          name: testName,
          price: 9999,
          features: ['Debug Feature'],
          isActive: true
      }).returning();
      
      console.log("✅ Insert returned:", inserted);

      // 3. Verify Persistence immediately
      console.log("\n3️⃣ Verifying persistence (Fetching again)...");
      const resultAfter = await db.select().from(plans);
      const found = resultAfter.find(p => p.name === testName);
      
      if (found) {
          console.log("🎉 SUCCESS: Plan persisted and retrieved!");
      } else {
          console.error("❌ FAILURE: Inserted plan NOT found in subsequent select!");
      }

  } catch (error) {
      console.error("❌ CRITICAL ERROR:", error);
  } finally {
      process.exit(0);
  }
}

run();
