
import { db } from "../lib/db";
import { plans } from "../lib/db/schema";

const initialPlans = [
    { name: 'Standard Plan', price: 3000, durationMonths: 1, features: ['15-minute assessment', '98% accuracy rate', 'Sport-specific insights'] },
    { name: 'Business Plan', price: 5000, durationMonths: 1, features: ['15-minute assessment', '98% accuracy rate', 'Sport-specific insights', 'Priority Support'] },
    { name: 'Enterprise Plan', price: 8000, durationMonths: 1, features: ['15-minute assessment', '98% accuracy rate', 'Sport-specific insights', 'Dedicated Agent'] },
];

async function main() {
    console.log("Seeding plans...");
    try {
        await db.insert(plans).values(initialPlans);
        console.log("Plans seeded successfully!");
    } catch (e) {
        console.error("Error seeding plans:", e);
    }
    process.exit(0);
}

main();
