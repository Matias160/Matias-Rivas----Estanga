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

export async function initDatabase(adminUser) {
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
      provider TEXT NOT NULL DEFAULT 'local',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration check for existing SQLite file missing provider column
  try {
    db.run(`ALTER TABLE users ADD COLUMN provider TEXT NOT NULL DEFAULT 'local'`);
  } catch (e) {
    // Column already exists
  }

  if (adminUser && !selectOne('SELECT id FROM users WHERE email = ?', [adminUser.email])) {
    db.run(
      `
        INSERT INTO users (name, email, password_hash, salt, role, provider)
        VALUES (?, ?, ?, ?, 'admin', 'local')
      `,
      [adminUser.name, adminUser.email, adminUser.passwordHash, adminUser.salt]
    );
  }

  persist();
}

export const usersTable = {
  create({ name, email, passwordHash, salt, role = 'usuario', provider = 'local' }) {
    db.run(
      `
        INSERT INTO users (name, email, password_hash, salt, role, provider)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, passwordHash, salt, role, provider]
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
        SELECT id, name, email, role, provider, created_at AS createdAt
        FROM users WHERE id = ?
      `,
      [id]
    );
  },
  list() {
    return selectAll(`
      SELECT id, name, email, role, provider, created_at AS createdAt
      FROM users ORDER BY id DESC
    `);
  },
  update({ id, name, email }) {
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    persist();
  },
  deleteById(id) {
    db.run('DELETE FROM users WHERE id = ?', [id]);
    persist();
  }
};
