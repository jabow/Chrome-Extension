let pictureTopicArray = [
	"tennis",
	"badminton",
	"hiking",
	"urban exploration",
	"abandoned houses",
	"travel",
	"camping",
	"sunset",
	"landscape",
	"seaside",
];

let quoteTopicArray = [
	"technology",
	"motivational",
	"famous-quotes",
	"inspirational",
	"success",
	"courage",
];

let cryptoArray = ["bitcoin", "ethereum", "dogecoin"];

let user = "King James";

let bookmarksFolder = "Common";

function getBookmarks(folderName) {
	chrome.bookmarks.search(folderName, function (folder) {
		chrome.bookmarks.getChildren(folder[0].id, function (children) {
			children.forEach(function (bookmark) {
				let shortcut = document.createElement("a");
				let shortcutButton = document.createElement("a");
				let shortcutLogo = document.createElement("div");
				let shortcutName = document.createElement("p");

				shortcut.classList.add("shortcut");
				shortcutLogo.classList.add("shortcut-logo");
				shortcutButton.classList.add("shortcut-button");
				shortcutName.classList.add("shortcut-text");

				shortcutLogo.style.backgroundImage = `url(${getWebsiteFavicon(
					bookmark.url
				)})`;

				shortcutName.innerText = get10CharacterString(bookmark.title);
				shortcut.href = bookmark.url;

				shortcut.appendChild(shortcutButton);
				shortcutButton.appendChild(shortcutLogo);
				shortcut.appendChild(shortcutName);
				document.getElementById("bookmarks").appendChild(shortcut);
			});
		});
	});
}

function get10CharacterString(str) {
	if (str.length > 10) str = `${str.substring(0, 10)}...`;
	return str;
}

function getWebsiteLogo(url) {
	return `https://logo.clearbit.com/${getBaseURL(url)}`;
}

function getWebsiteFavicon(url) {
	return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=50`;
}

function getBaseURL(url) {
	let baseURL = new URL(url);
	return baseURL.origin;
}

function getBackground() {
	let randomTopic =
		pictureTopicArray[Math.floor(Math.random() * pictureTopicArray.length)];
	randomTopic.cap;
	let category = ` - Category: ${
		randomTopic.slice(0, 1).toUpperCase() + randomTopic.slice(1)
	}`;
	fetch(
		`https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=${randomTopic}`
	)
		.then((res) => res.json())
		.then((data) => {
			document.body.style.backgroundImage = `url(${data.urls.raw})`;
			if (data.location.city !== null) {
				document.getElementById(
					"background-desc"
				).textContent = `Location: ${data.location.city}, ${data.location.country} ${category}`;
			} else {
				document.getElementById(
					"background-desc"
				).textContent = `Location: Unknown ${category}`;
			}
		})
		.catch((err) => {
			// Use a default background image/author
			document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1515017804404-92b19fdfe6ac?ixid=MnwxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NzMzNzgwNjA&ixlib=rb-4.0.3)`;
			document.getElementById(
				"background-desc"
			).textContent = `Location: Unkown ${category}`;
		});
}

function updateCrypto() {
	cryptoArray.forEach((cryptoName) => {
		fetch(`https://api.coingecko.com/api/v3/coins/${cryptoName}`)
			.then((res) => {
				if (!res.ok) {
					throw Error("Something went wrong");
				}
				return res.json();
			})
			.then((data) => {
				let percentageChange24h =
					Math.round(
						data.market_data.price_change_percentage_24h * 100
					) / 100;

				document.getElementById(`${cryptoName}`).innerHTML = `
				<div class="cryptoData">
					<div class="crypto-img-tile">
						<img src=${data.image.small} />
					</div>
					<p>${data.name}</p>
					<p>£${data.market_data.current_price.gbp}</p>
					<p class="change-percentage ${
						percentageChange24h >= 0 ? "bg-green" : "bg-red"
					}">${
					percentageChange24h >= 0
						? `<i class="fa fa-arrow-up"></i>`
						: `<i class="fa fa-arrow-down"></i>`
				}${Math.abs(percentageChange24h)}%</p>
				</div>
			`;
			})
			.catch((err) => console.error(err));
	});
}

function getCurrentTime() {
	const date = new Date();
	document.getElementById("time").textContent = date.toLocaleTimeString(
		"en-us",
		{ timeStyle: "short" }
	);

	let time = date.getHours();
	if (time < 12) {
		document.getElementById(
			"greeting"
		).textContent = `Good Morning, ${user}`;
	}
	if (time > 12) {
		document.getElementById(
			"greeting"
		).textContent = `Good Afternoon, ${user}`;
	}
	if (time == 12) {
		document.getElementById(
			"greeting"
		).textContent = `Good Evening, ${user}`;
	}
}

function getLocation() {
	navigator.geolocation.getCurrentPosition((position) => {
		fetch(
			`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=6a553ecc647ffbd8d0352e175d7a33c6`
		)
			.then((res) => {
				if (!res.ok) {
					throw Error("Weather data not available");
				}
				return res.json();
			})
			.then((data) => {
				const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
				document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `;
			})
			.catch((err) => console.error(err));
	});
}

function getQuote() {
	let randomTopic =
		quoteTopicArray[Math.floor(Math.random() * quoteTopicArray.length)];
	fetch(`https://api.quotable.io/random?tags=${randomTopic}&maxLength=70`)
		.then((res) => {
			if (!res.ok) {
				throw Error("Quote data not available");
			}
			return res.json();
		})
		.then((data) => {
			// console.log(data);
			document.getElementById(
				"quote"
			).innerHTML = `<p>${data.content}</p>`;
		})
		.catch((err) => {
			console.error(err);
			document.getElementById(
				"quote"
			).innerHTML = `<p>If you fell down yesterday, stand up today.</p>`;
		});
}

export {
	getBookmarks,
	getBackground,
	updateCrypto,
	getCurrentTime,
	getLocation,
	getQuote,
	bookmarksFolder,
	cryptoArray,
};
