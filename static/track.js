let web3;

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
            console.log('Web3 initialized');
        })
        .catch(error => {
            console.error('User denied account access:', error);
            alert('Please allow access to your Ethereum account.');
        });
} else {
    alert('Please install MetaMask!');
}

function trackWallet() {
    const address = document.getElementById('wallet_address').value;

    if (web3 && web3.utils.isAddress(address)) {
        web3.eth.getBalance(address)
            .then(balance => {
                const balanceEth = web3.utils.fromWei(balance, 'ether');
                document.getElementById('result').innerText = `Balance of ${address}: ${balanceEth} ETH`;
            })
            .catch(error => {
                document.getElementById('result').innerText = 'Error fetching balance.';
                console.error(error);
            });
    } else {
        document.getElementById('result').innerText = 'Invalid Ethereum address or Web3 not initialized!';
    }
}
function visualizeTransactions(includeFilters = true) {
    const address = document.getElementById('wallet_address').value;
    if (!web3.utils.isAddress(address)) {
        alert('Invalid Ethereum address');
        return;
    }

    const etherscanApiKey = 'NMJBX9W6W49S8CP32XP1X8INE3TDXCJ7C9'; // Replace with your Sepolia API key
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${etherscanApiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === '1') {
                const transactions = data.result
                    .map(tx => ({
                        from: tx.from,
                        to: tx.to,
                        value: parseFloat(web3.utils.fromWei(tx.value, 'ether')),
                        hash: tx.hash,
                        timestamp: parseInt(tx.timeStamp)
                    }));

                drawGraph(transactions);
                updateTransactionTable(transactions);
                sendAlerts(transactions);
            } else {
                alert('No transactions found for this wallet.');
            }
        })
        .catch(error => {
            console.error('Error fetching transactions:', error);
        });
}

function drawGraph(transactions) {
    document.getElementById('graph-container').innerHTML = '';

    const width = 1100;
    const height = 600;

    const svg = d3.select('#graph-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const nodes = {};
    transactions.forEach(tx => {
        nodes[tx.from] = { id: tx.from };
        nodes[tx.to] = { id: tx.to };
    });

    const links = transactions.map(tx => ({
        source: tx.from,
        target: tx.to,
        value: tx.value,
        hash: tx.hash,
        timestamp: tx.timestamp
    }));

    const simulation = d3.forceSimulation(Object.values(nodes))
        .force('link', d3.forceLink(links).id(d => d.id).distance(150))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', '#ffb3b3')
        .attr('stroke-width', d => Math.sqrt(d.value) * 2);

    const node = svg.append('g')
        .selectAll('circle')
        .data(Object.values(nodes))
        .enter()
        .append('circle')
        .attr('r', 8)
        .attr('fill', '#ff5733')
        .call(d3.drag()
            .on('start', dragStarted)
            .on('drag', dragged)
            .on('end', dragEnded));

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background', '#fff')
        .style('border', '1px solid #ccc')
        .style('padding', '5px')
        .style('border-radius', '3px');

    node.append('title')
        .text(d => d.id);

    node.on('mouseenter', function(event, d) {
        d3.select(this).attr('fill', 'orange');
        tooltip.html(`Wallet Address: ${d.id}`)
            .style('visibility', 'visible');
    })
    .on('mousemove', function(event) {
        tooltip.style('top', (event.pageY + 5) + 'px')
            .style('left', (event.pageX + 5) + 'px');
    })
    .on('mouseleave', function() {
        d3.select(this).attr('fill', '#ff5733');
        tooltip.style('visibility', 'hidden');
    });

    link.on('mouseenter', function(event, d) {
        d3.select(this).attr('stroke', 'orange');
        tooltip.html(`Transaction Hash: ${d.hash}<br>Timestamp: ${new Date(d.timestamp * 1000).toLocaleString()}<br>Amount: ${d.value} ETH`)
            .style('visibility', 'visible');
    })
    .on('mousemove', function(event) {
        tooltip.style('top', (event.pageY + 5) + 'px')
            .style('left', (event.pageX + 5) + 'px');
    })
    .on('mouseleave', function() {
        d3.select(this).attr('stroke', 'orange');
        tooltip.style('visibility', 'hidden');
    });

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });

    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function updateTransactionTable(transactions) {
    const tbody = document.getElementById('transaction-table-body');
    tbody.innerHTML = '';

    transactions.sort((a, b) => b.value - a.value);

    transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.from}</td>
            <td>${tx.to}</td>
            <td>${tx.value.toFixed(4)}</td>
        `;
        tbody.appendChild(row);
    });
}


document.getElementById('exportButton').addEventListener('click', () => {
    html2canvas(document.getElementById('graph-container')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('graph.pdf');
    });
});

function flagTransactions(transactions) {
    const threshold = 5;
    const flagged = transactions.filter(tx => tx.value > threshold);
    
    const tableBody = document.getElementById('transaction-table-body');
    tableBody.innerHTML = '';

    flagged.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.from}</td>
            <td>${tx.to}</td>
            <td>${tx.value}</td>
        `;
        row.style.backgroundColor = '#ffdddd';
        tableBody.appendChild(row);
    });
}

const taggedAddresses = {};

function tagAddress() {
    const address = document.getElementById('tag_address').value;
    const label = document.getElementById('tag_label').value;
    
    if (web3.utils.isAddress(address)) {
        taggedAddresses[address] = label;
        alert(`Address tagged: ${address} as ${label}`);
        displayTaggedAddresses();
    } else {
        alert('Invalid address');
    }
}

function displayTaggedAddresses() {
    const taggedList = document.getElementById('tagged-addresses');
    taggedList.innerHTML = '';

    for (const [address, label] of Object.entries(taggedAddresses)) {
        const li = document.createElement('li');
        li.textContent = `${address} - ${label}`;
        taggedList.appendChild(li);
    }
}

function sendAlerts(transactions) {
    const alertThreshold = 5;
    const speechThreshold = 10; // This threshold is for counting transactions for speech
    const walletAddress = ' '; // Replace with actual wallet address

    const highValueTransactions = transactions.filter(tx => tx.value > alertThreshold);

    const speechCountTransactions = transactions.filter(tx => tx.value > speechThreshold);

    highValueTransactions.sort((a, b) => b.value - a.value);

    const topTransactions = highValueTransactions.slice(0, 5);

    topTransactions.forEach(tx => {
        alert(`High-value transaction detected: ${tx.from} -> ${tx.to} (${tx.value} ETH)`);
    });

    if (speechCountTransactions.length > 0) {
        speakScammedAlert(walletAddress, speechCountTransactions.length);
    }
}

function speakScammedAlert(walletAddress, transactionCount) {
    const message = `The following wallet, ${walletAddress}, has been involved in transactions of more than 10 ETH ${transactionCount} times. Check Sadvik for blacklisted wallet check and proceed ahead.`;
    
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US';
    speech.rate = 1;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
}