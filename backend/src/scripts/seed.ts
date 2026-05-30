import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { User } from '../modules/models/User';
import { Role } from '../types/enums';

const SEED_USERS = [
  { name: 'Admin User', email: 'admin@test.com', role: Role.ADMIN },
  { name: 'Sales User', email: 'sales@test.com', role: Role.SALES },
  { name: 'Sanction User', email: 'sanction@test.com', role: Role.SANCTION },
  { name: 'Disbursement User', email: 'disbursement@test.com', role: Role.DISBURSEMENT },
  { name: 'Collection User', email: 'collection@test.com', role: Role.COLLECTION },
  { name: 'Borrower User', email: 'borrower@test.com', role: Role.BORROWER },
];

const PASSWORD = 'Password@123';

async function seed(): Promise<void> {
  await connectDatabase();
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  for (const userData of SEED_USERS) {
    await User.findOneAndUpdate(
      { email: userData.email },
      {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        isActive: true,
      },
      { upsert: true, new: true },
    );
    console.log(`Seeded: ${userData.email} (${userData.role})`);
  }

  console.log('\nSeed completed. Default password: Password@123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
