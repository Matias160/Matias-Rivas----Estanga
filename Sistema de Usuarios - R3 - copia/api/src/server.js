import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { initDatabase, usersTable } from './database.js';

const app = express();
const port = Number(process.env.PORT) || 4000;
const secret = process.env.JWT_SECRET || 'clave-local-para-trabajo-practico';
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origen no permitido por CORS.'));
    }
  })
);
app.use(express.json({ limit: '100kb' }));

const cleanText = (value) => String(value ?? '').trim();
const cleanEmail = (value) => cleanText(value).toLowerCase();

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt ?? user.created_at
});

const passwordHash = (password, salt) =>
  pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');

const createToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '2h' });

const auth = (request, response, next) => {
  const header = request.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  try {
    const payload = jwt.verify(token, secret);
    const user = usersTable.byId(payload.id);

    if (!user) {
      return response.status(401).json({ message: 'Sesion no valida.' });
    }

    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ message: 'Sesion vencida o incorrecta.' });
  }
};

app.post('/api/register', (request, response) => {
  const name = cleanText(request.body.name);
  const email = cleanEmail(request.body.email);
  const password = cleanText(request.body.password);

  if (name.length < 2) {
    return response.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ message: 'El email no tiene un formato valido.' });
  }

  if (password.length < 6) {
    return response.status(400).json({ message: 'La password debe tener al menos 6 caracteres.' });
  }

  const salt = randomBytes(16).toString('hex');

  try {
    const result = usersTable.create({
      name,
      email,
      salt,
      passwordHash: passwordHash(password, salt)
    });
    const user = usersTable.byId(result.lastInsertRowid);

    return response.status(201).json({ user, token: createToken(user) });
  } catch {
    return response.status(409).json({ message: 'Ya existe un usuario con ese email.' });
  }
});

app.post('/api/login', (request, response) => {
  const email = cleanEmail(request.body.email);
  const password = cleanText(request.body.password);
  const user = usersTable.byEmail(email);

  if (!user || passwordHash(password, user.salt) !== user.password_hash) {
    return response.status(401).json({ message: 'Email o password incorrectos.' });
  }

  const safeUser = publicUser(user);
  return response.json({ user: safeUser, token: createToken(safeUser) });
});

app.post('/api/session', auth, (request, response) => {
  return response.json({ user: request.user });
});

app.post('/api/users', auth, (request, response) => {
  return response.json({ users: usersTable.list() });
});

app.post('/api/profile', auth, (request, response) => {
  const name = cleanText(request.body.name);
  const email = cleanEmail(request.body.email);

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ message: 'Revisa nombre y email antes de guardar.' });
  }

  try {
    usersTable.update({ id: request.user.id, name, email });
    return response.json({ user: usersTable.byId(request.user.id) });
  } catch {
    return response.status(409).json({ message: 'Ese email ya esta usado por otra cuenta.' });
  }
});

app.post('/api/health', (_request, response) => {
  return response.json({ ok: true });
});

app.use('/', (request, response) => {
  if (request.path !== '/') {
    return response.status(404).json({ message: 'Ruta no encontrada.' });
  }

  return response.json({
    ok: true,
    message: 'API Sistema de Usuarios - R3 activa',
    endpoints: ['/api/register', '/api/login', '/api/session', '/api/users', '/api/profile']
  });
});

await initDatabase();

app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});
