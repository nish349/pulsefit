
"use server";

import { db } from "@/lib/db";
import { members, plans } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import crypto from 'node:crypto';

// We define a separate input type because we accept 'password' but save 'passwordHash'
export type CreateMemberInput = Omit<typeof members.$inferInsert, 'passwordHash' | 'id' | 'joinedAt'> & {
    password?: string;
};

export async function createMember(data: CreateMemberInput) {
  try {
    // Only hash if password is provided (e.g. later updates or if we keep it optional)
    let passwordHash: string | null = null;
    
    if (data.password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(data.password, salt, 1000, 64, 'sha512').toString('hex');
        passwordHash = `${salt}:${hash}`;
    }
    
    // Omit password from matching 'data' to database columns
    const { password, ...dbData } = data;

    const result = await db.insert(members).values({
        ...dbData,
        passwordHash, // Now can be null
        dob: data.dob || new Date(),
        role: data.role || 'member',
        status: data.status || 'pending_payment'
    }).returning({ id: members.id });

    revalidatePath("/admin/members");
    return { success: true, memberId: result[0].id };
  } catch (error) {
    console.error("Failed to create member:", error);
    throw new Error("Failed to create member");
  }
}

export async function getMembers() {
  try {
    const rows = await db
      .select({
        member: members,
        plan: plans,
      })
      .from(members)
      .leftJoin(plans, eq(members.planId, plans.id));

    return rows.map((row) => ({
      ...row.member,
      planName: row.plan?.name || "Unknown",
      planPrice: row.plan?.price || 0,
    }));
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
}

export async function updateMemberStatus(id: number, status: 'active' | 'inactive' | 'pending_payment') {
  try {
    await db.update(members).set({ status }).where(eq(members.id, id));
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error) {
    console.error("Failed to update member status:", error);
    throw new Error("Failed to update status");
  }
}
