let quotes = [
    {
      text: "Life is like a box of chocolates. You never know what you're gonna get.",
      category: "Life",
    },
    {
      text: "Believe you can and you're halfway there.",
      category: "Self-belief",
    },
    {
      text: "The greatest accomplishment is not in never failing, but in rising up every time we fall.",
      category: "Success",
    },
    {
      text: "You miss 100% of the shots you don't take.",
      category: "Motivation",
    },
  ];
  
  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  function showRandomQuote() {
    let number = quotes.length;
    let randomIndex = Math.floor(Math.random() * number);
  
    let quotesDisplay = document.getElementById("quoteDisplay");
    let textContent = quotes[randomIndex];
    quotesDisplay.innerHTML = textContent.text + "<br/>" + textContent.category;
  
    sessionStorage.setItem("lastQuote", JSON.stringify(textContent));
  }
  
  let newQuoteBtn = document.getElementById("newQuote");
  newQuoteBtn.addEventListener("click", showRandomQuote);
  
  function createAddQuoteForm() {
    let newQuoteText = document.getElementById("newQuoteText").value;
    let newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save new quote to local storage
  
    let div = document.createElement("div");
    div.innerHTML = newQuoteText + "<br/>" + newQuoteCategory;
    let quotesDisplay = document.getElementById("quoteDisplay");
    quotesDisplay.appendChild(div); // Append new quote to the display
  }
  
  function loadLastQuote() {
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      document.getElementById("quoteDisplay").innerHTML = quote.text + "<br/>" + quote.category;
    }
  }
  
  function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    downloadLink.click();
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes); // Add new quotes to the array
      saveQuotes(); // Save the updated array to local storage
      showRandomQuote(); // Optionally display a random quote
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  window.onload = function() {
    loadQuotes(); // Load stored quotes
    loadLastQuote(); // Load the last viewed quote
  };

  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    // Clear the existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Get unique categories
  
    categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    let filteredQuotes = [];
  
    if (selectedCategory === "all") {
      filteredQuotes = quotes;
    } else {
      filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
  
    displayQuotes(filteredQuotes); // Update the displayed quotes
    localStorage.setItem("lastSelectedCategory", selectedCategory); // Store the selected category
  }
  
  function displayQuotes(filteredQuotes) {
    const quotesDisplay = document.getElementById("quoteDisplay");
    quotesDisplay.innerHTML = ""; // Clear previous quotes
  
    filteredQuotes.forEach(quote => {
      const div = document.createElement("div");
      div.innerHTML = quote.text + "<br/>" + quote.category;
      quotesDisplay.appendChild(div);
    });
  }
  function loadLastSelectedCategory() {
    const lastCategory = localStorage.getItem("lastSelectedCategory");
    if (lastCategory) {
      document.getElementById("categoryFilter").value = lastCategory;
      filterQuotes(); // Apply the last selected filter
    }
  }
  function createAddQuoteForm() {
    let newQuoteText = document.getElementById("newQuoteText").value;
    let newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes(); // Save new quote to local storage
    
    populateCategories(); // Update the categories dropdown
  }
        
  