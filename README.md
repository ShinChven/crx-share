# CRX Share Chrome Extension

CRX Share is a customizable Chrome extension that allows users to quickly share the current page they are viewing on social media platforms such as 𝕏 (formerly Twitter), Facebook, Reddit, LinkedIn, Pinterest, Tumblr, Truth Social, and Weibo. It also provides a feature to open a link with selected text.

## Introduction

This extension is designed to enhance the social sharing experience by integrating directly into the Chrome browser. With just a couple of clicks, users can share interesting articles, blog posts, or any web page they are browsing. Additionally, users can open a link with selected text, making it easy to use the text in various contexts. The extension is highly customizable, allowing users to add, edit, and delete custom share targets.

## Installation

To install the CRX Share Chrome extension, follow these steps:

1. Download the extension files from the GitHub repository:
   ```
   git clone https://github.com/ShinChven/crx-share.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" by toggling the switch in the top-right corner.

4. Click on "Load unpacked" and select the directory where you cloned the CRX Share repository.

5. The CRX Share extension should now appear in your list of installed extensions and is ready for use.

## Usage

After installation, the CRX Share extension is simple to use:

1. Navigate to any web page you wish to share.

2. Right-click anywhere on the page to open the context menu.

3. Hover over the "Share This Page" menu item to reveal the sharing options.

4. Select one of the following options to share the current page:
   - **𝕏 (formerly Twitter)**: Share the current page on 𝕏 (formerly Twitter).
   - **Facebook**: Share the current page on Facebook.
   - **Reddit**: Share the current page on Reddit.
   - **LinkedIn**: Share the current page on LinkedIn.
   - **Pinterest**: Share the current page on Pinterest.
   - **Tumblr**: Share the current page on Tumblr.
   - **Truth Social**: Share the current page on Truth Social.
   - **Weibo**: Share the current page on Weibo.
   - **Copy Sharing Text**: Copy the page title and URL to the clipboard.

5. If you choose to share on a social media platform, a new tab will open with the sharing dialogue pre-populated with the page title, description, and URL.

6. If you choose to copy the sharing text, the page title and URL will be copied to your clipboard, and you will receive an alert confirming the action.

### Open Selected Text with

1. Select any text on a web page.

2. Right-click to open the context menu.

3. Hover over the "Open Selected Text with" menu item to reveal the options.

4. Select one of the following options to open a link with the selected text:
   - **Google Search**: Search the selected text on Google.
   - **Custom Targets**: Open a link with the selected text using your configured custom targets.

## Popup Page

The popup page provides quick access to sharing options directly from the extension's icon in the Chrome toolbar. It includes buttons for each supported platform and a button to copy the page details to the clipboard.

To open the preferences page from the popup, click the gear icon (⚙️) in the popup header.

## Preferences Page

The preferences page allows users to manage custom share targets. Users can add, edit, and delete custom targets with specific titles, templates, button colors, and text colors. These custom targets will appear in the context menu and popup page for easy access.

## Code Files

### `src/background.js`

This file handles the creation of context menu items for sharing the current page on various social media platforms. It also manages the execution of scripts to retrieve page details and open the appropriate sharing URLs.

### `src/popup.js`

This file adds event listeners to the sharing buttons in the popup page. It retrieves the current page details and opens the sharing URLs or copies the page details to the clipboard.

### `src/popup.html`

This file defines the structure and styling of the popup page, including the sharing buttons and the preferences button.

### `src/preferences.html`

This file defines the structure and styling of the preferences page, where users can add, edit, and delete custom share targets.

### `src/preferences.js`

This file contains the JavaScript logic for managing the preferences page, including adding, editing, and deleting custom share targets.

### `src/content.js`

This file contains the content script that runs in the context of web pages. It can be used to interact with the web page's DOM and retrieve necessary information for sharing.

## Contributing

Contributions to the CRX Share extension are welcome. Please feel free to fork the repository, make changes, and submit pull requests. You can also open issues if you find bugs or have feature requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
