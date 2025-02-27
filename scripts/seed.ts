import { seed } from "../db/seed";

// Run the seed function
seed()
  .then(() => {
    console.log("✅ Seeding completed. You can now start the application.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }); 