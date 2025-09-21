import coinData from '../data/coin-data.json';

export interface BalanceData {
  final_balance: number;
  status: {
    label: string;
    color: string;
  };
}

export const getStatus = (finalBalance: number, totalReceived: number): { label: string; color: string } => {
  if (totalReceived === 0) {
    return coinData.statusTypes.neverLoaded;
  } else if (finalBalance === totalReceived) {
    return coinData.statusTypes.neverRedeemed;
  } else if (finalBalance === 0) {
    return coinData.statusTypes.fullyRedeemed;
  } else {
    return coinData.statusTypes.partiallyRedeemed;
  }
};

export const getBalancesFromMempool = async (address: string): Promise<BalanceData> => {
  try {
    const mempoolUrl = `${coinData.blockchainApis.fallback}${address}`;
    const response = await fetch(mempoolUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const totalReceived = data.chain_stats.funded_txo_sum / 100000000.0;
    const totalSpent = data.chain_stats.spent_txo_sum / 100000000.0;
    const finalBalance = totalReceived - totalSpent;
    
    const status = getStatus(finalBalance, totalReceived);
    
    return {
      final_balance: finalBalance,
      status: status
    };
  } catch (error) {
    console.error(`Error fetching balance for ${address}:`, error);
    return {
      final_balance: 0,
      status: coinData.statusTypes.error
    };
  }
};

export const getBalances = async (addresses: string[]): Promise<[string, Record<string, BalanceData>]> => {
  const balances: Record<string, BalanceData> = {};
  let source = 'Blockchain.info';
  
  try {
    // Try blockchain.info API first
    const balanceUrl = `${coinData.blockchainApis.primary}${addresses.join('|')}`;
    const response = await fetch(balanceUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseJson = await response.json();
    
    for (const address of addresses) {
      const data = responseJson[address];
      if (data) {
        const finalBalance = parseFloat(data.final_balance) / 100000000.0;
        const totalReceived = parseFloat(data.total_received) / 100000000.0;
        const status = getStatus(finalBalance, totalReceived);
        
        balances[address] = {
          final_balance: finalBalance,
          status: status
        };
      }
    }
  } catch (error) {
    console.error('Blockchain.info API failed, falling back to Mempool:', error);
    source = 'Mempool';
    
    // Fallback to Mempool API
    for (const address of addresses) {
      balances[address] = await getBalancesFromMempool(address);
    }
  }
  
  return [source, balances];
};
