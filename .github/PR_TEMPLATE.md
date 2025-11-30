Summary
-------
- Sanitize committed env files, add `.env.example` and ignore local env files.
- Add typed `src/lib/env.ts` and wire `@env` tsconfig alias to it.
- Add centralized `src/lib/logger.ts` and replace ad-hoc `console.log` with logger calls.
- Remove `SECRET_KEY` from `expo.extra` in `app.config.js` and add guidance.
- Restore app `Settings` screen to show `Env.NAME` and `Env.VERSION`.

Notes
-----
- This PR focuses on removing secrets from the repo and improving developer ergonomics.
- No behavior changes expected for production builds (secrets must be provided by CI).
