'use server';
import { db } from './db';

export async function submitName(name: unknown) {
  const conn = db.createConnection('freepass26{S3rv3r_Act10ns_L34k_S0urc3_C0d3_!!!}');
  const user = await conn.createUser(name); 

  return {
   id: user.id,
   message: `Hello, ${String(name)}! System is running smoothly.`
  }
}
