import React from 'react';
import { useWallet } from '../../context/WalletContext';
import './index.css';

const WalletStatus = () => {
  const { isConnected, account, balance, connectWallet, loading } = useWallet();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="wallet-status">
        <button 
          className="wallet-connect-btn"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-status">
      <div className="wallet-info">
        <span className="wallet-address">{formatAddress(account)}</span>
        <span className="wallet-balance">{balance} ETH</span>
      </div>
    </div>
  );
};

export default WalletStatus;

