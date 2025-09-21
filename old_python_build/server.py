import os
from collections import defaultdict
from flask import Flask, render_template, request, jsonify, redirect
from flask import send_from_directory
from utils import blockchain_methods as BM

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)

def readAddressFile(data_file, max_coins):
    addresses = []
    serial_nums = []
    with open(data_file, "r") as file:
        coin_number = 0
        for line in file.readlines():
            if coin_number < max_coins:
                serial_num,address = line.rstrip().split(",")
                addresses.append(address) 
                serial_nums.append(serial_num)
                coin_number += 1
            else:
                break
    return serial_nums,addresses

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')
    
@app.route("/")
def home():
    return render_template("./index.html")
  
@app.route("/vigilante-2021")
def vigilante_2021():
    try:
        # Read both address files
        gilded_serial_nums, gilded_addresses = readAddressFile(os.path.join(basedir, 'data/2021_set_1_gilded_silver_addresses.txt'), 25)
        silver_serial_nums, silver_addresses = readAddressFile(os.path.join(basedir, 'data/2021_set_1_silver_addresses.txt'), 75)
        
        gilded_balances = defaultdict(lambda: {"final_balance": 0, "status": "Unknown", "color": "black"})
        silver_balances = defaultdict(lambda: {"final_balance": 0, "status": "Unknown", "color": "black"})
        
        source1, gilded_balances = BM.get_balances(gilded_addresses)
        source2, silver_balances = BM.get_balances(silver_addresses)
        
        return render_template("vigilante_2021.html", \
            source1=source1, \
            source2=source2, \
            gilded_addresses=gilded_addresses,\
            gilded_serial_nums=gilded_serial_nums,\
            gilded_balances=gilded_balances,\
            silver_addresses=silver_addresses,\
            silver_serial_nums=silver_serial_nums,\
            silver_balances=silver_balances,\
            com_blockchain_base_address=BM.BASE_ADDRESS_PATH)
    except Exception as e:
        error_message = f"Error fetching balances: {str(e)}"
        return render_template("error.html", error_message=error_message)

@app.route("/lcs-v1")
def lcs_v1():
    try:
        # Read address files
        silver_serial_nums, silver_addresses = readAddressFile(os.path.join(basedir, 'data/lcs_v1_silver_addresses.txt'), 100)
        zinc_serial_nums, zinc_addresses = readAddressFile(os.path.join(basedir, 'data/lcs_v1_zinc_addresses.txt'), 200)
 
        silver_balances = defaultdict(lambda: {"final_balance": 0, "status": "Unknown", "color": "black"})
        zinc_balances = defaultdict(lambda: {"final_balance": 0, "status": "Unknown", "color": "black"})

        source1, silver_balances = BM.get_balances(silver_addresses)
        source2, zinc_balances = BM.get_balances(zinc_addresses)
        return render_template("lcs_v1.html", \
            source1=source1, \
            source2=source2, \
            silver_addresses=silver_addresses,\
            silver_serial_nums=silver_serial_nums,\
            silver_balances=silver_balances,\
            zinc_addresses=zinc_addresses,\
            zinc_serial_nums=zinc_serial_nums,\
            zinc_balances=zinc_balances,\
            com_blockchain_base_address=BM.BASE_ADDRESS_PATH)
    except Exception as e:
        error_message = f"Error fetching balances: {str(e)}"
        return render_template("error.html", error_message=error_message)

@app.route("/lcs-v2")
def lcs_v2():
    try:
        # Read address files
        silver_serial_nums, silver_addresses = readAddressFile(os.path.join(basedir, 'data/lcs_v2_gilded_silver_addresses.txt'), 100)
        zinc_serial_nums, zinc_addresses = readAddressFile(os.path.join(basedir, 'data/lcs_v2_zinc_addresses.txt'), 200)
        five_oz_serial_nums, five_oz_addresses = readAddressFile(os.path.join(basedir, 'data/lcs_v2_5_Oz_gilded_silver_addresses.txt'), 200)
        error_serial_nums, error_addresses = readAddressFile(os.path.join(basedir, 'data/lcs_v2_error_silver_addresses.txt'), 200)
 
 
        silver_balances = defaultdict(lambda: {"final_balance": 0, "status": "Unknown", "color": "black"})
        zinc_balances = defaultdict(lambda: {"final_balance": 0, "status": "Unknown", "color": "black"})

        source1, silver_balances = BM.get_balances(silver_addresses)
        source2, zinc_balances = BM.get_balances(zinc_addresses)
        source3, five_oz_balances = BM.get_balances(five_oz_addresses)
        source4, error_balances = BM.get_balances(error_addresses) 
        return render_template("lcs_v2.html", \
            source1=source1, \
            source2=source2, \
            silver_addresses=silver_addresses,\
            silver_serial_nums=silver_serial_nums,\
            silver_balances=silver_balances,\
            zinc_addresses=zinc_addresses,\
            zinc_serial_nums=zinc_serial_nums,\
            zinc_balances=zinc_balances,\
            five_oz_addresses=five_oz_addresses,\
            five_oz_serial_nums=five_oz_serial_nums,\
            five_oz_balances=five_oz_balances,\
            error_addresses=error_addresses,\
            error_serial_nums=error_serial_nums,\
            error_balances=error_balances,\
            com_blockchain_base_address=BM.BASE_ADDRESS_PATH)
    except Exception as e:
        error_message = f"Error fetching balances: {str(e)}"
        return render_template("error.html", error_message=error_message)


@app.route("/vibgyor-orange")
def vibgyor_orange():
    gilded_serial_nums, gilded_addresses = readAddressFile(os.path.join(basedir, 'data/vigyor_orange_gilded_addresses.txt'), 100)
    silver_serial_nums, silver_addresses = readAddressFile(os.path.join(basedir, 'data/vigyor_orange_silver_addresses.txt'), 100)
    silver_balances = {}
    silver_balances = defaultdict(lambda:0, silver_balances)
    gilded_balances = {}
    gilded_balances = defaultdict(lambda:0, gilded_balances)
    try:
        source1, gilded_balances = BM.get_balances(gilded_addresses)
        source2, silver_balances = BM.get_balances(silver_addresses)
        return render_template("vibgyor-orange.html",\
            source1=source1, \
            source2=source2, \
            silver_addresses=silver_addresses,\
            silver_serial_nums=silver_serial_nums,\
            silver_balances=silver_balances,\
            gilded_addresses=gilded_addresses,\
            gilded_serial_nums=gilded_serial_nums,\
            gilded_balances=gilded_balances,\
            com_blockchain_base_address=BM.BASE_ADDRESS_PATH)
    except Exception as e:
        error_message = f"Error fetching balances: {str(e)}, \
                            gilded:{str(gilded_balances)}, \
                            silver: {str(silver_balances)}"
        return render_template("error.html", error_message=error_message)

@app.route("/vibgyor-orange-compromised")
def vibgyor_orange_compromised():
    gilded_serial_nums, gilded_addresses = readAddressFile(os.path.join(basedir, 'data/compromised_vigyor_orange_gilded_addresses.txt'), 100)
    silver_serial_nums, silver_addresses = readAddressFile(os.path.join(basedir, 'data/compromised_vigyor_orange_silver_addresses.txt'), 100)
    silver_balances = {}
    silver_balances = defaultdict(lambda:0, silver_balances)
    gilded_balances = {}
    gilded_balances = defaultdict(lambda:0, gilded_balances)
    try:
        source1, gilded_balances = BM.get_balances(gilded_addresses)
        source2, silver_balances = BM.get_balances(silver_addresses)
        return render_template("vibgyor-orange-compromised.html",\
            source1=source1, \
            source2=source2, \
            silver_addresses=silver_addresses,\
            silver_serial_nums=silver_serial_nums,\
            silver_balances=silver_balances,\
            gilded_addresses=gilded_addresses,\
            gilded_serial_nums=gilded_serial_nums,\
            gilded_balances=gilded_balances,\
            com_blockchain_base_address=BM.BASE_ADDRESS_PATH)
    except Exception as e:
        error_message = f"Error fetching balances: {str(e)}, \
                            gilded:{str(/19vkiEajfhuZ8bs8Zu2jgmC6oqZbWqhxhGgilded_balances)}, \
                            silver: {str(silver_balances)}"
        return render_template("error.html", error_message=error_message)

@app.route('/address/<btc_address>')
def redirect_to_bc(btc_address):
    new_url = f'https://www.blockchain.com/explorer/addresses/btc/{btc_address}'
    return redirect(new_url, code=302)  # Use 302 for temporary redirect, 301 for permanent

@app.route('/vibgyor')
def redirect_to_bc(btc_address):
    new_url = f'https://crypto.raritycheck.com/vibgyor-orange'
    return redirect(new_url, code=301)  # Use 302 for temporary redirect, 301 for permanent

if __name__ == "__main__": 
    app.run(debug=True)