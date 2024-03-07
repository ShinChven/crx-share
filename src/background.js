chrome.runtime.onInstalled.addListener(function() {
  // Create a parent item
  chrome.contextMenus.create({
    id: "sharePage",
    title: "Share This Page",
    contexts: ["page"]
  });

  // Twitter
  chrome.contextMenus.create({
    id: "shareTwitter",
    parentId: "sharePage",
    title: "Share on Twitter",
    contexts: ["page"]
  });

  // Facebook
  chrome.contextMenus.create({
    id: "shareFacebook",
    parentId: "sharePage",
    title: "Share on Facebook",
    contexts: ["page"]
  });

  // Reddit
  chrome.contextMenus.create({
    id: "shareReddit",
    parentId: "sharePage",
    title: "Share on Reddit",
    contexts: ["page"]
  });

  // Copy text
  chrome.contextMenus.create({
    id: "copyText",
    parentId: "sharePage",
    title: "Copy Sharing Text",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("share")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getPageDetails,
      args: [info.menuItemId]
    });
  }
});

function getPageDetails(menuItemId) {
  const pageTitle = document.title;
  
  // Function to retrieve content from meta tags by property name
  function getMetaContentByName(name) {
    const tag = document.querySelector(`meta[property='${name}'], meta[name='${name}']`);
    return tag ? tag.content : null;
  }

  // Try to get the description from various meta tags
  let pageDescription = getMetaContentByName('og:description') ||
                        getMetaContentByName('description') ||
                        getMetaContentByName('twitter:description');

  // Create an array to hold the parts of the text
  const textParts = [pageTitle];

  // If description exists, add it to the array
  if (pageDescription) {
    textParts.push(pageDescription);
  }

  // Join the parts with a separator, but only if the description is available
  const text = textParts.join(' - ');

  const pageUrl = document.location.href;
  let shareUrl = '';

  switch (menuItemId) {
    case 'shareTwitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
      break;
    case 'shareFacebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
      break;
    case 'shareReddit':
      shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(text)}`;
      break;
    case 'copyText':
      navigator.clipboard.writeText(`${text} ${pageUrl}`).then(() => {
        alert('Sharing text copied to clipboard!');
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
      return; // Exit the function after copying to clipboard
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank');
  }
}
