# QuickTask - Cursor Starter (Expo + Relay API)

A minimal, production-minded mobile app scaffold built with Expo and a Relay API backend. Android-first (Expo), iOS supported. Email is sent via a tiny relay API (Express + Nodemailer).

## Project Structure

```
task2mailv1/
  app/                    # Expo mobile app
    App.tsx
    screens/              # Capture, Outbox, Settings
    components/           # StatusBadge, ImageThumb
    lib/                  # Business logic (storage, email, image)
    state/                # useOutbox hook
    hooks/                # useOnline hook
  relay-api/             # Express API server
    src/
      index.ts           # Express app with /send endpoint
      mail.ts            # Nodemailer integration
      env.ts             # Environment config
    .env                 # SMTP configuration
  package.json
  app.json
  tsconfig.json
```

## Getting Started

### 1. Set up the Relay API

```bash
cd relay-api
cp .env.example .env  # Create .env file
# Edit .env with your SMTP settings
npm install
npm run dev
```

**Configure SMTP in `.env`:**
```bash
PORT=4000
SMTP_URL=smtp://USERNAME:PASSWORD@HOST:PORT
FROM_ADDRESS="QuickTask Relay <no-reply@yourdomain.com>"
```

**Using Gmail SMTP:**
1. Enable 2FA on your Google account
2. Create an App Password
3. Use: `SMTP_URL=smtp://user@gmail.com:APP_PASSWORD@smtp.gmail.com:587`

**Alternative: Mailgun, SendGrid, etc.**
- Use their SMTP settings in the SMTP_URL format

### 2. Set up the Expo App

```bash
# In the root directory
npm install
# Create .env.local with API endpoint
echo "EXPO_PUBLIC_API_BASE=http://10.0.2.2:4000" > .env.local
npm start
```

**Environment Variables:**
- `EXPO_PUBLIC_API_BASE=http://10.0.2.2:4000` (Android emulator)
- `EXPO_PUBLIC_API_BASE=http://localhost:4000` (iOS simulator)

### 3. Run the App

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go on a physical device

## First Run

1. Open the app
2. Go to Settings
3. Enter your destination email address
4. Return to Capture screen
5. Type a task/note and send!

## Features

- ✅ Offline queuing (SQLite storage)
- ✅ Automatic retry on network reconnect
- ✅ Image capture and compression
- ✅ Outbox with status badges
- ✅ Device metadata (optional)
- ✅ Rate limiting on API
- ✅ Clean, type-safe codebase (TypeScript)

## Development

```bash
# Run API
cd relay-api && npm run dev

# Run app
npm start

# Build
cd relay-api && npm run build
```

## Next Steps (Optional)

- Add gallery picker (`launchImageLibraryAsync`)
- Add Google OAuth for better deliverability
- Add background sync with `expo-task-manager`
- Add E2E tests (Maestro/Detox)
- Add proper rate limiting (NGINX/Cloudflare)

## License

MIT

