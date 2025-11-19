// Crypto donation configuration
export interface CryptoConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  icon: string;
  color: string;
  explorerUrl: string;
}

export const cryptoConfig: Record<string, CryptoConfig> = {
  btc: {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Replace with your actual BTC address
    decimals: 8,
    icon: '₿',
    color: '#f7931a',
    explorerUrl: 'https://blockstream.info/address/'
  },
  eth: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Replace with your actual ETH address
    decimals: 18,
    icon: 'Ξ',
    color: '#627eea',
    explorerUrl: 'https://etherscan.io/address/'
  },
  sol: {
    symbol: 'SOL',
    name: 'Solana',
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Replace with your actual SOL address
    decimals: 9,
    icon: '◎',
    color: '#9945ff',
    explorerUrl: 'https://explorer.solana.com/address/'
  }
};

// Get crypto config by symbol
export const getCryptoConfig = (symbol: string): CryptoConfig | undefined => {
  return cryptoConfig[symbol.toLowerCase()];
};

// Get all available crypto options
export const getAvailableCryptos = (): CryptoConfig[] => {
  return Object.values(cryptoConfig);
};

// Validate crypto address format (basic validation)
export const validateCryptoAddress = (address: string, symbol: string): boolean => {
  const config = getCryptoConfig(symbol);
  if (!config) return false;

  switch (symbol.toLowerCase()) {
    case 'btc':
      // Basic Bitcoin address validation (bech32 and legacy)
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address);
    case 'eth':
      // Ethereum address validation
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case 'sol':
      // Solana address validation (base58)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    default:
      return false;
  }
};
