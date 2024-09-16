from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('track.html')

@app.route('/visualize', methods=['POST'])
def visualize():
    wallet_address = request.form['wallet_address']

    try:
        # Fetch transactions using Sepolia Etherscan API
        transactions = get_transactions(wallet_address)
        
        if not transactions:
            return 'No transactions found for this wallet.', 400

        # Create a directed graph
        G = nx.DiGraph()

        # Dictionary to store cumulative transaction values per node (wallet)
        wallet_values = {}

        # Add transactions to the graph with more details
        for tx in transactions:
            sender, receiver, amount = tx
            G.add_edge(sender, receiver, weight=amount)
            
            # Cumulative value of transactions per wallet
            if sender in wallet_values:
                wallet_values[sender] += amount
            else:
                wallet_values[sender] = amount

            if receiver in wallet_values:
                wallet_values[receiver] += amount
            else:
                wallet_values[receiver] = amount

        # Layout and plot configuration
        pos = nx.spring_layout(G)
        plt.figure(figsize=(14, 12))

        # Dynamic node sizes based on cumulative transaction values
        node_size = [wallet_values.get(node, 1) * 100 for node in G.nodes()]
        
        # Node colors based on transaction activity (e.g., suspicious wallets)
        node_color = ['#FF5733' if wallet_values.get(node, 0) > 10 else '#33C1FF' for node in G.nodes()]  # Red for higher activity, blue otherwise

        # Draw nodes with custom sizes and colors
        nx.draw_networkx_nodes(G, pos, node_size=node_size, node_color=node_color, alpha=0.8)

        # Draw edges with thickness based on the amount of ETH transferred
        edge_width = [G[u][v]['weight'] * 0.1 for u, v in G.edges()]
        nx.draw_networkx_edges(G, pos, width=edge_width, edge_color="grey", alpha=0.7, arrows=True)

        # Draw labels for nodes (wallet addresses)
        nx.draw_networkx_labels(G, pos, font_size=9, font_color="black", font_weight="bold")

        # Draw edge labels for transaction amounts
        edge_labels = nx.get_edge_attributes(G, 'weight')
        nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)

        plt.title(f'Transaction Flow for Wallet: {wallet_address}', fontsize=15)

        # Save plot to BytesIO
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        return send_file(img, mimetype='image/png')

    except Exception as e:
        print(f"Error visualizing transactions: {e}")
        return 'Error visualizing transactions. Please try again later.', 500

if __name__ == '__main__':
    app.run(debug=True)
