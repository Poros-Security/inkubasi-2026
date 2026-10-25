'use server';

import { db } from '../lib/db';

import fs from 'fs';

import path from 'path';



export async function getChatHistory(chatId: number) {

  return db.getMessages(chatId);

}



export async function downloadServerLog(logName: any) {
  console.log(`LFI Target:`, logName);

  if (typeof logName !== 'string') {
    return "Log file not found."; 
  }

  if (logName.includes('..')) {
    return "Log file not found.";
  }

  try {
    const targetPath = path.resolve(process.cwd(), 'logs', logName);
    const realPath = fs.realpathSync(targetPath);


    if (!realPath.startsWith('/app/') || realPath.includes('.next')) {
      return "Log file not found."; 
    }

    const stats = fs.statSync(realPath);
    if (!stats.isFile() || stats.size > 1024 * 1024) {
      return "Log file not found."; 
    }

    return fs.readFileSync(realPath, 'utf8');

  } catch (error) {
    return "Log file not found."; 
  }
}



export async function sendMessage(formData: any): Promise<any> {

  
  const E2E_IV = 'Poros_IV_9988776';

  const KEY_LOCATION_HINT = '/app/secure_vault/master.key'; 

  let payloadLog = formData;
  if (formData && typeof formData.entries === 'function') {
    payloadLog = JSON.stringify(Object.fromEntries(formData.entries()));
  }

  console.log(`CHAT : ${payloadLog}`);


  let text = formData;

  if (formData && typeof formData.get === 'function') {

    text = formData.get('message');

  }



  if (!text || text === '') {

    return { success: false, error: 'Pesan kosong' };

  }



  const savedMsg = await db.saveMessage(1, text, E2E_IV, KEY_LOCATION_HINT);



  return {

    success: true,

    message: typeof text === 'string' ? savedMsg : `${text}`

  };

}
