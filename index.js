import {
	getBookmarks,
	getWebsiteLogo,
	getBackground,
	updateCrypto,
	getCurrentTime,
	getLocation,
	getQuote,
	bookmarksFolder,
	cryptoArray,
} from "./utils.js";

// Want more from your new tabs? This extension shows all your selected bookmarks in an easy to read format so you can get to where you need as quickly as possible.

// Along with a sleek design a random background will be shown based on interests of your choosing, you can also see the latest crypto prices and weather in your location.

// Need some inspiration? feel free to read a random quote based on a topic of your choice!

getBookmarks(bookmarksFolder);
updateCrypto();
// setInterval(getBackground, 60000);
setInterval(updateCrypto, 1000);
setInterval(getCurrentTime, 1000);
getQuote();
getBackground();
getLocation();

cryptoArray.forEach((cryptoName) => {
	document.getElementById(
		"crypto"
	).innerHTML += `<div id="${cryptoName}"></div>`;
});
