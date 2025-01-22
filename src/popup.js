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
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: getPageDetails,
        args: [button.platform]
      });
    });
  });
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
