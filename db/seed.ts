import { db } from "./db";
import { channels, profiles, type Profile } from "./schema";
import { v4 as uuidv4 } from "uuid";

// Define seed profiles
const seedProfiles = [
  {
    id: uuidv4(),
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: uuidv4(),
    name: "Jane Smith",
    email: "jane@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: uuidv4(),
    name: "Robert Johnson",
    email: "robert@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
  },
  {
    id: uuidv4(),
    name: "Sarah Williams",
    email: "sarah@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: uuidv4(),
    name: "Michael Brown",
    email: "michael@example.com",
    imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
  },
];

// Define seed channels
const seedChannels = (profiles: Profile[]) => [
  {
    id: uuidv4(),
    name: "general",
    description: "General discussion for everyone",
    creatorId: profiles[0].id,
    type: "public",
  },
  {
    id: uuidv4(),
    name: "random",
    description: "Random topics and fun stuff",
    creatorId: profiles[1].id,
    type: "public",
  },
  {
    id: uuidv4(),
    name: "help",
    description: "Get help with various topics",
    creatorId: profiles[2].id,
    type: "public",
  },
  {
    id: uuidv4(),
    name: "announcements",
    description: "Important announcements for the team",
    creatorId: profiles[0].id,
    type: "public",
  },
  {
    id: uuidv4(),
    name: "dev-team",
    description: "Private channel for development team",
    creatorId: profiles[3].id,
    type: "private",
  },
];

// Main seed function
export async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(channels);
    await db.delete(profiles);

    // Seed profiles
    console.log("Seeding profiles...");
    const createdProfiles: Profile[] = [];
    for (const profile of seedProfiles) {
      const [createdProfile] = await db.insert(profiles).values(profile).returning();
      createdProfiles.push(createdProfile);
    }

    // Seed channels
    console.log("Seeding channels...");
    const channelsData = seedChannels(createdProfiles);
    for (const channel of channelsData) {
      await db.insert(channels).values(channel);
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    // Close the database connection
    console.log("Database connection closed.");
  }
} 