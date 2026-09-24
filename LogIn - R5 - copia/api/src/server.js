import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDatabase, usersTable } from './database.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const envFile = join(currentDir, '..', '.env');

if (existsSync(envFile)) {
  const lines = readFileSync(envFile, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const [key, ...valueParts] = line.split('=');

    if (key && valueParts.length && !process.env[key]) {
      process.env[key] = valueParts.join('=').trim();
    }
  }
}

const app = express();
const port = Number(process.env.PORT) || 4000;
const secret = process.env.JWT_SECRET || 'clave-local-para-trabajo-practico';
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
const googleRedirectUri =
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/oauth/google/callback';
const githubClientId = process.env.GITHUB_CLIENT_ID || '';
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || '';
const githubRedirectUri =
  process.env.GITHUB_REDIRECT_URI || 'http://localhost:4000/api/oauth/github/callback';
const discordClientId = process.env.DISCORD_CLIENT_ID || '';
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET || '';
const discordRedirectUri =
  process.env.DISCORD_REDIRECT_URI || 'http://localhost:4000/api/oauth/discord/callback';
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:5180',
  'http://localhost:5181',
  'http://127.0.0.1:5180',
  'http://127.0.0.1:5181'
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
const escapeHtml = (value) =>
  cleanText(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  provider: user.provider ?? 'local',
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

const adminOnly = (request, response, next) => {
  if (request.user.role !== 'admin') {
    return response.status(403).json({ message: 'Solo el usuario admin puede hacer esta accion.' });
  }

  return next();
};

app.post('/api/register', (request, response) => {
  const name = cleanText(request.body.name);
  const email = cleanEmail(request.body.email);
  const password = cleanText(request.body.password);
  const passwordConfirm = cleanText(request.body.passwordConfirm);

  if (name.length < 2) {
    return response.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ message: 'El email no tiene un formato valido.' });
  }

  if (password.length < 6) {
    return response.status(400).json({ message: 'La password debe tener al menos 6 caracteres.' });
  }

  if (password !== passwordConfirm) {
    return response.status(400).json({ message: 'Las passwords no coinciden.' });
  }

  const salt = randomBytes(16).toString('hex');

  try {
    const result = usersTable.create({
      name,
      email,
      salt,
      passwordHash: passwordHash(password, salt),
      provider: 'local'
    });
    const user = usersTable.byId(result.lastInsertRowid);

    return response.status(201).json({ user: publicUser(user), token: createToken(user) });
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

/* SOCIAL OAUTH LOGIN ENDPOINT (R5) */
app.post('/api/social-login', (request, response) => {
  const provider = cleanText(request.body.provider || 'google').toLowerCase();
  const credential = cleanText(request.body.credential);

  if (provider === 'google' && credential) {
    return fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
      .then((googleResponse) => googleResponse.json().then((profile) => ({ googleResponse, profile })))
      .then(({ googleResponse, profile }) => {
        if (!googleResponse.ok || profile.aud !== googleClientId || !profile.email) {
          return response.status(401).json({ message: 'Google no valido la identidad del usuario.' });
        }

        const email = cleanEmail(profile.email);
        let user = usersTable.byEmail(email);

        if (!user) {
          const salt = randomBytes(16).toString('hex');
          const dummyPassword = randomBytes(32).toString('hex');
          const result = usersTable.create({
            name: cleanText(profile.name) || 'Usuario Google',
            email,
            salt,
            passwordHash: passwordHash(dummyPassword, salt),
            role: 'usuario',
            provider: 'google'
          });
          user = usersTable.byId(result.lastInsertRowid);
        } else {
          user = usersTable.byId(user.id);
        }

        const safeUser = publicUser(user);
        return response.json({ user: safeUser, token: createToken(safeUser) });
      })
      .catch(() => response.status(401).json({ message: 'No se pudo validar Google.' }));
  }

  const rawEmail = request.body.email || `${provider}.user@social.com`;
  const email = cleanEmail(rawEmail);
  const name = cleanText(request.body.name || `Usuario ${provider.toUpperCase()}`);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return response.status(400).json({ message: 'El email social no es valido.' });
  }

  let user = usersTable.byEmail(email);

  if (!user) {
    const salt = randomBytes(16).toString('hex');
    const dummyPassword = randomBytes(32).toString('hex');
    const result = usersTable.create({
      name,
      email,
      salt,
      passwordHash: passwordHash(dummyPassword, salt),
      role: 'usuario',
      provider
    });
    user = usersTable.byId(result.lastInsertRowid);
  } else {
    user = usersTable.byId(user.id);
  }

  const safeUser = publicUser(user);
  return response.json({ user: safeUser, token: createToken(safeUser) });
});

app.use('/api/oauth/google/callback', async (request, response) => {
  const code = cleanText(request.query.code);
  const state = cleanText(request.query.state);

  const sendPopupResult = (payload, origin = 'http://localhost:5173') => {
    response.type('html').send(`
      <!doctype html>
      <html lang="es">
        <body>
          <script>
            window.opener?.postMessage(${JSON.stringify(payload)}, ${JSON.stringify(origin)});
            window.close();
          </script>
          <p>Ya podes cerrar esta ventana.</p>
        </body>
      </html>
    `);
  };

  let origin = 'http://localhost:5173';

  try {
    const parsedState = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));

    if (allowedOrigins.includes(parsedState.origin)) {
      origin = parsedState.origin;
    }
  } catch {
    origin = 'http://localhost:5173';
  }

  if (!code || !googleClientId || !googleClientSecret) {
    sendPopupResult(
      {
        type: 'google-oauth-error',
        message: 'Falta configurar Google OAuth en la API.'
      },
      origin
    );
    return;
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: googleRedirectUri,
        grant_type: 'authorization_code'
      })
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Google no devolvio un token valido.');
    }

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.email) {
      throw new Error('No se pudo obtener el perfil de Google.');
    }

    const email = cleanEmail(profile.email);
    let user = usersTable.byEmail(email);

    if (!user) {
      const salt = randomBytes(16).toString('hex');
      const dummyPassword = randomBytes(32).toString('hex');
      const result = usersTable.create({
        name: cleanText(profile.name) || 'Usuario Google',
        email,
        salt,
        passwordHash: passwordHash(dummyPassword, salt),
        role: 'usuario',
        provider: 'google'
      });
      user = usersTable.byId(result.lastInsertRowid);
    } else {
      user = usersTable.byId(user.id);
    }

    const safeUser = publicUser(user);
    sendPopupResult(
      {
        type: 'google-oauth-success',
        user: safeUser,
        token: createToken(safeUser)
      },
      origin
    );
  } catch (error) {
    sendPopupResult(
      {
        type: 'google-oauth-error',
        message: escapeHtml(error.message || 'No se pudo iniciar sesion con Google.')
      },
      origin
    );
  }
});

app.use('/api/oauth/github/callback', async (request, response) => {
  const code = cleanText(request.query.code);
  const state = cleanText(request.query.state);

  const sendPopupResult = (payload, origin = 'http://localhost:5180') => {
    response.type('html').send(`
      <!doctype html>
      <html lang="es">
        <body>
          <script>
            window.opener?.postMessage(${JSON.stringify(payload)}, ${JSON.stringify(origin)});
            window.close();
          </script>
          <p>Ya podes cerrar esta ventana.</p>
        </body>
      </html>
    `);
  };

  let origin = 'http://localhost:5180';

  try {
    const parsedState = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));

    if (allowedOrigins.includes(parsedState.origin)) {
      origin = parsedState.origin;
    }
  } catch {
    origin = 'http://localhost:5180';
  }

  if (!code || !githubClientId || !githubClientSecret) {
    sendPopupResult(
      {
        type: 'github-oauth-error',
        message: 'Falta configurar GitHub OAuth en la API.'
      },
      origin
    );
    return;
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
        redirect_uri: githubRedirectUri
      })
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'GitHub no devolvio un token valido.');
    }

    const profileResponse = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${tokenData.access_token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.id) {
      throw new Error('No se pudo obtener el perfil de GitHub.');
    }

    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${tokenData.access_token}`,
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    const emails = emailsResponse.ok ? await emailsResponse.json() : [];
    const primaryEmail = Array.isArray(emails)
      ? emails.find((item) => item.primary && item.verified)?.email || emails.find((item) => item.verified)?.email
      : '';
    const email = cleanEmail(primaryEmail || `${profile.login}@github.local`);
    let user = usersTable.byEmail(email);

    if (!user) {
      const salt = randomBytes(16).toString('hex');
      const dummyPassword = randomBytes(32).toString('hex');
      const result = usersTable.create({
        name: cleanText(profile.name) || cleanText(profile.login) || 'Usuario GitHub',
        email,
        salt,
        passwordHash: passwordHash(dummyPassword, salt),
        role: 'usuario',
        provider: 'github'
      });
      user = usersTable.byId(result.lastInsertRowid);
    } else {
      user = usersTable.byId(user.id);
    }

    const safeUser = publicUser(user);
    sendPopupResult(
      {
        type: 'github-oauth-success',
        user: safeUser,
        token: createToken(safeUser)
      },
      origin
    );
  } catch (error) {
    sendPopupResult(
      {
        type: 'github-oauth-error',
        message: escapeHtml(error.message || 'No se pudo iniciar sesion con GitHub.')
      },
      origin
    );
  }
});

app.use('/api/oauth/discord/callback', async (request, response) => {
  const code = cleanText(request.query.code);
  const state = cleanText(request.query.state);

  const sendPopupResult = (payload, origin = 'http://localhost:5180') => {
    response.type('html').send(`
      <!doctype html>
      <html lang="es">
        <body>
          <script>
            window.opener?.postMessage(${JSON.stringify(payload)}, ${JSON.stringify(origin)});
            window.close();
          </script>
          <p>Ya podes cerrar esta ventana.</p>
        </body>
      </html>
    `);
  };

  let origin = 'http://localhost:5180';

  try {
    const parsedState = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));

    if (allowedOrigins.includes(parsedState.origin)) {
      origin = parsedState.origin;
    }
  } catch {
    origin = 'http://localhost:5180';
  }

  if (!code || !discordClientId || !discordClientSecret) {
    sendPopupResult(
      {
        type: 'discord-oauth-error',
        message: 'Falta configurar Discord OAuth en la API.'
      },
      origin
    );
    return;
  }

  try {
    const basicToken = Buffer.from(`${discordClientId}:${discordClientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: discordRedirectUri
      })
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Discord no devolvio un token valido.');
    }

    const profileResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await profileResponse.json();

    if (!profileResponse.ok || !profile.id) {
      throw new Error('No se pudo obtener el perfil de Discord.');
    }

    const email = cleanEmail(profile.email || `${profile.id}@discord.local`);
    let user = usersTable.byEmail(email);

    if (!user) {
      const salt = randomBytes(16).toString('hex');
      const dummyPassword = randomBytes(32).toString('hex');
      const result = usersTable.create({
        name: cleanText(profile.global_name) || cleanText(profile.username) || 'Usuario Discord',
        email,
        salt,
        passwordHash: passwordHash(dummyPassword, salt),
        role: 'usuario',
        provider: 'discord'
      });
      user = usersTable.byId(result.lastInsertRowid);
    } else {
      user = usersTable.byId(user.id);
    }

    const safeUser = publicUser(user);
    sendPopupResult(
      {
        type: 'discord-oauth-success',
        user: safeUser,
        token: createToken(safeUser)
      },
      origin
    );
  } catch (error) {
    sendPopupResult(
      {
        type: 'discord-oauth-error',
        message: escapeHtml(error.message || 'No se pudo iniciar sesion con Discord.')
      },
      origin
    );
  }
});

app.post('/api/session', auth, (request, response) => {
  return response.json({ user: publicUser(request.user) });
});

app.post('/api/users', auth, (request, response) => {
  return response.json({ users: usersTable.list() });
});

app.post('/api/users/delete', auth, adminOnly, (request, response) => {
  const id = Number(request.body.id);

  if (!id || id === request.user.id) {
    return response.status(400).json({ message: 'No se puede borrar ese usuario.' });
  }

  const user = usersTable.byId(id);

  if (!user) {
    return response.status(404).json({ message: 'Usuario no encontrado.' });
  }

  if (user.role === 'admin') {
    return response.status(400).json({ message: 'No se puede borrar un usuario admin.' });
  }

  usersTable.deleteById(id);
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
    return response.json({ user: publicUser(usersTable.byId(request.user.id)) });
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
    message: 'API LogIn - R5 (con OAuth / Social Login) activa',
    endpoints: ['/api/register', '/api/login', '/api/social-login', '/api/session', '/api/users', '/api/profile']
  });
});

const adminSalt = 'admin-local-salt-r3';

await initDatabase({
  name: 'Administrador',
  email: 'admin@usuarios.com',
  salt: adminSalt,
  passwordHash: passwordHash('Admin123', adminSalt)
});

app.listen(port, () => {
  console.log(`API disponible en http://localhost:${port}`);
});
