const urlInput = document.getElementById("urlInput");
const addBtn = document.getElementById("addBtn");
const urlList = document.getElementById("urlList");
const launchAllBtn = document.getElementById("launchAllBtn");

function extractDomain(url) {
  try {
    let clean = url.startsWith("http") ? url : "https://" + url;
    return new URL(clean).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function renderList() {
  chrome.storage.local.get(["urls"], (result) => {
    const urls = result.urls || [];
    urlList.innerHTML = "";
    urls.forEach((url, index) => {
      const li = document.createElement("li");
      li.textContent = extractDomain(url); // Show only domain
      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.onclick = () => deleteUrl(index);
      li.appendChild(delBtn);
      urlList.appendChild(li);
    });
  });
}

function addUrl() {
  const newUrl = urlInput.value.trim();
  if (!newUrl) return;

  chrome.storage.local.get(["urls"], (result) => {
    const urls = result.urls || [];
    urls.push(newUrl);
    chrome.storage.local.set({ urls }, () => {
      urlInput.value = "";
      renderList();
    });
  });
}

function deleteUrl(index) {
  chrome.storage.local.get(["urls"], (result) => {
    const urls = result.urls || [];
    urls.splice(index, 1);
    chrome.storage.local.set({ urls }, renderList);
  });
}

function launchAll() {
  chrome.storage.local.get(["urls"], (result) => {
    const urls = result.urls || [];
    urls.forEach((url) => {
      const fullUrl = url.startsWith("http") ? url : "https://" + url;
      chrome.tabs.create({ url: fullUrl });
    });
  });
}

addBtn.onclick = addUrl;
launchAllBtn.onclick = launchAll;
document.addEventListener("DOMContentLoaded", renderList);
