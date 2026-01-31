/**
 * Database Reset Script
 *
 * Clears all user data while preserving schema structure.
 * Use this for clean-slate deployments or testing.
 *
 * Run: npm run db:reset
 *
 * CAUTION: This permanently deletes all user data!
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

neonConfig.webSocketConstructor = ws;

async function resetDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('ERROR: DATABASE_URL environment variable not set');
    process.exit(1);
  }

  // Safety check for production
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: Cannot reset database in production mode');
    console.error('Set NODE_ENV to development or remove the check if intentional');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle({ client: pool, schema });

  console.log('Starting database reset...\n');

  try {
    // Delete in order respecting foreign key constraints
    // (login_attempts references users via userId)

    console.log('Deleting login_attempts...');
    await db.delete(schema.loginAttempts);

    console.log('Deleting support_tickets...');
    await db.delete(schema.supportTickets);

    console.log('Deleting feedbacks...');
    await db.delete(schema.feedbacks);

    console.log('Deleting paid_members...');
    await db.delete(schema.paidMembers);

    console.log('Deleting users...');
    await db.delete(schema.users);

    // Reset app_config to defaults (don't delete - app needs it)
    console.log('Resetting app_config to defaults...');
    await db.update(schema.appConfig).set({
      requireCircleDomain: true,
      requireCircleLogin: true,
      requirePaywall: false,
      requirePin: true,
      paywallPurchaseUrl: '',
      paywallInfoUrl: '',
      paywallTitle: 'Acces Reserve',
      paywallMessage: 'Cette application est reservee aux membres ayant souscrit.',
      webhookAppUrl: '',
      environment: 'development',
      updatedAt: new Date(),
    });

    console.log('\n✓ Database reset complete!');
    console.log('  - All user data cleared');
    console.log('  - Schema preserved');
    console.log('  - App config reset to defaults');

  } catch (error) {
    console.error('Reset failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

resetDatabase();
