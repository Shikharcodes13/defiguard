import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initializeWeb3();
  }, []);

  const initializeWeb3 = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        const provider = window.ethereum;
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
        
        // Check current network
        const chainId = await provider.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);
        
        // Check if already connected
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await updateBalance(accounts[0], web3Instance);
        }

        // Listen for account changes
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleChainChanged);
      } else {
        setError('Please install MetaMask to use this wallet!');
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
      setError('Failed to initialize Web3: ' + error.message);
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected
      setAccount('');
      setIsConnected(false);
      setBalance('0');
    } else {
      // User switched accounts
      setAccount(accounts[0]);
      await updateBalance(accounts[0], web3);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        
        // Check and switch to Sepolia if needed
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log('Current chain ID:', chainId);
        
        // Sepolia chain ID is 0xaa36a7 (11155111 in decimal)
        if (chainId !== '0xaa36a7') {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }],
            });
          } catch (switchError) {
            // If Sepolia is not added, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'Sepolia ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }]
              });
            }
          }
        }
        
        await updateBalance(accounts[0], web3);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async (accountAddress, web3Instance) => {
    try {
      console.log('Updating balance for address:', accountAddress);
      const balanceWei = await web3Instance.eth.getBalance(accountAddress);
      console.log('Balance in Wei:', balanceWei);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      console.log('Balance in ETH:', balanceEth);
      setBalance(parseFloat(balanceEth).toFixed(4));
    } catch (error) {
      console.error('Error updating balance:', error);
      setError('Failed to update balance: ' + error.message);
    }
  };

  const sendTransaction = async (recipient, amount) => {
    if (!web3 || !account) {
      throw new Error('Wallet not connected');
    }

    if (!web3.utils.isAddress(recipient)) {
      throw new Error('Invalid recipient address');
    }

    const amountWei = web3.utils.toWei(amount, 'ether');
    
    const transaction = {
      from: account,
      to: recipient,
      value: amountWei
    };

    const result = await web3.eth.sendTransaction(transaction);
    
    // Update balance after transaction
    await updateBalance(account, web3);
    
    return result;
  };

  const value = {
    web3,
    account,
    balance,
    isConnected,
    loading,
    error,
    connectWallet,
    sendTransaction,
    updateBalance: () => updateBalance(account, web3)
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
