import sqlite3 from 'sqlite3';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        const dbPath = path.resolve(process.cwd(), 'database.sqlite');
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

        return new Promise<NextResponse>((resolve) => {
            const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
            
            db.get(query, (err, row) => {
                if (err) {
                    resolve(NextResponse.json({ error: 'Database error / Syntax error' }, { status: 500 }));
                } else if (!row) {
                    resolve(NextResponse.json({ error: 'Kredensial tidak valid!' }, { status: 401 }));
                } else {
                    db.get("SELECT content FROM notes WHERE id = 1", (err, noteRow: any) => {
                        db.close();
                        resolve(NextResponse.json({ 
                            success: true, 
                            message: 'Akses Diberikan. Selamat datang, Kurator.',
                            secretNote: noteRow.content
                        }));
                    });
                }
            });
        });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}
