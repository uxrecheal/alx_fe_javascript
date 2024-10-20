// Create quotes Array:

let quotes = [
    { text: "Life is like a box of chocolates. You never know what you're gonna get.", category: "Life" },
    { text: "Believe you can and you're halfway there.", category: "Self-belief" },
    { text: "The greatest accomplishment is not in never failing, but in rising up every time we fall.", category: "Success" },
    { text: "You miss 100% of the shots you don't take.", category: "Motivation" }
]

function showRandomQuotes() {
    let number = quotes.length;
    let randomIndex = Math.floor(Math.random() * number);

    let quotesDisplay = document.getElementById('quoteDisplay')
    let textContent = quotes[randomIndex] 
    quotesDisplay.textContent = textContent.text

}
let newQuoteBtn = document.getElementById('newQuote')
newQuoteBtn.addEventListener('click',showRandomQuotes);
console.log(showRandomQuotes());

function addQuote(){
    let newQuoteText = document.getElementById('newQuoteText').value
    let newQuoteCategory = document.getElementById('newQuoteCategory').value
   quotes.push({text : newQuoteText , category : newQuoteCategory})
}
