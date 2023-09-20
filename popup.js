function downloadCSV(productData) {
  let csvContent = "Product Name,Price,Title,Features,Description Title,Description,Location,Characteristics,Image URLs\n";
  productData.forEach((product) => {
    const productName = product.name.replace(/\n|\r/g, ' ').trim(); // Clean product name
    const productPrice = product.price.replace(/\n|\r/g, ' ').trim(); // Clean product price
    const title = product.title.replace(/\n|\r/g, ' ').trim();
    const features = product.features.map(feat => feat.replace(/\n|\r/g, ' ').trim()).join(', ');
    const descriptionTitle = product.description_title.replace(/\n|\r/g, ' ').trim();
    const description = product.description.replace(/\n|\r/g, ' ').trim();
    const location = product.location.replace(/\n|\r/g, ' ').trim();
    const characteristics = product.characteristics.map(char => char.replace(/\n|\r/g, ' ').trim()).join(', ');
    const imageUrls = product.pics.map(url => url.replace(/\n|\r/g, ' ').trim()).join(', ');

    csvContent += `"${productName}","${productPrice}","${title}","${features}","${descriptionTitle}","${description}","${location}","${characteristics}","${imageUrls}"\n`;
  });
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'product_data.csv';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  if (tabs.length > 0) {
    const activeTab = tabs[0];
    const activeTabUrl = activeTab.url;
    const activeTabTitle = activeTab.title;
    document.getElementById("progress_bar").style.display = "block";
    document.getElementById("view_data").style.display = "none";
    function updateProgressBar() {
      const progressBar = document.getElementById('progress-bar');
      const percentageText = document.getElementById('percentage');
      let progress = 0;
      const interval = setInterval(() => {
        if (progress >= 100) {
          clearInterval(interval);
        } else {
          progress += 1;
          progressBar.style.width = progress + '%';
          percentageText.textContent = progress + '%';
        }
      }, 50);
    }
    document.addEventListener('DOMContentLoaded', () => {
      updateProgressBar();
    }); fetch("http://localhost:8000/scrapping/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: activeTabUrl }),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("progress_bar").style.display = "none";
        document.getElementById("view_data").style.display = "block";
        document.getElementById("tab_title").append('' + activeTabTitle + '');
        const tableBody = document.getElementById("view");
        data.product_data.forEach((product) => {
          const newRow = tableBody.insertRow();
          const nameCell = newRow.insertCell(0);
          nameCell.textContent = product.name;
          const priceCell = newRow.insertCell(1);
          priceCell.textContent = product.price;
          const titleCell = newRow.insertCell(2);
          titleCell.textContent = product.title;
          const featuresCell = newRow.insertCell(3);
          featuresCell.textContent = product.features.join(", ");
          const descriptionTitleCell = newRow.insertCell(4);
          descriptionTitleCell.textContent = product.description_title;
          const descriptionCell = newRow.insertCell(5);
          descriptionCell.textContent = product.description;
          const locationCell = newRow.insertCell(6);
          locationCell.textContent = product.location;
          const characteristicsCell = newRow.insertCell(7);
          characteristicsCell.textContent = product.characteristics.join(", ");
          const picsCell = newRow.insertCell(8);
          const imageElements = [];
          product.pics.forEach(imageUrl => {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = product.name;
            img.width = 70;
            img.height = 70;
            imageElements.push(img);
          });
          imageElements.forEach(img => {
            picsCell.appendChild(img);
          });
        });
        const downloadButton = document.querySelector("#downloadCsvButton");
        downloadButton.addEventListener("click", () => {
          downloadCSV(data.product_data);
        });
      })
      .catch((error) => {
        alert(error);
      });
  }
});
