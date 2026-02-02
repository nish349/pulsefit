import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { plans, members } from "@/lib/db/schema";

// --- Database Types (Inferred) ---
export type Plan = InferSelectModel<typeof plans>;
export type NewPlan = InferInsertModel<typeof plans>;

export type Member = InferSelectModel<typeof members>;
export type NewMember = InferInsertModel<typeof members>;

// --- Application/UI Types ---

// Extended Plan type with UI-specific fields (e.g. from relations or calculated)
export interface PlanWithDetails extends Plan {
  activeMemberCount: number;
}

// Input type for Creating/Editing (Forms)
// activeMemberCount is optional because it's calculated
// id is optional for creation
export interface PlanFormValues {
  id?: number;
  name: string;
  price: number;
  features: string[];
  isActive?: boolean;
}

// Server Action Result
export type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};
