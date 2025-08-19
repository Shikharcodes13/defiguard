# DeFiGuard Wallet Interface

A modern Ethereum wallet interface built with React and Web3.js that allows users to send and receive ETH.

## Features

- 🔗 **MetaMask Integration**: Seamless connection with MetaMask wallet
- 💰 **Balance Display**: Real-time ETH balance updates
- 📤 **Send Transactions**: Send ETH to any Ethereum address
- 📋 **Address Copy**: Easy wallet address copying
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Auto-refresh**: Automatically updates balance after transactions
- ⚡ **Real-time Updates**: Listens for account and chain changes

## Prerequisites

- MetaMask browser extension installed
- An Ethereum account with some ETH (for testing, you can use testnets)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## How to Use

### Connecting Your Wallet

1. Click on the "Wallet" link in the navigation menu
2. Click "Connect MetaMask" button
3. Approve the connection in MetaMask popup
4. Your wallet address and balance will be displayed

### Sending ETH

1. Make sure your wallet is connected
2. Enter the recipient's Ethereum address in the "Recipient Address" field
3. Enter the amount of ETH you want to send
4. Click "Send Transaction"
5. Confirm the transaction in MetaMask
6. Wait for the transaction to be confirmed on the blockchain

### Features

- **Address Validation**: Automatically validates Ethereum addresses
- **Transaction History**: Shows transaction hash after successful sends
- **Error Handling**: Clear error messages for failed transactions
- **Loading States**: Visual feedback during transactions
- **Balance Updates**: Automatic balance refresh after transactions

## Security Features

- **Address Validation**: Ensures valid Ethereum addresses before sending
- **MetaMask Integration**: Uses MetaMask's secure transaction signing
- **No Private Key Storage**: Private keys remain in MetaMask
- **Transaction Confirmation**: Requires user confirmation for all transactions

## Supported Networks

- Ethereum Mainnet
- Ethereum Testnets (Goerli, Sepolia)
- Any EVM-compatible network that MetaMask supports

## Troubleshooting

### Common Issues

1. **"Please install MetaMask" error**
   - Install MetaMask browser extension
   - Refresh the page

2. **"Failed to connect wallet" error**
   - Make sure MetaMask is unlocked
   - Check if you have any accounts in MetaMask

3. **"Insufficient funds" error**
   - Ensure you have enough ETH for the transaction + gas fees
   - Consider using a testnet for testing

4. **"Invalid recipient address" error**
   - Double-check the Ethereum address format
   - Ensure the address starts with "0x" and is 42 characters long

### Gas Fees

- Gas fees are automatically calculated by MetaMask
- Gas fees vary based on network congestion
- You can adjust gas fees in MetaMask settings

## Development

### Project Structure

```
src/
├── components/
│   ├── wallet-status/     # Wallet status component for header
│   └── header/           # Navigation header
├── context/
│   └── WalletContext.js  # Wallet state management
├── pages/
│   └── wallet/          # Main wallet interface
└── App.js               # Main app component
```

### Key Components

- **WalletContext**: Manages wallet state and Web3 connection
- **Wallet Page**: Main wallet interface with send/receive functionality
- **WalletStatus**: Shows connection status in the header

### Adding New Features

1. **Token Support**: Add ERC-20 token sending functionality
2. **Transaction History**: Display past transactions
3. **Multiple Networks**: Support for different blockchain networks
4. **QR Code**: Generate QR codes for wallet addresses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

