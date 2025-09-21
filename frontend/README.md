# Crypto Rarity Check

A modern React application for tracking Bitcoin physical coin collections by monitoring their blockchain addresses.

## Features

- **Real-time Balance Monitoring**: Track Bitcoin addresses associated with physical coins
- **Multiple Coin Collections**: Support for various coin series (2021 Set 1, Lost Coin Series v1/v2, VIBGYOR Orange)
- **Status Tracking**: Monitor coin status (Never Loaded, Never Redeemed, Partially Redeemed, Fully Redeemed)
- **Modern UI**: Responsive design with beautiful styling
- **Blockchain Integration**: Uses both Blockchain.info and Mempool.space APIs for reliable data

## Coin Collections

### 2021 Set 1
- 75 standard silver coins
- First collection of Bitcoin physical coins

### Lost Coin Series v1
- 100 silver coins with hole design
- 200 zinc alloy coins
- Total: 300 coins

### Lost Coin Series v2
- 100 gilded silver coins
- 200 zinc alloy coins
- 200 five-ounce gilded silver coins
- 200 error silver coins
- Total: 600 coins

### VIBGYOR Orange
- 100 gilded coins
- 100 silver coins
- Total: 200 coins

### VIBGYOR Orange (Compromised)
- 100 compromised gilded coins
- 100 compromised silver coins
- Total: 200 coins

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Modern CSS** with responsive design
- **Blockchain APIs** for real-time data

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Data Structure

The app uses a JSON configuration file (`src/data/coin-data.json`) that defines:
- Coin set metadata
- Coin types and materials
- Address file mappings
- Blockchain API endpoints
- Status type definitions

## Blockchain Integration

The app fetches real-time balance data from:
1. **Primary**: Blockchain.info API (bulk address lookup)
2. **Fallback**: Mempool.space API (individual address lookup)

## Status Types

- **Never Loaded** (Black): Address has never received Bitcoin
- **Never Redeemed** (Green): Bitcoin received but never spent
- **Partially Redeemed** (Orange): Some Bitcoin has been spent
- **Fully Redeemed** (Red): All Bitcoin has been spent
- **Error** (Red): Unable to fetch balance information

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## License

This project is for educational and demonstration purposes.
