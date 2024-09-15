from flask import Flask, render_template, request, send_file
import networkx as nx
import matplotlib.pyplot as plt
import io
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('track.html')

@app.route('/track', methods=['POST'])
def track():
    wallet_address = request.form['wallet_address']
    
    if not web3.isAddress(wallet_address):
        return 'Invalid Ethereum address!', 400
    
    try:
        balance = web3.eth.get_balance(wallet_address)
        balance_eth = Web3.fromWei(balance, 'ether')
        return f'Balance of {wallet_address}: {balance_eth} ETH'
    except Exception as e:
        print(f"Error fetching balance: {e}")
        return 'Error fetching balance. Please try again later.', 500

@app.route('/visualize')
def visualize():
    # Example transactions
    transactions = [
        ('0xAddress1', '0xAddress2', 1.5),
        ('0xAddress2', '0xAddress3', 0.5),
        ('0xAddress1', '0xAddress3', 2.0),
        ('0xAddress3', '0xAddress4', 0.75)
    ]
    
    G = nx.DiGraph()

    for tx in transactions:
        sender, receiver, amount = tx
        G.add_edge(sender, receiver, weight=amount)
    
    pos = nx.spring_layout(G)
    
    plt.figure(figsize=(12, 10))
    nx.draw(G, pos, with_labels=True, node_size=3000, node_color="skyblue", font_size=12, font_weight="bold", arrows=True)
    edge_labels = nx.get_edge_attributes(G, 'weight')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)
    plt.title('Transaction Flow Visualization')

    # Save to a BytesIO object
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    
    return send_file(img, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
