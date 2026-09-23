import initSqlJs from 'sql.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const dataDir = join(currentDir, '..', 'data');
const dataFile = join(dataDir, 'usuarios.sqlite');

if (!existsSync(dataDir)) {
  mkdirSync(dataDir);
}

let db;

const persist = () => {
  writeFileSync(dataFile, Buffer.from(db.export()));
};

const selectOne = (sql, params = []) => {
  const statement = db.prepare(sql);
  statement.bind(params);
  const row = statement.step() ? statement.getAsObject() : undefined;
  statement.free();
  return row;
};

const selectAll = (sql, params = []) => {
  const statement = db.prepare(sql);
  statement.bind(params);
  const rows = [];

  while (statement.step()) {
    rows.push(statement.getAsObject());
  }

  statement.free();
  return rows;
};

export async function initDatabase() {
  const SQL = await initSqlJs();
  const fileBuffer = existsSync(dataFile) ? readFileSync(dataFile) : null;

  db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'usuario',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  persist();
}

export const usersTable = {
  create({ name, email, passwordHash, salt }) {
    db.run(
      `
        INSERT INTO users (name, email, password_hash, salt)
        VALUES (?, ?, ?, ?)
      `,
      [name, email, passwordHash, salt]
    );
    persist();
    return {
      lastInsertRowid: selectOne('SELECT id FROM users WHERE email = ?', [email]).id
    };
  },
  byEmail(email) {
    return selectOne('SELECT * FROM users WHERE email = ?', [email]);
  },
  byId(id) {
    return selectOne(
      `
        SELECT id, name, email, role, created_at AS createdAt
        FROM users WHERE id = ?
      `,
      [id]
    );
  },
  list() {
    return selectAll(`
      SELECT id, name, email, role, created_at AS createdAt
      FROM users ORDER BY id DESC
    `);
  },
  update({ id, name, email }) {
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    persist();
  }
};
