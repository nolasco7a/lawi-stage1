import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { cityMunicipality, country, deptoState } from "./schema";

config({
  path: ".env.local",
});

// Honduras location data
const hondurasData = {
  country: {
    name: "Honduras",
    iso2_code: "HN",
    iso3_code: "HND",
    area_code: "+504",
    demonym: "Honduran",
  },
  departments: [
    {
      name: "Atlántida",
      zip_code: "31",
      municipalities: [
        "La Ceiba",
        "El Porvenir",
        "Esparta",
        "Jutiapa",
        "La Masica",
        "San Francisco",
        "Tela",
        "Arizona",
      ],
    },
    {
      name: "Colón",
      zip_code: "33",
      municipalities: [
        "Trujillo",
        "Balfate",
        "Iriona",
        "Limón",
        "Sabá",
        "Santa Fe",
        "Santa Rosa de Aguán",
        "Sonaguera",
        "Tocoa",
        "Bonito Oriental",
      ],
    },
    {
      name: "Comayagua",
      zip_code: "12",
      municipalities: [
        "Comayagua",
        "Ajuterique",
        "El Rosario",
        "Esquías",
        "Humuya",
        "La Libertad",
        "Lamaní",
        "La Trinidad",
        "Lejamaní",
        "Meámbar",
        "Minas de Oro",
        "Ojo de Agua",
        "San Jerónimo",
        "San José de Comayagua",
        "San José del Potrero",
        "San Luis",
        "San Sebastián",
        "Siguatepeque",
        "Villa de San Antonio",
        "Lajas",
        "Taulabe",
      ],
    },
    {
      name: "Copán",
      zip_code: "41",
      municipalities: [
        "Santa Rosa de Copán",
        "Cabañas",
        "Concepción",
        "Copán Ruinas",
        "Corquín",
        "Cucuyagua",
        "Dolores",
        "Dulce Nombre",
        "El Paraíso",
        "Florida",
        "La Jigua",
        "La Unión",
        "Nueva Arcadia",
        "San Agustín",
        "San Antonio",
        "San Jerónimo",
        "San José",
        "San Juan de Opoa",
        "San Nicolás",
        "San Pedro",
        "Santa Rita",
        "Trinidad de Copán",
        "Veracruz",
      ],
    },
    {
      name: "Cortés",
      zip_code: "21",
      municipalities: [
        "San Pedro Sula",
        "Choloma",
        "Omoa",
        "Pimienta",
        "Potrerillos",
        "Puerto Cortés",
        "San Antonio de Cortés",
        "San Francisco de Yojoa",
        "San Manuel",
        "Santa Cruz de Yojoa",
        "Villanueva",
        "La Lima",
      ],
    },
    {
      name: "Choluteca",
      zip_code: "51",
      municipalities: [
        "Choluteca",
        "Apacilagua",
        "Concepción de María",
        "Duyure",
        "El Corpus",
        "El Triunfo",
        "Marcovia",
        "Morolica",
        "Namasigue",
        "Orocuina",
        "Pespire",
        "San Antonio de Flores",
        "San Isidro",
        "San José",
        "San Marcos de Colón",
        "Santa Ana de Yusguare",
      ],
    },
    {
      name: "El Paraíso",
      zip_code: "13",
      municipalities: [
        "Yuscarán",
        "Alauca",
        "Danlí",
        "El Paraíso",
        "Güinope",
        "Jacaleapa",
        "Liure",
        "Morocelí",
        "Oropolí",
        "Potrerillos",
        "San Antonio de Flores",
        "San Lucas",
        "San Matías",
        "Soledad",
        "Teupasenti",
        "Texiguat",
        "Vado Ancho",
        "Yauyupe",
        "Trojes",
      ],
    },
    {
      name: "Francisco Morazán",
      zip_code: "11",
      municipalities: [
        "Distrito Central",
        "Alubarén",
        "Cedros",
        "Curarén",
        "El Porvenir",
        "Guaimaca",
        "La Libertad",
        "La Venta",
        "Lepaterique",
        "Maraita",
        "Marale",
        "Nueva Armenia",
        "Ojojona",
        "Orica",
        "Reitoca",
        "Sabanagrande",
        "San Antonio de Oriente",
        "San Buenaventura",
        "San Ignacio",
        "San Juan de Flores",
        "San Miguelito",
        "Santa Ana",
        "Santa Lucía",
        "Talanga",
        "Tatumbla",
        "Valle de Ángeles",
        "Villa de San Francisco",
        "Vallecillo",
      ],
    },
    {
      name: "Gracias a Dios",
      zip_code: "32",
      municipalities: [
        "Puerto Lempira",
        "Brus Laguna",
        "Ahuas",
        "Juan Francisco Bulnes",
        "Ramón Villeda Morales",
        "Wampusirpi",
      ],
    },
    {
      name: "Intibucá",
      zip_code: "14",
      municipalities: [
        "La Esperanza",
        "Camasca",
        "Colomoncagua",
        "Concepción",
        "Dolores",
        "Intibucá",
        "Jesús de Otoro",
        "Magdalena",
        "Masaguara",
        "San Antonio",
        "San Isidro",
        "San Juan",
        "San Marcos de la Sierra",
        "San Miguelito",
        "Santa Lucía",
        "Yamaranguila",
        "San Francisco de Opalaca",
      ],
    },
    {
      name: "Islas de la Bahía",
      zip_code: "34",
      municipalities: ["Roatán", "Guanaja", "José Santos Guardiola", "Utila"],
    },
    {
      name: "La Paz",
      zip_code: "15",
      municipalities: [
        "La Paz",
        "Aguanqueterique",
        "Cabañas",
        "Cane",
        "Chinacla",
        "Guajiquiro",
        "Lauterique",
        "Marcala",
        "Mercedes de Oriente",
        "Opatoro",
        "San Antonio del Norte",
        "San José",
        "San Juan",
        "San Pedro de Tutule",
        "Santa Ana",
        "Santa Elena",
        "Santa María",
        "Santiago de Puringla",
        "Yarula",
      ],
    },
    {
      name: "Lempira",
      zip_code: "42",
      municipalities: [
        "Gracias",
        "Belén",
        "Candelaria",
        "Cololaca",
        "Erandique",
        "Gualcince",
        "Guarita",
        "La Campa",
        "La Iguala",
        "Las Flores",
        "Lepaera",
        "Mapulaca",
        "Piraera",
        "San Andrés",
        "San Francisco",
        "San Juan Guarita",
        "San Manuel Colohete",
        "San Rafael",
        "San Sebastián",
        "Santa Cruz",
        "Talgua",
        "Tambla",
        "Tomalá",
        "Valladolid",
        "Virgilio Rodríguez",
        "San Marcos de Caiquín",
        "La Virtud",
        "Dolores Merendón",
      ],
    },
    {
      name: "Ocotepeque",
      zip_code: "43",
      municipalities: [
        "Nueva Ocotepeque",
        "Belén Gualcho",
        "Concepción",
        "Dolores Merendón",
        "Fraternidad",
        "La Encarnación",
        "La Labor",
        "Lucerna",
        "Mercedes",
        "Ocotepeque",
        "San Fernando",
        "San Francisco del Valle",
        "San Jorge",
        "San Marcos",
        "Santa Fe",
        "Sinuapa",
      ],
    },
    {
      name: "Olancho",
      zip_code: "16",
      municipalities: [
        "Juticalpa",
        "Campamento",
        "Catacamas",
        "Concordia",
        "Dulce Nombre de Culmí",
        "El Rosario",
        "Esquipulas del Norte",
        "Gualaco",
        "Guarizama",
        "Guata",
        "Guayape",
        "Jano",
        "La Unión",
        "Mangulile",
        "Manto",
        "Salamá",
        "San Esteban",
        "San Francisco de Becerra",
        "San Francisco de la Paz",
        "Santa María del Real",
        "Silca",
        "Yocón",
        "Patuca",
      ],
    },
    {
      name: "Santa Bárbara",
      zip_code: "22",
      municipalities: [
        "Santa Bárbara",
        "Arada",
        "Atima",
        "Azacualpa",
        "Ceguaca",
        "Concepción del Norte",
        "Concepción del Sur",
        "Chinda",
        "El Níspero",
        "Gualala",
        "Ilama",
        "Las Vegas",
        "Macuelizo",
        "Nuevo Celilac",
        "Petoa",
        "Protección",
        "Quimistán",
        "San Francisco de Ojuera",
        "San José de Colinas",
        "San Luis",
        "San Marcos",
        "San Nicolás",
        "San Pedro Zacapa",
        "San Vicente Centenario",
        "Santa Rita",
        "Trinidad",
        "Nueva Frontera",
        "San Francisco del Valle",
      ],
    },
    {
      name: "Valle",
      zip_code: "52",
      municipalities: [
        "Nacaome",
        "Alianza",
        "Amapala",
        "Aramecina",
        "Caridad",
        "Goascorán",
        "Langue",
        "San Francisco de Coray",
        "San Lorenzo",
      ],
    },
    {
      name: "Yoro",
      zip_code: "23",
      municipalities: [
        "Yoro",
        "Arenal",
        "El Negrito",
        "El Progreso",
        "Jocón",
        "Morazán",
        "Olanchito",
        "Santa Rita",
        "Sulaco",
        "Victoria",
        "Yorito",
      ],
    },
  ],
};

const runSeed = async () => {
  try {
    console.info("Starting Honduras location seed...");

    // Database connection
    if (!process.env.POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not defined");
    }

    const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
    const db = drizzle(connection);

    // Check if Honduras already exists
    const [existingCountry] = await db
      .select()
      .from(country)
      .where(eq(country.name, hondurasData.country.name));

    if (existingCountry) {
      console.info("Honduras already exists in database. Skipping seed.");
      await connection.end();
      return;
    }

    // Seed Honduras country data
    console.info("Seeding Honduras country data...");
    const [countryRecord] = await db.insert(country).values(hondurasData.country).returning();

    if (!countryRecord) {
      throw new Error("Failed to create country record");
    }

    console.info(`Country created: ${countryRecord.name} (${countryRecord.id})`);

    // Seed departments and municipalities
    let totalMunicipalities = 0;

    for (const department of hondurasData.departments) {
      console.info(`Seeding department: ${department.name}...`);

      const [deptoRecord] = await db
        .insert(deptoState)
        .values({
          country_id: countryRecord.id,
          name: department.name,
          zip_code: department.zip_code,
        })
        .returning();

      if (!deptoRecord) {
        console.error(`Failed to create department: ${department.name}`);
        continue;
      }

      console.info(`Department created: ${deptoRecord.name} (${deptoRecord.id})`);

      // Seed municipalities for this department
      for (const municipality of department.municipalities) {
        await db.insert(cityMunicipality).values({
          country_id: countryRecord.id,
          depto_state_id: deptoRecord.id,
          name: municipality,
        });
        totalMunicipalities++;
      }

      console.info(`Added ${department.municipalities.length} municipalities`);
    }

    console.info(" Seed completed successfully!");
    console.info(" Summary:");
    console.info("  - Country: 1 (Honduras)");
    console.info(`  - Departments: ${hondurasData.departments.length}`);
    console.info(`  - Municipalities: ${totalMunicipalities}`);

    // Close database connection
    await connection.end();
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  await runSeed()
    .then(() => {
      console.info("Seed process completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error during seed:", error);
      process.exit(1);
    });
}

export default runSeed;
