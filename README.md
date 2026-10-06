# Drag Race Ranking

A web application for creating and managing rankings of queens from different Drag Race franchises and seasons.

The application allows users to rate queens episode by episode and automatically generate rankings based on their scores.

## Features

- Google authentication
- Browse queens by franchise and season
- Rank queens episode by episode
- Automatic season rankings
- Different ranking modes
- Hall of Fame and season winners
- User profiles
- Responsive design
- Queen images
- Export rankings as images
- Administration tools for managing seasons, queens, episodes and rankings
- Support for different Drag Race franchises and **La Más Draga**

## Supported Franchises

The application is designed to work with different Drag Race franchises and competitions, including:

- RuPaul's Drag Race
- RuPaul's Drag Race: All Stars (tournament competition is not implemented yet)
- RuPaul's Drag Race UK
- RuPaul's Drag Race España
- RuPaul's Drag Race México
- RuPaul's Drag Race France
- RuPaul's Drag Race Italia
- RuPaul's Drag Race Down Under
- RuPaul's Drag Race Belgique
- Canada's Drag Race
- Drag Race Philippines
- Drag Race Brasil
- La Más Draga

The database structure allows additional franchises and seasons to be added without changing the application.

## Ranking System

Queens are scored for each episode according to their performance.

### Regular Episodes

For regular episodes, the standard Drag Race scoring system is:

| Result | Points |
|---|---:|
| WIN | 5 |
| TOP 2 | 4.5 |
| HIGH | 4 |
| SAFE | 3 |
| LOW | 2 |
| BTTM | 1 |
| ELIM | 0 |
| N/A | 0 |

### Finals episodes

Final episodes use a separate scoring system depending on the number of finalists without affecting the final score.

| Result | Points |
|---|---:|
| WINNER | 5 |
| TOP 2 | 4 |
| TOP 2/3 | 3.5 |
| TOP 3 | 3 |
| TOP 3/4 | 2.5 |
| TOP 4 | 2 |
| TOP 3/5 | 1.75 |
| TOP 4/5 | 1.5 |
| TOP 5 | 1 |

This allows the application to score finalists according to their final placement while supporting different numbers of finalists.

### La Más Draga Finales

La Más Draga uses a different scoring system for the three challenges featured in its final episode. Each challenge is scored independently but doesn't affect the final score.

| Result | Points |
|---|---:|
| MEJOR | 5 |
| ALTO | 4 |
| PASABLE | 3 |
| BAJO | 2 |
| MAL | 1 |
| MUY MALO | 0 |

The scoring system is stored in the database, allowing different point systems to be used depending on the type of episode and franchise.

### Ranking Modes

The application provides different ways to rank queens:

- **Overall Ranking** — ranks queens based on their average score across all episodes that have been ranked.

- **Number of Episodes** — ranks queens by taking into account both the number of episodes they have been ranked in and their overall performance. This allows queens with more completed episodes to be distinguished from queens with fewer ranked episodes.

- **Last Episode** — ranks queens based only on their score in the latest episode currently ranked for the season. This allows users to compare the queens' performance in the most recent episode they have completed.

### User Rankings

Users can view rankings published by other users, allowing them to compare different opinions and scoring of the same seasons.

Each user can maintain their own rankings independently.

## Technologies

- **Next.js**
- **React**
- **JavaScript**
- **Supabase**
  - PostgreSQL
  - Authentication
  - Storage
- **Vitest**
- **Vercel**

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/)
- npm
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/GonzaloGarciaLabuena/dragracerankingweb.git
cd dragracerankingweb
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the database

The application uses **Supabase PostgreSQL**.

To create your own database, create a new Supabase project and execute the SQL script located at:

```text
database/createTables.sql
```

The script creates the tables and relationships required by the application.

Open your Supabase project, go to the **SQL Editor**, paste the contents of `database/createTables.sql` and execute it.

> Make sure to use a fresh database or check the SQL script before executing it, as it may create or modify database objects.

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the values with the credentials from your Supabase project.

### 5. Configure Google Authentication

The application uses Supabase Authentication with Google.

Configure Google as an authentication provider in your Supabase project and add the appropriate OAuth redirect URLs for your local and deployed environments.

### 6. Run the application

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Testing

The project uses **Vitest** for unit testing.

Run the test suite:

```bash
npm run test:vitest
```

Run the Vitest UI:

```bash
npm run test:ui
```

Run the tests with coverage:

```bash
npm run test:coverage
```

## Live Demo

The application is deployed on Vercel:

**https://dragracerankingweb.vercel.app**

## Project Status

The project is currently under active development.

New features, improvements and additional Drag Race franchises and seasons may be added over time.

## Limitations

This project uses the **Supabase Free Plan** for its database, authentication and storage.

The free tier has resource and storage limits. Since the application stores queen images, storage usage can become a limitation when adding a large number of images.

If you deploy your own instance and some features stop working or uploads fail, check your Supabase project usage and limits first.

## About Me

Hi! I'm **Gonzalo García Labuena**, a Computer Engineering graduate from Zaragoza, Spain.

I made Drag Race Ranking because I wanted to combine two of my interests: **programming and Drag Race**.

What started as a personal idea using Excel turned into a full web application where I could build my own ranking system, manage different franchises and seasons, and eventually allow other users to create and share their own rankings.

It has also been a way for me to learn and experiment with different parts of web development, from databases and authentication to testing and deployment.

The project is continuously evolving as I add new features, improve the ranking system and add new Drag Race franchises and seasons.

And yes, I probably spent more time using my own creation than I strictly needed to.