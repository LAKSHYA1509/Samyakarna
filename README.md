# Samyakaran - A Decentralized Drug Trafficking Tracker

Hamara Sankalp, Logo ki Sahayata iss VISH ko mitane mein


**Samyakaran** is a Web3-based decentralized application designed to track cryptocurrency transactions linked to drug trafficking activities. The tool offers a transparent and interactive way for narcotics control authorities to identify suspicious wallet addresses and their transaction patterns using Ethereum blockchain data.

## Table of Contents
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Core Uses](#core-uses)
- [User Guide](#user-guide)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

1. **Ethereum Wallet Tracking**:
   - Track Ethereum wallet addresses and visualize transaction flows.
   - Display transaction history in a tabular format for easy review.

2. **Blacklist Checker**:
   - Integrated with the ChainAbuse API to check if an Ethereum wallet address is flagged as suspicious.

3. **Interactive Transaction Graph**:
   - Uses D3.js for dynamic visualization of transaction networks, with node and edge interactions, showing transaction amounts and connections.

4. **Transaction Filtering**:
   - Filters transactions based on criteria like amount, date range, etc.
   - Provides alerts for large transactions and supports real-time text-to-speech notifications.

5. **Graph Exporting**:
   - Allows users to export the transaction graph as a PDF for offline analysis.

---

## Technologies Used

### Frontend:
- **HTML, CSS, JavaScript** (D3.js for graph visualization)

### Backend:
- **Flask** (Python-based web framework)

### Blockchain Integration:
- **Web3.js** for Ethereum blockchain interaction

### APIs:
- **Etherscan API** for transaction data
- **ChainAbuse API** for blacklist checking

### Database:
- **SQLite** for storing transaction data and blacklist information

### Additional Libraries:
- **NetworkX** and **Matplotlib** for transaction network analysis
- **Speech Synthesis** for real-time audio alerts
- **jsPDF** for exporting graphs as PDFs

---

## Core Uses

- **Transaction Monitoring**: Track, visualize, and analyze Ethereum transactions for suspicious wallet addresses.
  
- **Blacklist Detection**: Use ChainAbuse API to check if a wallet address is flagged for illegal activities.

- **Real-Time Alerts**: Receive notifications and audio alerts for large or suspicious transactions.

---

## User Guide

1. **Track Wallet Balance**:
   - Enter an Ethereum wallet address to check its ba
   - lance and transaction history.

2. **Visualize Transactions**:
   - Input a wallet address to see a dynamic graph of its transactions, including transaction size and connections.

3. **Filter Transactions**:
   - Apply filters (date range, amount) to focus on specific transactions and visualize them accordingly.

4. **Check Blacklisted Addresses**:
   - Enter a wallet address to verify if it’s flagged as suspicious using the ChainAbuse API.

5. **Export Transaction Graph**:
   - Users can export the visualized transaction graph as a PDF for reporting or offline analysis.

---

## Installation Instructions

### 1. Prerequisites
- Install **Node.js** and **npm** (for frontend dependencies)
- Install **Python** (3.x) and **pip** (for backend dependencies)
- Install **MetaMask** for browser-based Ethereum blockchain interaction

### 2. Clone the Repository
```bash
git clone https://github.com/yourusername/samyakaran.git
```
Navigate into the project directory:
```bash
cd samyakaran
```

### 3. Install Dependencies
#### Frontend:
```bash
npm install
```

#### Backend:
```bash
pip install -r requirements.txt
```

### 4. Environment Setup
Create a `.env` file and add your API keys:
```bash
FLASK_APP=app.py
ETHERSCAN_API_KEY=your_etherscan_api_key
CHAINABUSE_API_KEY=your_chainabuse_api_key
```

### 5. Running the Backend (Flask)
Start the Flask server:
```bash
flask run
```
The Flask server will run at `http://127.0.0.1:5000/`.

### 6. Running the Frontend
In a separate terminal, run the frontend:
```bash
npm start
```

### 7. Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## Usage Instructions

1. **Track Wallet Balance**: Enter a wallet address to retrieve its balance and transaction history.
  
2. **Visualize Transactions**: Input the wallet address to visualize its transactions as a dynamic graph.

3. **Filter Transactions**: Use the filters to customize the transactions displayed based on date or amount.

4. **Check Blacklisted Addresses**: Verify if a wallet address is flagged using the ChainAbuse API.

5. **Export Graph**: Export the transaction graph as a PDF for further analysis or reporting.

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Create a Pull Request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
