// scripts/seed-schedules.js
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

// Paste your JSON array here (or import it)
const vets = [
  { id: "cmfev319v0003dfh4la17e95a" },
  { id: "cmfev319v0004dfh4la18e95b" },
  { id: "cmfev319v0005dfh4la19e95c" },
  { id: "cmfev319v0006dfh4la20e95d" },
  { id: "cmfev319v0007dfh4la21e95e" },
  { id: "cmfev319v0008dfh4la22e95f" },
  { id: "cmfev319v0009dfh4la23e960" },
  { id: "cmfev319v0010dfh4la24e961" },
  { id: "cmfev319v0011dfh4la25e962" },
  { id: "cmfev319v0012dfh4la26e963" },
];

const DAYS = [1,2,3,4,5,6,7];

function* slots(start = 8 * 60, end = 20 * 60, step = 30) { // minutes
  for (let m = start; m <= end; m += step) {
    const h = Math.floor(m / 60), mm = m % 60;
    yield new Date(Date.UTC(1970, 0, 1, h, mm, 0, 0)); // matches @db.Time
  }
}

async function main() {
  const data = [];
  for (const { id: vetId } of vets) {
    for (const day of DAYS) {
      for (const t of slots()) {
        data.push({ vetId, dayNumber: day, isDeleted: false, timeOfDay: t });
      }
    }
  }
  console.log("Rows to insert:", data.length); // 1750

  await prisma.schedule.createMany({
    data,
    skipDuplicates: true, // requires a UNIQUE constraint to be effective
  });

  console.log("Done.");
}

module.exports = main;