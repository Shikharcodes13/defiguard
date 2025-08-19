import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import './index.css';

const Wallet = () => {
  const { 
    account, 
    balance, 
    isConnected, 
    loading, 
    error, 
    connectWallet, 
    sendTransaction,
    updateBalance
  } = useWallet();

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
      // Refresh balance after switching
      setTimeout(() => {
        updateBalance();
      }, 1000);
    } catch (switchError) {
      console.error('Error switching to Sepolia:', switchError);
    }
  };
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [txError, setTxError] = useState('');

  const handleSendTransaction = async () => {
    if (!recipient || !amount) {
      setTxError('Please fill in all fields');
      return;
    }

    try {
      setTxError('');
      setSuccess('');

      const result = await sendTransaction(recipient, amount);
      
      setSuccess(`Transaction successful! Hash: ${result.transactionHash}`);
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Error sending transaction:', error);
      setTxError('Failed to send transaction: ' + error.message);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    setSuccess('Address copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h1>DeFiGuard Wallet</h1>
        <p>Secure Ethereum wallet interface</p>
      </div>

      <div className="wallet-content">
        {!isConnected ? (
          <div className="connect-section">
            <div className="connect-card">
              <h2>Connect Your Wallet</h2>
              <p>Connect your MetaMask wallet to start using DeFiGuard</p>
              <button 
                className="connect-btn"
                onClick={connectWallet}
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect MetaMask'}
              </button>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        ) : (
          <div className="wallet-dashboard">
            <div className="wallet-info">
                             <div className="info-card">
                 <h3>Wallet Address</h3>
                 <div className="address-container">
                   <span className="address">{account}</span>
                   <button className="copy-btn" onClick={copyAddress}>
                     Copy
                   </button>
                 </div>
                 <div className="network-indicator">
                   
                   <button className="switch-network-btn" onClick={switchToSepolia}>
                     Switch to Sepolia
                   </button>
                 </div>
               </div>
              
                             <div className="info-card">
                 <h3>Balance</h3>
                 <div className="balance">
                   <span className="balance-amount">{balance}</span>
                   <span className="balance-unit">ETH</span>
                   <button className="refresh-btn" onClick={updateBalance}>
                     🔄
                   </button>
                 </div>
               </div>
            </div>

                         <div className="transaction-section">
               <div className="transaction-card">
                 <h3>Send ETH</h3>
                 <div className="testnet-notice">
                   <p><strong>💡 Tip:</strong> For testing, switch to Sepolia testnet in MetaMask and get free test ETH from <a href="https://sepoliafaucet.com" target="_blank" rel="noopener">sepoliafaucet.com</a></p>
                 </div>
                <div className="form-group">
                  <label>Recipient Address:</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Amount (ETH):</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    step="0.001"
                    min="0"
                    className="form-input"
                  />
                </div>
                
                <button 
                  className="send-btn"
                  onClick={handleSendTransaction}
                  disabled={loading || !recipient || !amount}
                >
                  {loading ? 'Sending...' : 'Send Transaction'}
                </button>
              </div>
            </div>

            {(error || txError) && <div className="error-message">{error || txError}</div>}
            {success && <div className="success-message">{success}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
