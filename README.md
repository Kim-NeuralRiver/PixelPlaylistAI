# PixelPlaylistAI 🎮

**AI-Powered Game Recommendation Playlists**

Get personalised game recommendations based on your platform, genre, and budget preferences. Discover new games with AI-generated, spoiler-free, summaries and links to the best deals on the internet.

## 🌐 Live Demo

**Production:** [https://pixelplaylistai.vercel.app](https://pixelplaylistai.vercel.app)

---

## ✨ Features

- **Personalised Recommendations** - Get game suggestions based on your preferences
- **AI-Powered Summaries** - Spoiler-free game descriptions generated by AI
- **Best Deals** - Find the lowest prices across multiple stores
- **Save Playlists** - Create and save your favorite game collections
- **Multi-language Support** - Available in English and Ukrainian (more coming soon!)
- **Responsive Design** - Works perfectly on desktop and mobile

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** - v20.11.0 or higher ([Installation Guide](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs))
- **npm** - Comes bundled with Node.js

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kim-NeuralRiver/PixelPlaylistAI.git
   cd PixelPlaylistAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Fill in your environment variables in the new .env file.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running! Note: [Backend functions](https://github.com/Kim-NeuralRiver/pixelplaylist-backend) won't work unless you have the backend running locally too. (Note: if backend main branch isn't up-to-date, check for development branches!) 

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (from Django backend)
- **Database:** PostgreSQL hosted through NeonDB
- **Authentication:** JWT Auth
- **Internationalisation:** react-i18next
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```
src/
├── app/[locale]/           # Internationalised pages
│   ├── playlists/         # User playlists page
│   └── recommendations/   # Game recommendations page
├── components/            # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
└── utils/                # Helper functions and API utilities
locales/                  # Translation files (en, uk)
public/                   # Static assets
```

---

## 🔧 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run format    # Check code formatting
npm run test      # Run tests
```

---

## 🌍 Internationalisation

The project supports multiple languages:
- en English
- 🇺k Ukrainian

Translation files are located in the locales directory.

---

## 📖 Documentation

- **TBC** 

---

## 🚀 Deployment

The project is automatically deployed to Vercel on:
- **Production:** Pushes to `development-branch` branch, soon to be moved to `development-branch`.
- **Preview:** Pull requests and local / manual deployments

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary to PixelPlaylistAI.

---

**© 2025 PixelPlaylistAI. All rights reserved.**