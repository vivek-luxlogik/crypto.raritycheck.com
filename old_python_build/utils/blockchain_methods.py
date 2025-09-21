import requests
from time import sleep
from enum import Enum

BASE_ADDRESS_PATH = "https://crypto.raritycheck.com/address/"
BASE_BALANCE_PATH = "https://blockchain.info/balance?active="
MEMPOOL_API_BASE = "https://mempool.space/api/address/"

class BalanceStatus(Enum):
    NEVER_REDEEMED = "NeverRedeemed"
    PARTIAL_REDEEMED = "PartialRedeemed"
    FULLY_REDEEMED = "FullyRedeemed"
    NEVER_LOADED = "NeverLoaded"

def get_status(final_balance, total_received):
    if total_received == 0:
        return BalanceStatus.NEVER_LOADED.value, "#000000"  # Black for never loaded
    elif final_balance == total_received:
        return BalanceStatus.NEVER_REDEEMED.value, "#008000"  # Green for never redeemed
    elif final_balance == 0:
        return BalanceStatus.FULLY_REDEEMED.value, "#FF0000"  # Red for fully redeemed
    else:
        return BalanceStatus.PARTIAL_REDEEMED.value, "#FFA500"  # Orange for partially redeemed

def get_balances_from_mempool(address):
    try:
        mempool_url = MEMPOOL_API_BASE + address
        r = requests.get(mempool_url)
        data = r.json()
        
        total_received = data['chain_stats']['funded_txo_sum'] / 100000000.0
        total_spent = data['chain_stats']['spent_txo_sum'] / 100000000.0
        final_balance = total_received - total_spent
        
        status_label, color = get_status(final_balance, total_received)
        
        return {
            "final_balance": final_balance,
            "status": {"label": status_label, "color": color}
        }
    except Exception as e:
        return {"final_balance": 0, "status": {"label": "Error", "color": "#FF0000"}}

def get_balances(addresses):
    balances = {}
    source = 'Blockhain.info'
    try:
        # Attempt to use blockchain.info API with a 500 ms timeout
        balance_url = BASE_BALANCE_PATH
        for address in addresses:
            balance_url += address + "|"
        r = requests.get(balance_url)
        r.raise_for_status()
        response_json = r.json()

        for address in addresses:
            data = response_json[address]
            final_balance = float(data['final_balance']) / 100000000.0
            total_received = float(data['total_received']) / 100000000.0
            status_label, color = get_status(final_balance, total_received)
            balances[address] = {}
            balances[address]["final_balance"]= final_balance
            balances[address]["status"]= {"label": status_label, "color": color}

    except Exception as e:     
        source = 'Mempool'  
        for address in addresses:
            balances[address] = get_balances_from_mempool(address)

    return source,balances
