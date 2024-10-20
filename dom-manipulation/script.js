let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Believe you can and you're halfway there.", category: "Self-belief" },
    { text: "You miss 100% of the shots you don't take.", category: "Motivation" }
  ];
  
  // Load quotes from local storage
  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // Show a random quote
  function showRandomQuote() {
    let number = quotes.length;
    let randomIndex = Math.floor(Math.random() * number);
    let quotesDisplay = document.getElementById("quoteDisplay");
    let textContent = quotes[randomIndex];
    quotesDisplay.innerHTML = textContent.text + "<br/>" + textContent.category;
  
    // Save the last shown quote in sessionStorage
    sessionStorage.setItem("lastQuote", JSON.stringify(textContent));
  }
  
  // Load the last quote from sessionStorage
  function loadLastQuote() {
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
      const quote = JSON.parse(lastQuote);
      document.getElementById("quoteDisplay").innerHTML = quote.text + "<br/>" + quote.category;
    }
  }
  
  // Create a new quote and update the display, then POST it to the server
  async function createAddQuoteForm() {
    let newQuoteText = document.getElementById("newQuoteText").value;
    let newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes(); // Save new quote to local storage
  
    populateCategories(); // Update the categories dropdown
    
    // POST the new quote to the server
    await postNewQuoteToServer(newQuote);
  }
  
  // Populate categories dynamically
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
  
  // Filter quotes by category
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
  
  // Display filtered quotes
  function displayQuotes(filteredQuotes) {
    const quotesDisplay = document.getElementById("quoteDisplay");
    quotesDisplay.innerHTML = ""; // Clear previous quotes
    
    filteredQuotes.forEach(quote => {
      const div = document.createElement("div");
      div.innerHTML = quote.text + "<br/>" + quote.category;
      quotesDisplay.appendChild(div);
    });
  }
  
  // Load the last selected category filter from local storage
  function loadLastSelectedCategory() {
    const lastCategory = localStorage.getItem("lastSelectedCategory");
    if (lastCategory) {
      document.getElementById("categoryFilter").value = lastCategory;
      filterQuotes(); // Apply the last selected filter
    }
  }
  
  // Export quotes to a JSON file
  function exportQuotesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    downloadLink.click();
  }
  
  // Import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes); // Add new quotes to the array
      saveQuotes(); // Save the updated array to local storage
      populateCategories(); // Update the categories dropdown
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // GET method to fetch quotes from the server and sync with local storage
  async function fetchServerQuotes() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts"); // Replace with actual API
      const serverQuotes = await response.json();
      
      await syncQuotesWithServer(serverQuotes); // Sync with local quotes
    } catch (error) {
      console.error("Error fetching quotes from the server:", error);
    }
  }
  
  // POST method to send new quotes to the server
  async function postNewQuoteToServer(newQuote) {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
          title: newQuote.text, 
          body: newQuote.category
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Posted new quote to server:", data);
      } else {
        console.error("Failed to post quote:", response.statusText);
      }
    } catch (error) {
      console.error("Error posting quote to server:", error);
    }
  }
  
  // Sync local quotes with server data
  async function syncQuotesWithServer(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    
    serverQuotes.forEach(serverQuote => {
      const localQuoteIndex = localQuotes.findIndex(q => q.text === serverQuote.title);
      if (localQuoteIndex !== -1) {
        localQuotes[localQuoteIndex].text = serverQuote.title;
        localQuotes[localQuoteIndex].category = serverQuote.body;
      } else {
        localQuotes.push({ text: serverQuote.title, category: serverQuote.body });
      }
    });
    
    localStorage.setItem("quotes", JSON.stringify(localQuotes)); // Save updated quotes to local storage
    alert("Quotes synchronized with the server!");
  }
  
  // Periodically fetch and sync quotes from the server (every 30 seconds)
  setInterval(async () => {
    await fetchServerQuotes();
  }, 30000);
  
  // Initial setup when the page loads
  window.onload = function() {
    loadQuotes(); // Load stored quotes
    loadLastQuote(); // Load the last viewed quote
    populateCategories(); // Populate categories in the dropdown
    loadLastSelectedCategory(); // Restore the last selected category filter
  };
  