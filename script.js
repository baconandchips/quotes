const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true; 
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        quoteContainer.hidden = false;
        loader.hidden = true;
    }
}

async function getQuoteFromAPI(counterAcc) {
    let counter = counterAcc;
    if (!counter || typeof counter !== "number") {
        counter = 0;
    }
    showLoadingSpinner();
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();
        if (data.quoteAuthor === '') {
            authorText.innerText = 'Unknown';
        } else {
            authorText.innerText = data.quoteAuthor;
        }
        // Reduce font size for long quotes
        if (data.quoteText.length > 120) {
            // .classList looks at all of that element's CSS classes
            // .classList.add(...) adds a class to the CSS for that element
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }
        quoteText.innerText = data.quoteText;
        // Stop Loader, Show Quote
        removeLoadingSpinner();
    } catch (error) {
        console.log('No quote here! Error message: ', error);
        if (counter < 5) {
            getQuoteFromAPI(++counter); // Try again and get a useable message
        } else {
            quoteText.innerText = `What you are is what you have been. What you'll be is what you do now.`;
            authorText.innerText = `Buddha`;
            removeLoadingSpinner();
            console.log('Tried API too many times. Putting in default quote.');
        }
        
    }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank'); // Open new tab
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuoteFromAPI);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuoteFromAPI();