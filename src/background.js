chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "tweetPage",
    title: "Tweet This Page",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "tweetPage") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getPageDetails
    });
  }
});

function getPageDetails() {
  const pageTitle = document.title; // Get the page title
  let pageDescription = ''; // Variable to hold the description

  // Try to extract the content of the meta description tag
  const metaDescription = document.querySelector("meta[name='og:description']");
  if (metaDescription) {
    pageDescription = metaDescription.content;
  }

  // Truncate the description to 100 characters for example
  if (pageDescription.length > 100) {
    pageDescription = pageDescription.substring(0, 100) + '...';
  }

  // Construct the Twitter URL with both page title and description
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(pageTitle)} - ${encodeURIComponent(pageDescription)}&url=${encodeURIComponent(document.location.href)}`;

  // Open Twitter URL in a new tab
  window.open(twitterUrl, '_blank');
}
