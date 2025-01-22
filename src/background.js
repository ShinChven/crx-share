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
      id: "shareTwitter",
      parentId: "sharePage",
      title: "𝕏 (formerly Twitter)",
      contexts: ["page"]
    },
    {
      id: "shareFacebook",
      parentId: "sharePage",
      title: "Facebook",
      contexts: ["page"]
    },
    {
      id: "shareReddit",
      parentId: "sharePage",
      title: "Reddit",
      contexts: ["page"]
    },
    {
      id: "shareLinkedin",
      parentId: "sharePage",
      title: "LinkedIn",
      contexts: ["page"]
    },
    {
      id: "sharePinterest",
      parentId: "sharePage",
      title: "Pinterest",
      contexts: ["page"]
    },
    {
      id: "shareTumblr",
      parentId: "sharePage",
      title: "Tumblr",
      contexts: ["page"]
    },
    {
      id: "shareTruthSocial",
      parentId: "sharePage",
      title: "Truth Social",
      contexts: ["page"]
    },
    {
      id: "shareWeibo",
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

  // Load custom targets from storage
  chrome.storage.local.get({ customTargets: [] }, (result) => {
    const customTargets = result.customTargets;
    customTargets.forEach(target => {
      chrome.contextMenus.create({
        id: `customTarget-${target.id}`,
        parentId: "sharePage",
        title: target.title,
        contexts: ["page"]
      });
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("share") || info.menuItemId.startsWith("customTarget")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getPageDetails,
      args: [info.menuItemId]
    }, (results) => {
      if (info.menuItemId.startsWith("customTarget")) {
        chrome.storage.local.get({ customTargets: [] }, (result) => {
          const customTarget = result.customTargets.find(target => `customTarget-${target.id}` === info.menuItemId);
          if (customTarget) {
            const { title, description, url } = results[0].result;
            const shareUrl = customTarget.template.replace('{url}', encodeURIComponent(url))
                                                  .replace('{text}', encodeURIComponent(description));
            chrome.tabs.create({ url: shareUrl });
          }
        });
      } else {
        const { result } = results[0];
        const shareUrl = getShareUrl(info.menuItemId, result.title, result.description, result.url);
        if (shareUrl) {
          chrome.tabs.create({ url: shareUrl });
        }
      }
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

  return { title: pageTitle, description: pageDescription, url: pageUrl };
}

function getShareUrl(menuItemId, title, description, url) {
  const text = `${title} - ${description}`;
  let shareUrl = '';

  switch (menuItemId) {
    case 'shareTwitter':
      shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case 'shareFacebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case 'shareReddit':
      shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      break;
    case 'shareLinkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      break;
    case 'sharePinterest':
      shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
      break;
    case 'shareTumblr':
      shareUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&caption=${encodeURIComponent(description)}`;
      break;
    case 'shareTruthSocial':
      shareUrl = `https://truthsocial.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      break;
    case 'shareWeibo':
      shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
      break;
  }

  return shareUrl;
}
