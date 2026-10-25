const fs = require('fs');
const crypto = require('crypto');

const KEY = 'Poros_Secret_Key_2026_xXxXxXxX!!'; 
const IV = 'Poros_IV_9988776';

function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

const msg1 = encrypt('SYSTEM BACKUP PROTOCOL INITIATED.');
const msg2 = encrypt('ENCRYPTED FLAG ARCHIVE:');
const flag = encrypt('PorosCTF{soUrc3_c0de_leak_W1th_1D0r_and_lF1_8495}'); 


const dbPath = './src/lib/db.ts';
let dbContent = fs.readFileSync(dbPath, 'utf8');

dbContent = dbContent.replace('__HEX_MSG_1__', msg1);
dbContent = dbContent.replace('__HEX_MSG_2__', msg2);
dbContent = dbContent.replace('__HEX_FLAG__', flag);

fs.writeFileSync(dbPath, dbContent);
