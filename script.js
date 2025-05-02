if (annyang) {
    const command = {
        'hello': () => alert('Hello World!'),
        'change the color to *color': (color) => {
            document.body.style.backgroundColor = color;
            alert(`Changed the background color to ${color}`);
        }, 
        'navigate to *page': (page) => {
            const lower = page.toLowerCase();
            if (lower.includes('home')) location.href = 'Home_page.html';
            if (lower.includes('stocks')) location.href = 'Stocks_page.html';
            if (lower.includes('dogs')) location.href = 'Dog_page.html';
        }
    };
    annyang.addCommands(command);
}