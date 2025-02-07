let searchResults = [];

async function searchGoogle() {
    
    const query = document.getElementById("search-input").value;
    const apiKey = "AIzaSyBfVRY-rP84SzOv4yugDDEkDDbuTrEqRoU";
    const cx = "f4ee3fbe66bf04683";
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

    try {
        const response = await fetch(url);
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
        console.error("Error fetching search results:", error);
        document.getElementById("results").innerHTML = "<p>Error fetching results. Please try again.</p>";
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