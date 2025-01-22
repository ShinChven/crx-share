// Add event listeners for all sharing buttons
const shareButtons = [
  { id: 'twitter-button', platform: 'shareTwitter' },
  { id: 'facebook-button', platform: 'shareFacebook' },
  { id: 'reddit-button', platform: 'shareReddit' },
  { id: 'linkedin-button', platform: 'shareLinkedin' },
  { id: 'pinterest-button', platform: 'sharePinterest' },
  { id: 'tumblr-button', platform: 'shareTumblr' },
  { id: 'truthsocial-button', platform: 'shareTruthSocial' },
  { id: 'weibo-button', platform: 'shareWeibo' },
  { id: 'copy-button', platform: 'copyText' }
];

shareButtons.forEach(button => {
  document.getElementById(button.id).addEventListener('click', () => {
    if (button.platform === 'copyText') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: getPageDetails,
          args: [button.platform]
        }, (results) => {
          const { result } = results[0];
          const clipboardContent = `${result.title}\n${result.description}\n${result.url}`;
          navigator.clipboard.writeText(clipboardContent).then(() => {
            console.log('Page details copied to clipboard!');
            alert('Page details copied to clipboard!');
          }, (err) => {
            console.error('Could not copy text: ', err);
          });
        });
      });
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: getPageDetails,
          args: [button.platform]
        });
      });
    }
  });
});

function getPageDetails(menuItemId, template) {
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

  if (menuItemId === 'copyText' || menuItemId === 'customTarget') {
    return { title: pageTitle, description: pageDescription, url: pageUrl };
  }

  let shareUrl = '';

  switch (menuItemId) {
    case 'shareTwitter':
      shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
      break;
    case 'shareFacebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
      break;
    case 'shareReddit':
      shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(text)}`;
      break;
    case 'shareLinkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
      break;
    case 'sharePinterest':
      shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&description=${encodeURIComponent(text)}`;
      break;
    case 'shareTumblr':
      shareUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}&caption=${encodeURIComponent(pageDescription)}`;
      break;
    case 'shareTruthSocial':
      shareUrl = `https://truthsocial.com/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
      break;
    case 'shareWeibo':
      shareUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(text)}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const openPreferencesButton = document.getElementById('openPreferences');
    openPreferencesButton.addEventListener('click', () => {
        console.log('Opening preferences page');
        chrome.tabs.create({ url: 'src/preferences.html' });
    });

    function loadCustomTargets() {
        console.log('Loading custom targets');
        chrome.storage.local.get({ customTargets: [] }, (result) => {
            const customTargets = result.customTargets;
            console.log('Custom targets:', customTargets);
            const container = document.querySelector('.share-buttons');
            customTargets.forEach(target => {
                const button = document.createElement('button');
                button.textContent = target.title;
                button.style.backgroundColor = target.buttonColor;
                button.style.color = target.textColor;
                button.classList.add('share-button');
                button.addEventListener('click', () => {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            function: getPageDetails,
                            args: ['customTarget', target.template]
                        }, (results) => {
                            const { result } = results[0];
                            const url = target.template.replace('{url}', encodeURIComponent(result.url))
                                                      .replace('{text}', encodeURIComponent(result.description));
                            window.open(url, '_blank');
                        });
                    });
                });
                container.appendChild(button);
            });
        });
    }

    loadCustomTargets();
});
