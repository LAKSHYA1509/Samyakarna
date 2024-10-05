from flask import Flask, render_template
from flask import request, jsonify
import requests;

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('track.html')
@app.route('/buri')
def buri():
    return render_template('buri.html')


@app.route('/check_blacklist', methods=['POST'])
def check_blacklist():
    wallet_address = request.form['wallet_address']
    chain_id = 1
    
    url = 'https://aml.blocksec.com/address-compliance/api/v3/risk-score'
    headers = {
        'API-KEY': '3bc48284b7661dd88ba66f14137c00dc5446f46937822a8c0b0a3c4c6eb5824c',
        'Content-Type': 'application/json'
    }
    payload = {
        'chain_id': chain_id,
        'address': wallet_address,
        'interaction_risk': True
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        risk_score = data.get('data', {}).get('risk_score', 'N/A')
        risk_indicators = data.get('data', {}).get('risk_indicators', [])
        
        return jsonify({
            'status': 'success',
            'risk_score': risk_score,
            'risk_indicators': risk_indicators
        })
    
    except requests.RequestException as e:
        print(f"Error checking blacklist status: {e}")
        return jsonify({'status': 'error', 'message': 'Error checking blacklist status.'}), 500


if __name__ == '__main__':
    app.run(debug=True)