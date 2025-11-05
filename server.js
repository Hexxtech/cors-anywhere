// Basic cors-anywhere server for Codespaces
// WARNING: default configuration below allows all origins — DO NOT expose to the public internet.
// Configure originWhitelist and/or authentication for production use.

const corsAnywhere = require('cors-anywhere');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT || '8080', 10);

// Example: limit origins (strongly recommended). Provide comma-separated origins in ALLOWED_ORIGINS env var.
// If ALLOWED_ORIGINS is not set, defaults to empty array (allow all) — change before exposing publicly.
const allowed = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : []; // empty array => allow all (dangerous)

const requireHeader = (process.env.REQUIRE_HEADER || 'origin').split(',').map(h => h.trim()).filter(Boolean);
// Example: REQUIRE_HEADER="origin,x-requested-with" to require an Origin header.

const basicAuthUser = process.env.BASIC_AUTH_USER || null;
const basicAuthPass = process.env.BASIC_AUTH_PASS || null;

const serverOptions = {
  originWhitelist: allowed.length ? allowed : [], // if empty, cors-anywhere will allow all origins
  requireHeader: requireHeader.length ? requireHeader : ['origin'],
  removeHeaders: ['cookie', 'cookie2'],
  // Optionally implement simple basic auth (very small protection) via checkRequestHeadersForProxy
  checkProxyReqHeaders: function(req) {
    // This hook isn't built into cors-anywhere; instead we'll handle auth below
    return true;
  }
};

const server = corsAnywhere.createServer(serverOptions);

// If basic auth env vars are set, wrap the listener to require basic auth
if (basicAuthUser && basicAuthPass) {
  // Replace server's handle function to check Authorization
  const origEmit = server.emit.bind(server);
  server.emit = function(name, ...args) {
    if (name === 'request') {
      const req = args[0];
      const res = args[1];

      const auth = req.headers['authorization'];
      if (!auth) {
        res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="cors-anywhere"' });
        res.end('Authorization required');
        return;
      }
      const token = auth.split(' ')[1] || '';
      const decoded = Buffer.from(token, 'base64').toString();
      const [u, p] = decoded.split(':');
      if (u !== basicAuthUser || p !== basicAuthPass) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
    }
    return origEmit(name, ...args);
  };
}

server.listen(PORT, HOST, () => {
  console.log(`cors-anywhere running on ${HOST}:${PORT}`);
  if (allowed.length === 0) {
    console.warn('Warning: originWhitelist is empty — all origins are allowed. This is unsafe for public exposure.');
  } else {
    console.log('Allowed origins:', allowed);
  }
  if (basicAuthUser) {
    console.log('Basic auth enabled. Username:', basicAuthUser);
  }
});