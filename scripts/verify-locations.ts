import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, count } from "drizzle-orm";
import { country, deptoState, cityMunicipality } from "../lib/db/schema";

config({
  path: ".env.local",
});

const verifyLocationData = async () => {
  try {
    console.log("🔍 Verifying Honduras location data...");

    // Database connection
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not defined");
    }

    const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
    const db = drizzle(connection);

    // Get Honduras
    const [honduras] = await db.select().from(country).where(eq(country.name, "Honduras"));

    if (!honduras) {
      console.error("❌ Honduras not found in database");
      return;
    }

    console.log(`🇭🇳 Country: ${honduras.name} (${honduras.iso2_code})`);
    console.log(`   Area Code: ${honduras.area_code}`);
    console.log(`   Demonym: ${honduras.demonym}`);

    // Count departments
    const [deptoCount] = await db
      .select({ count: count() })
      .from(deptoState)
      .where(eq(deptoState.country_id, honduras.id));

    console.log(`🏛️ Departments: ${deptoCount.count}`);

    // Count municipalities
    const departments = await db
      .select()
      .from(deptoState)
      .where(eq(deptoState.country_id, honduras.id));

    let totalMunicipalities = 0;

    for (const dept of departments) {
      const [cityCount] = await db
        .select({ count: count() })
        .from(cityMunicipality)
        .where(eq(cityMunicipality.depto_state_id, dept.id));

      console.log(`  📍 ${dept.name}: ${cityCount.count} municipalities`);
      totalMunicipalities += cityCount.count;
    }

    console.log(`📊 Total municipalities: ${totalMunicipalities}`);

    // Sample some cities
    console.log("\n🏙️ Sample cities:");
    const sampleCities = await db
      .select({
        city: cityMunicipality.name,
        department: deptoState.name,
      })
      .from(cityMunicipality)
      .innerJoin(deptoState, eq(cityMunicipality.depto_state_id, deptoState.id))
      .limit(10);

    sampleCities.forEach((city) => {
      console.log(`   - ${city.city}, ${city.department}`);
    });

    console.log("\n✅ Verification completed successfully!");

    await connection.end();
  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
};

// Run verification
if (require.main === module) {
  verifyLocationData()
    .then(() => {
      console.log("🎯 Location data verification completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Fatal error during verification:", error);
      process.exit(1);
    });
}
