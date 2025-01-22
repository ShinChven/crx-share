chrome.runtime.onInstalled.addListener(function() {
  // Create a parent item
  chrome.contextMenus.create({
    id: "sharePage",
    title: "Share This Page",
    contexts: ["page"]
  });

  // Define the targets as an array of objects
  const targets = [
    {
      id: "twitter",
      parentId: "sharePage",
      title: "𝕏 (formerly Twitter)",
      contexts: ["page"]
    },
    {
      id: "facebook",
      parentId: "sharePage",
      title: "Facebook",
      contexts: ["page"]
    },
    {
      id: "reddit",
      parentId: "sharePage",
      title: "Reddit",
      contexts: ["page"]
    },
    {
      id: "linkedin",
      parentId: "sharePage",
      title: "LinkedIn",
      contexts: ["page"]
    },
    {
      id: "pinterest",
      parentId: "sharePage",
      title: "Pinterest",
      contexts: ["page"]
    },
    {
      id: "tumblr",
      parentId: "sharePage",
      title: "Tumblr",
      contexts: ["page"]
    },
    {
      id: "truthSocial",
      parentId: "sharePage",
      title: "Truth Social",
      contexts: ["page"]
    },
    {
      id: "weibo",
      parentId: "sharePage",
      title: "Weibo",
      contexts: ["page"]
    }
  ];

  // Create context menus using the targets array
  targets.forEach(target => {
    chrome.contextMenus.create(target);
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
    case 'twitter':
      shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
      break;
    case 'reddit':
      shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(text)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
      break;
    case 'pinterest':
      shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&description=${encodeURIComponent(text)}`;
      break;
    case 'tumblr':
      shareUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}&caption=${encodeURIComponent(pageDescription)}`;
      break;
    case 'truthSocial':
      shareUrl = `https://truthsocial.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
      break;
    case 'weibo':
      shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(text)}`;
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
