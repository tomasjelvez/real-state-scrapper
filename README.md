# Portal Inmobiliario Scraper

A web application that helps users search and track real estate properties from Portal Inmobiliario.

## Features

- 🔍 Real-time property search with location autocomplete
- 🏠 Support for different property types and operations
- 📊 Daily search reports via email
- 🔐 User authentication and search history
- 🤖 Automated web scraping with Puppeteer

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- Material-UI
- TypeScript
- NextAuth.js for authentication

### Backend

- Next.js API Routes
- PostgreSQL with Prisma ORM
- NodeMailer for email reports

### Scraping Service

- Express.js
- Puppeteer
- Docker containerization

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and shared code
│   └── types/           # TypeScript type definitions
│
├── scraping-service/    # Separate service for web scraping
│   ├── src/
│   │   ├── scrapers/    # Puppeteer scraping logic
│   │   └── index.ts     # Express server
│   └── Dockerfile       # Container configuration
│
└── prisma/             # Database schema and migrations
```

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
# Install frontend dependencies
npm install

# Install scraping service dependencies
cd scraping-service && npm install
```

3. Set up environment variables

```bash
# Frontend (.env)
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
REPORT_EMAIL=
SCRAPING_SERVICE_URL=

# Scraping service (.env)
PORT=
FRONTEND_URL=
```

4. Start the development servers

```bash
# Frontend
npm run dev

# Scraping service
cd scraping-service && npm run dev
```

## Usage

1. **Authentication**: Users must log in to use the search functionality
2. **Property Search**:
   - Select operation type (sale, rent, temporary)
   - Choose property type
   - Type location and wait for suggestions to appear
   - Select from suggestions
   - Click search to view results
3. **Search History**: All searches are logged for daily reports

## Deployment

### Frontend (Vercel)

- Configure environment variables
- Connect repository
- Deploy

### Scraping Service (Docker & Render)

```bash
cd scraping-service
docker build -t scraping-service .
docker run -p 3001:3001 --env-file .env scraping-service
```

## Important Notes

- Location search requires selecting from the autocomplete suggestions
- Daily reports are sent via email at 17:00 (server time)
- If you mark a property as favorite, you can check that it is still marked as favorite if you search the location again.
- You can trigger the daily report mail everytime on [this endpoint](https://real-state-scrapper-liard.vercel.app/)
