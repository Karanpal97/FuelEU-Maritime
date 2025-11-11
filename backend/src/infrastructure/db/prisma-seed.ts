import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = [
  {
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true, // Set R001 as baseline
  },
  {
    routeId: 'R002',
    vesselType: 'BulkCarrier',
    fuelType: 'LNG',
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    isBaseline: false,
  },
  {
    routeId: 'R003',
    vesselType: 'Tanker',
    fuelType: 'MGO',
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
    isBaseline: false,
  },
  {
    routeId: 'R004',
    vesselType: 'RoRo',
    fuelType: 'HFO',
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
    isBaseline: false,
  },
  {
    routeId: 'R005',
    vesselType: 'Container',
    fuelType: 'LNG',
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
    isBaseline: false,
  },
];

async function seed(): Promise<void> {
  try {
    console.log(' Seeding database with Prisma...');
    
    await prisma.poolMember.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.bankEntry.deleteMany();
    await prisma.shipCompliance.deleteMany();
    await prisma.route.deleteMany();
    
    for (const route of seedData) {
      await prisma.route.create({
        data: route,
      });
    }
    
    console.log(' Database seeded successfully');
    console.log(`   - Inserted ${seedData.length} routes`);
    console.log(`   - Baseline: R001 (Container, HFO, 2024, 91.0 gCO₂e/MJ)`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();

