import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as bcrypt from 'bcrypt';
import { users } from '../drizzle/schema';

async function createAdmin() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const hashedPassword = await bcrypt.hash('your-secure-password', 10);

  const [admin] = await db
    .insert(users)
    .values({
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
    })
    .returning();

  console.log('Admin user created:', admin);
}

createAdmin();
