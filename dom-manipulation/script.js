let quotes = [
    { text: "Life is like a box of chocolates.", category: "Life" },
    { text: "Believe you can and you're halfway there.", category: "Self-belief" },
    { text: "You miss 100% of the shots you don't take.", category: "Motivation" },
    { text: "The greatest accomplishment is not in never failing.", category: "Success" },
  ];
  
  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
    const categories = [...new Set(quotes.map(quote => quote.category))];
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
  
    displayQuotes(filteredQuotes);
    localStorage.setItem("lastSelectedCategory", selectedCategory);
  }
  
  function displayQuotes(filteredQuotes) {
    const quotesDisplay = document.getElementById("quoteDisplay");
    quotesDisplay.innerHTML = "";
  
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
      filterQuotes();
    }
  }
  
  function createAddQuoteForm() {
    let newQuoteText = document.getElementById("newQuoteText").value;
    let newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();
  }
  
  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  window.onload = function() {
    loadQuotes(); // Load stored quotes
    populateCategories(); // Populate categories dropdown
    loadLastSelectedCategory(); // Load last selected category filter
  };
  