let searchResults = [];

async function searchGoogle() {
    const query = document.getElementById("search-input").value;
    if (!query) {
        document.getElementById("results").innerHTML = "<p>Enter a query.</p>";
        return;
    }

    try {
        const response = await fetch(`https://google-search-pifg.onrender.com/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch results");
        const data = await response.json();

        if (data.items) {
            searchResults = data.items.map(item => ({
                title: item.title,
                link: item.link
            }));

            displayResults(searchResults);
            document.getElementById("download-btn").style.display = "block";
            return searchResults;
        } else {
            document.getElementById("results").innerHTML = "<p>No results found.</p>";
            document.getElementById("download-btn").style.display = "none";
        }
    } catch (error) {
        document.getElementById("results").innerHTML = "<p>Error loading search results.</p>";
        document.getElementById("download-btn").style.display = "none";
    }
}

function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    results.forEach(item => {
        const resultItem = document.createElement("div");
        resultItem.innerHTML = `<h3><a href="${item.link}" target="_blank">${item.title}</a></h3>`;
        resultsDiv.appendChild(resultItem);
    });
}

function downloadResultsAsJson() {
    const jsonBlob = new Blob([JSON.stringify({ results : searchResults }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(jsonBlob);
    a.download = "search_results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { searchGoogle, displayResults, downloadResultsAsJson };
}