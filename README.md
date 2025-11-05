# cors-anywhere in GitHub Codespaces

This repository contains a minimal deployment of cors-anywhere configured to run inside a GitHub Codespace / devcontainer.

WARNING: By default this example allows all origins (originWhitelist is empty), which is unsafe for public exposure. Use the environment variables described below to restrict access before exposing externally.

How it works
- server.js launches cors-anywhere on port 8080.
- .devcontainer builds a container and runs `npm install` and `npm start` automatically in Codespaces.
- Forwarded port 8080 is available via the Codespace port preview.

Environment variables (recommended)
- PORT — port to listen on (default 8080)
- HOST — host to bind to (default 0.0.0.0)
- ALLOWED_ORIGINS — comma-separated list of allowed origin(s). If set, only those origins will be allowed.
  Example: ALLOWED_ORIGINS="https://example.com,http://localhost:3000"
- REQUIRE_HEADER — comma-separated request headers required (default "origin")
- BASIC_AUTH_USER and BASIC_AUTH_PASS — if both set, the server will require HTTP Basic Auth for requests (small protection)

Running in Codespaces
1. Push this repo to GitHub.
2. From the repo page, click "Code" → "Open with Codespaces" → "New codespace".
3. Codespaces will build the devcontainer image, run `npm install`, then `npm start`.
4. The container forwards port 8080 — click the Ports view in Codespaces and open the forwarded port in a new browser tab (or use the "Open in Browser" action).

Running locally
1. npm install
2. PORT=8080 node server.js
3. curl -H "Origin: http://example.com" http://localhost:8080/http://httpbin.org/get

Testing a proxied request (example)
- If your Codespace provides a preview URL like `https://<your-codespace>-8080.preview.app.github.dev`,
  request:
  https://<your-codespace>-8080.preview.app.github.dev/http://httpbin.org/get
  Make sure to set an Origin header in clients or browsers send one naturally.

Security notes (do not skip)
- Do not run this open to the public without restricting ALLOWED_ORIGINS or adding authentication.
- Use ALLOWED_ORIGINS to only allow known safe origins.
- Consider adding a reverse-proxy that enforces authentication, rate limits, and HTTPS.

If you'd like, I can:
- Add a GitHub Actions workflow to build and test the container.
- Lock ALLOWED_ORIGINS via a config file or Secrets and show how to set them in Codespaces.
- Add an instruction block to automatically set up Basic Auth via Codespaces secrets.