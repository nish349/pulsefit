"use server";

import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { Plan, PlanFormValues, PlanWithDetails } from "@/types";

// 1. Get ALL plans (Admin)
export async function getAdminPlans(): Promise<PlanWithDetails[]> {
  noStore();
  try {
    const data = await db.select().from(plans).orderBy(plans.price);
    // In a real app, we would perform a JOIN or separate query to count real active members.
    // For now, defaulting to 0 as per original logic.
    return data.map((plan) => ({ ...plan, activeMemberCount: 0 }));
  } catch (error) {
    console.error("Failed to fetch admin plans:", error);
    return [];
  }
}

// 2. Get ONLY Active plans (Public)
export async function getPublicPlans(): Promise<Plan[]> {
  noStore();
  try {
    return await db.select().from(plans).where(eq(plans.isActive, true)).orderBy(plans.price);
  } catch (error) {
    console.error("Failed to fetch public plans:", error);
    return [];
  }
}

// 3. Create or Update Plan
export async function upsertPlan(data: PlanFormValues) {
  try {
    // Sanitize
    const formattedData = {
      name: data.name,
      price: typeof data.price === 'string' ? parseInt(data.price) : data.price,
      features: Array.isArray(data.features) ? data.features : [],
      isActive: data.isActive !== undefined ? data.isActive : true
    };

    let resultId: number | undefined;

    if (data.id) {
        const res = await db.update(plans).set(formattedData).where(eq(plans.id, data.id)).returning({ id: plans.id });
        resultId = res[0]?.id;
    } else {
        const res = await db.insert(plans).values(formattedData).returning({ id: plans.id });
        resultId = res[0]?.id;
    }
    
    if (!resultId) throw new Error("Database operation failed to return an ID");

    const savedPlan: Plan = {
        id: resultId,
        ...formattedData,
        // Ensure strictly typed matches Plan type. Drizzle may allow nulls in array if not strict, but sanitizer fixes it.
        features: formattedData.features
    };

    revalidatePath("/admin/plans");
    revalidatePath("/register");
    revalidatePath("/pricing");
    revalidatePath("/");
    
    return { success: true, plan: savedPlan };

  } catch (error) {
    console.error("Upsert Plan Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function togglePlanStatus(id: number) {
  try {
    const current = await db.select({ isActive: plans.isActive }).from(plans).where(eq(plans.id, id)).limit(1);
    if (!current.length) throw new Error("Plan not found");
    
    await db.update(plans).set({ isActive: !current[0].isActive }).where(eq(plans.id, id));
    
    revalidatePath("/admin/plans");
    revalidatePath("/pricing");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Toggle Plan Status Error:", error);
    throw error;
  }
}

export async function deletePlan(id: number) {
  try {
    await db.delete(plans).where(eq(plans.id, id));
    
    revalidatePath("/admin/plans");
    revalidatePath("/pricing");
    revalidatePath("/");
    
    return { success: true };
  } catch (error) {
    console.error("Delete Plan Error:", error);
    return { success: false, error: String(error) };
  }
}

