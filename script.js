chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  if (tabs.length > 0) {
    const activeTab = tabs[0];
    const activeTabUrl = activeTab.url;
    document.getElementById("progress_bar").style.display = "block";
    document.getElementById("view_data").style.display = "none";
    fetch("http://localhost:8000/scrapping/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: activeTabUrl }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Define the downloadCSV function within this block
       
        const tableBody = document.getElementById("view");
        data.product_data.forEach((product) => {
          const newRow = tableBody.insertRow();
          const nameCell = newRow.insertCell(0);
          nameCell.textContent = product.name;
          const priceCell = newRow.insertCell(1);
          priceCell.textContent = product.price;
        });
        
      })
      .catch((error) => {
        alert(error);
      });
  }
});
