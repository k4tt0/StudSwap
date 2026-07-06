# StudSwap

StudSwap is a mobile marketplace app for students to buy, sell, donate, and exchange items (books, electronics, equipment, notes, etc.) within their university community.

The project consists of two parts:

- **`licenta_var1/studswap_app`** — the mobile client, built with React Native / Expo.
- **`licenta_var1/studswap_server`** — the backend API, built with Node.js / Express.

## Repository

Full source code (excluding compiled binaries and dependencies) is available publicly at:

**https://github.com/k4tt0/StudSwap**

## Project structure

```
StudSwap/
└── licenta_var1/
    ├── studswap_app/      # React Native (Expo) mobile app
    └── studswap_server/   # Node.js/Express backend API
```

## Application build steps

Prerequisites: [Node.js](https://nodejs.org/) LTS and npm.

```bash
git clone https://github.com/k4tt0/StudSwap.git
cd StudSwap/licenta_var1/studswap_app
npm install
```

Run the app locally with Expo:

```bash
npx expo start
```

Then either:
- Scan the QR code with the **Expo Go** app on a physical device (phone and computer must be on the same Wi-Fi network), or
- Press `a` to launch on a connected Android emulator, or `i` for an iOS simulator (macOS only).

## Application installation and launch steps

The backend runs locally alongside the app.

```bash
cd StudSwap/licenta_var1/studswap_server
npm install
npm start          # or: npm run dev (auto-restarts on file changes)
```

By default, the server starts on `http://localhost:5000`.
