import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

config({
  path: ".env.local",
});

const verifyUserTable = async () => {
  try {
    console.log("🔍 Verifying User table structure...");

    // Database connection
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not defined");
    }

    const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
    const db = drizzle(connection);

    // Check table structure
    const tableInfo = await db.execute(sql`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `);

    console.log("📊 User table columns:");
    tableInfo.forEach((col: any) => {
      console.log(
        `  - ${col.column_name}: ${col.data_type} ${col.is_nullable === "NO" ? "(NOT NULL)" : "(NULLABLE)"} ${col.column_default ? `DEFAULT ${col.column_default}` : ""}`,
      );
    });

    // Check indexes
    const indexes = await db.execute(sql`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = 'User'
      ORDER BY indexname;
    `);

    console.log("\n🔗 User table indexes:");
    indexes.forEach((idx: any) => {
      console.log(`  - ${idx.indexname}`);
    });

    // Check constraints
    const constraints = await db.execute(sql`
      SELECT 
        conname,
        contype,
        pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'public."User"'::regclass
      ORDER BY conname;
    `);

    console.log("\n🔒 User table constraints:");
    constraints.forEach((cons: any) => {
      const type =
        cons.contype === "p"
          ? "PRIMARY KEY"
          : cons.contype === "u"
            ? "UNIQUE"
            : cons.contype === "f"
              ? "FOREIGN KEY"
              : "OTHER";
      console.log(`  - ${cons.conname} (${type})`);
    });

    // Check existing users count
    const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM "User"`);
    console.log(`\n👥 Total users in database: ${userCount[0].count}`);

    // Check roles distribution if users exist
    if (Number.parseInt(userCount[0].count) > 0) {
      const roleCount = await db.execute(sql`
        SELECT role, COUNT(*) as count 
        FROM "User" 
        GROUP BY role 
        ORDER BY role
      `);

      console.log("\n📊 Users by role:");
      roleCount.forEach((role: any) => {
        console.log(`  - ${role.role}: ${role.count}`);
      });

      const guestCount = await db.execute(sql`
        SELECT is_guest, COUNT(*) as count 
        FROM "User" 
        GROUP BY is_guest 
        ORDER BY is_guest
      `);

      console.log("\n👤 Guest vs Regular users:");
      guestCount.forEach((guest: any) => {
        const userType = guest.is_guest ? "Guest" : "Regular";
        console.log(`  - ${userType}: ${guest.count}`);
      });
    }

    console.log("\n✅ User table verification completed successfully!");

    await connection.end();
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
};

// Run verification
if (require.main === module) {
  verifyUserTable()
    .then(() => {
      console.log("🎯 User table verification completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Fatal error during verification:", error);
      process.exit(1);
    });
}
