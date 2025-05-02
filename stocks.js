const apikey ='ut4lrOuxyCCzOOJ7wP_yoCYFmXUW2Puo';

function getStockData() {
    const ticker = document.getElementById('stockInput').value.toUpperCase();
    const days = document.getElementById('daysSelect').value;

    console.log('Ticker:', ticker);
    console.log('Days:', days);

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const from = start.toISOString().split('T')[0];
    const to = end.toISOString().split('T')[0];

    console.log('From:', from, 'To:', to);

    const url = 'https://api.polygon.io/v2/aggs/ticker/' + ticker + '/range/1/day/' + from + '/' + to + '?apiKey=' + apikey;

    console.log('URL:', url);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log('Fetched Data:', data);
            if (data.results) {
                const labels = data.results.map(p => new Date(p.t).toLocaleDateString());
                const values = data.results.map(p => p.c);
                drawChart(labels, values, ticker);
            } else {
                alert('No data found for the given stock symbol.');
            }
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
            alert('Failed to fetch stock data. Please try again.');
        });
}

let stockChartInstance;

function drawChart(labels, values, ticker) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    
    if(stockChartInstance) {
        stockChartInstance.destroy(); // Destroy the previous chart instance if it exists
    }
    
    stockChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [{
                label: `${ticker} Stock Price`,
                data: values,
                fill: false,
                borderColor: 'blue',
                borderWidth: 2,
            }]
        }
    });
}

fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(res => res.json())
    .then(data => {
        const top5 = data.slice(0, 5);
        const tbody = document.getElementById('top5Stocks'); // Updated ID
        top5.forEach(stock => {
            const tr = document.createElement('tr');
            const sentimentIcon = stock.sentiment === 'Bullish' ? '🐂' : '🐻';
            tr.innerHTML = `
                <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
                <td>${stock.no_of_comments}</td>
                <td>${sentimentIcon}</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error('Error fetching top stocks:', error);
        alert('Failed to fetch top stocks. Please try again.');
    });

if (annyang) {
    annyang.addCommands({
        'hello': () => alert('Hello World!'),
        'change the color to *color': (color) => {
            document.body.style.backgroundColor = color;
            alert(`Changed the background color to ${color}`);
        }, 
        'navigate to *page': (page) => {
            const lower = page.toLowerCase();
            if (lower.includes('home')) location.href = 'Home_page.html';
            if (lower.includes('stocks')) location.href = 'Stocks_page.html';
            if (lower.includes('dogs')) location.href = 'Dogs_page.html';
        },
        'look up *stock': (stock) => {
            document.getElementById('stockInput').value = stock.toUpperCase();
            document.getElementById('daysSelect').value = "30";
            getStockData();
        }
    });

    annyang.addCallback('resutNoMatch', () => {
        alert('No command matched. Please try again.');
    })

    if (!annyang.isListening()) {
        annyang.start();
    }
}