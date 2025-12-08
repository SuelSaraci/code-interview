# CodeInterview - Interview Prep Hub

A comprehensive platform for practicing coding interview questions, improving your skills, and landing your dream job.

## Features

- 200+ coding interview questions across multiple languages and difficulty levels
- Practice mode with real-time feedback
- Progress tracking and analytics
- Premium subscription with unlimited access
- User authentication and personalized dashboard

## Development

### Prerequisites

- Node.js 18+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (optional for development):
```env
VITE_API_URL=http://localhost:5001
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Production Build

### Build for Production

```bash
npm run build
```

This will create an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Environment Variables

For production, set the following environment variables:

- `VITE_API_URL` - Your production API URL (defaults to `http://localhost:5001` for development)

### Deployment

The `dist` folder contains the production-ready static files that can be deployed to any static hosting service:

- **Vercel**: Connect your repository and deploy
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **AWS S3 + CloudFront**: Upload `dist` contents to S3 bucket
- **GitHub Pages**: Deploy the `dist` folder

### Production Checklist

- [x] Meta tags and SEO optimization
- [x] Favicon and app icons
- [x] Environment variable configuration
- [x] Production build optimization
- [x] State cleanup on logout/login
- [x] Code minification and tree-shaking

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # API service layer
├── state/          # Recoil state management
├── utils/          # Utility functions
└── types/          # TypeScript type definitions
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Recoil** - State management
- **Firebase** - Authentication
- **Tailwind CSS** - Styling
- **React Router** - Routing
