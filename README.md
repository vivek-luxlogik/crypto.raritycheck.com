# Crypto Rarity Check

A modern web application for tracking Bitcoin physical coin collections by monitoring their blockchain addresses.

## Overview

This project tracks the rarity and status of Bitcoin physical coins by monitoring their associated blockchain addresses. It provides real-time information about whether coins have been loaded with Bitcoin, partially redeemed, or fully spent.

## Project Structure

- `frontend/` - Modern React application (TypeScript)
- `old_python_build/` - Original Python Flask application
- `scripts/` - Deployment and utility scripts

## Features

- **Real-time Balance Monitoring**: Track Bitcoin addresses associated with physical coins
- **Multiple Coin Collections**: Support for various coin series
- **Status Tracking**: Monitor coin status with color-coded indicators
- **Modern UI**: Responsive design with beautiful styling
- **Blockchain Integration**: Uses multiple APIs for reliable data

## Quick Start

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Coin Collections

The application tracks several Bitcoin physical coin collections:

- **2021 Set 1**: 75 standard silver coins
- **Lost Coin Series v1**: 300 coins (100 silver + 200 zinc alloy)
- **Lost Coin Series v2**: 600 coins (multiple variants)
- **VIBGYOR Orange**: 200 coins (gilded + silver)
- **VIBGYOR Orange (Compromised)**: 200 compromised coins

## Technology Stack

- **Frontend**: React 18, TypeScript, React Router
- **Styling**: Modern CSS with responsive design
- **APIs**: Blockchain.info, Mempool.space
- **Build Tool**: Vite

## Status Types

- **Never Loaded** (Black): Address has never received Bitcoin
- **Never Redeemed** (Green): Bitcoin received but never spent
- **Partially Redeemed** (Orange): Some Bitcoin has been spent
- **Fully Redeemed** (Red): All Bitcoin has been spent
- **Error** (Red): Unable to fetch balance information

## Deployment

The frontend can be built for production:

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Legacy Python Version

The original Python Flask application is preserved in the `old_python_build/` directory for reference. The new React version provides the same functionality with a modern, responsive interface.