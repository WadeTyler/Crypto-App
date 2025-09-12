# Crypto App
A simple cryptocurrency tracking application built with React, and Spring Boot. This app allows users to view the latest prices and market data for various cryptocurrencies.  

Production Url: [https://crypto.tylerwade.net](https://crypto.tylerwade.net)

## Features
- View real-time prices of popular cryptocurrencies
- Search for specific cryptocurrencies
- Responsive design for mobile and desktop
- Backend API built with Spring Boot
- Data fetched from a public cryptocurrency API
- Error handling and loading states

## Tech Stack
- Frontend: TypeScript, React, Tailwind CSS
- Backend: Java, Spring Boot
- Database: PostgreSQL
- API: CoinGecko API
- Version Control: Git, GitHub
- Deployment: Docker, VPS

## Getting Started




### Running the Application
1. Clone the repository:
```bash
git clone https://github.com/WadeTyler/Crypto-App.git
```

2. Navigate to the project directory:
```bash
cd Crypto-App
```

3. Create a `.env` file in the root directory and add the following environment variables:
```
# App Environment Variables
APP_ENV=
FRONTED_URL=

# JWT Values
JWT_SECRET=

# Database Config
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_PORT=
DB_URL=

# CoinGecko API Config
COIN_GECKO_API_KEY=
COIN_GECKO_API_URL=

# AWS Config
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

# SQS Config
MAIL_QUEUE_URL=
SERVICE_EMAIL=
``` 

4. Next place a '.env' file in the frontend directory and add the following environment variables:
```
VITE_BASE_API_URL=
```

5. Start the services with docker compose:
```bash
docker compose up --build -d
```