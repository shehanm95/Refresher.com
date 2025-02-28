class Link {
    constructor(title, link) {
        this.title = title;
        this.link = link;
    }

}
let quickLinks = [];
function loadQuickLinks() {
    quickLinks = [];
    hasLink = true;
    linkNum = 0;

    while (hasLink) {
        title = localStorage.getItem("t" + linkNum);
        if (title) {
            link = localStorage.getItem("l" + linkNum);
            linkNum++;
            quickLinks.push(new Link(title, link))
        } else {
            hasLink = false;
            // alert("noLinksTo SHwo")
        }
    }
    // console.log(quickLinks)
    displayLinks();
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

loadQuickLinks();


function displayLinks() {
    let quicklinksElement = document.getElementById('quickLinks');
    quicklinksElement.innerHTML = ""
    // console.log(quicklinksElement)
    linkId = 0;
    quickLinks.forEach(link => {
        quicklinksElement.innerHTML += createQuickLinkElement(link, linkId);
        linkId++;
    });

    AddNewLinkElement = `
    <div onClick="showWindow('linkAdderFull')" class="fullQuickLink">
        <div class="quickLink m-10">
            <div class="closeButtonHolder">

            </div>
            <h2 class="text-center quickLinkText quickLinkPlus">+</h2>
        </div>
        <p class="m-10 text-center quickLinkText">New Link</p>
    </div>`;
    quicklinksElement.innerHTML += AddNewLinkElement;

}

function heilightText(text) {
    text.select();
}

function getFavicon(url) {
    if (!isValidURL(url)) {
        return;
    }
    // Extract domain from URL
    let domain = new URL(url).origin;

    // Standard location of favicon
    let faviconUrl = `${domain}/favicon.ico`;

    // Alternative: Use Google's favicon service
    let googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;

    return googleFaviconUrl;

}

function createQuickLinkElement(linkObj, id) {
    link = linkObj.link;
    title = linkObj.title;
    titleDisplay = title;
    if (title.length > 8) {
        titleDisplay = title.substring(0, 6) + "..";
    }

    let quickLinkObj = `  <div id="id" class="fullQuickLink" title="${title}">
        <div class="quickLink m-10">
            <div class="closeButtonHolder">
                <button class="closeButton small" onClick="deleteQuickLink(${id})" >X</button>
            </div>
            <div class="iconHolder center">
                <img class="fav" src="${getFavicon(link)}" alt="">
            </div>
        </div>
        <p class="m-10 text-center quickLinkText">${titleDisplay}</p>
    </div>`

    return quickLinkObj;
}




function saveQuickLink() {
    title = document.getElementById("title").value;
    newLink = document.getElementById("newLink").value;

    if (title && isValidURL(newLink)) {
        linkNum = quickLinks.length;
        localStorage.setItem("t" + linkNum, title);
        localStorage.setItem("l" + linkNum, newLink);
        quickLinks.push(new Link(title, newLink));
        //   console.log(quickLinks);
        loadQuickLinks();

    } else {
        alert("Link or Llink title Cannot be empty..")
    }
}

function deleteQuickLink(id) {
    localStorage.removeItem("t" + id, title);
    localStorage.removeItem("l" + id, newLink);

    linkNum = 0
    //   console.log("dlete" + id);
    for (let i = 0; i < quickLinks.length; i++) {
        if (i != id) {
            localStorage.setItem("t" + linkNum, title);
            localStorage.setItem("l" + linkNum, newLink);
            linkNum++;
        }
    }
    loadQuickLinks();

}

function cancelSavingLink() {

}


function searchInAll() {
    openGoogle();
    openYoutube();
    openChatGPT();
}

function openChatGPT() {
    const chatGPTUrl = `https://chat.openai.com/?model=gpt-4-turbo&temporary-chat=true`;
    window.open(chatGPTUrl, "_blank");
}

function openGoogle() {
    const encodedQuery = document.getElementById("searchText").value;
    const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;
    window.open(googleUrl, "_blank");
}

function openYoutube() {
    let youtubeUrl;
    let searchText = document.getElementById("searchText").value;
    if (searchText == "") {
        youtubeUrl = `https://www.youtube.com`
    } else {
        youtubeUrl = `https://www.youtube.com/results?search_query=${searchText}`;
    }
    window.open(youtubeUrl, "_blank")

}


//=================home Page =============

function OpenYoutubeTutorial() {
    window.open("https://www.youtube.com/", "_blank")
}

//====================common=============
function closeWindow(id) {

    document.getElementById(id).classList.add("d-none");
}
function showWindow(id) {

    document.getElementById(id).classList.remove("d-none");
}


//=============================================== saving and loading links =============
let links = [];
let currentEditingLink;
let linkEditText = document.getElementById("linkEditText");

function selectLink(linkId) {
    currentEditingLink = linkId.id;
    document.getElementById("linkEditTextSection").style.display = 'flex'
    let link = localStorage.getItem(currentEditingLink) || "https://www.google.com";
    document.getElementById("linkEditText").value = link;
}

function loadAllLinks() {
    for (let i = 0; i < 5; i++) {
        let link = localStorage.getItem("link" + i) || "https://www.google.com";
        links.push(link);
        document.getElementById("link" + i).textContent = link;
    }

}

function saveLink() {
    if (currentEditingLink) {
        let linkEditTextValue = document.getElementById("linkEditText").value
        if (!isValidURL(linkEditTextValue)) {
            alert("Entered URL is not valid....");
            return;
        }
        //   console.log(currentEditingLink + " current editing link")
        let linkIdInList = currentEditingLink[4] * 1;
        links[linkIdInList] = linkEditTextValue;
        localStorage.setItem(currentEditingLink, linkEditTextValue);
        document.getElementById(currentEditingLink).textContent = linkEditTextValue;
        document.getElementById("linkEditTextSection").style.display = 'none'
    } else {
        alert("No Edit Link Selected");
    }
}



loadAllLinks();


// =================================================== time limits
let refreshDetails = document.getElementById("refreshDetails");
let minValue;
let maxValue;

function setValues(valueType) {
    minValue = document.getElementById("minValue").value * 1;
    maxValue = document.getElementById("maxValue").value * 1;

    if (minValue >= maxValue) {
        alert("Max value should be bigger than Min value");
        return;
    }
    localStorage.setItem("minValue", minValue);
    localStorage.setItem("maxValue", maxValue);
    location.reload();
}

function loadminAndMaxValues() {
    minValue = localStorage.getItem("minValue");
    maxValue = localStorage.getItem("maxValue");
    document.getElementById("minValue").value = minValue;
    document.getElementById("maxValue").value = maxValue;
}
loadminAndMaxValues();

setTimeout(() => {
    //    console.log(links);
    startOpenLinks(minValue, maxValue);
}, 4000)

let pause = false;

function pauseTimer(pauseButton, resumeButton) {
    pauseButton.classList.add("d-none");
    resumeButton.classList.remove("d-none");

    pause = true;
}
function resume(pauseButton, resumeButton) {
    pauseButton.classList.remove("d-none");
    resumeButton.classList.add("d-none");
    pause = false;
}
function checkPause() {
    return pause;
}
function startOpenLinks(n, x) {
    openLink(links[Math.floor(Math.random() * 5)]);
    let frontTimeDisplay = document.getElementById("frontTimeDisplay");
    let linksOpendTimes = 0;
    links.push("https://www.linkedin.com/in/shehan-maleesha-017a89261/");
    links.push("https://shehanm95.github.io/shehan.com/");
    randomVal = createRandomVal(n, x);
    setInterval(() => {
        //console.log(randomVal);
        if (!checkPause()) {
            if (randomVal < 0) {
                if (linksOpendTimes < 4) {
                    linksOpendTimes++;
                    randomLink = Math.floor(Math.random() * 5);
                    //console.log(links[randomLink]);
                    openLink(links[randomLink]);

                } else {
                    linksOpendTimes = 0;
                    randomLink = Math.floor(Math.random() * 2 + 5);
                    //console.log(links[randomLink]);
                    openLink(links[randomLink]);
                }
                randomVal = createRandomVal(n, x);

            } else {
                timeText = `Site Refresh In : ${String((Math.floor(randomVal / 60))).padStart(2, "0")}:${String(randomVal % 60).padStart(2, "0")}`;

                refreshDetails.textContent = timeText
                frontTimeDisplay.textContent = timeText
            }
            randomVal--
        }
    }, 1000)
}
function createRandomVal(min, max) {
    min = min * 1;
    max = max * 1;
    let minu = Math.floor(Math.random() * (max - min + 1) + min) * 60; // Get random minutes
    let sec = Math.floor(Math.random() * (55))
    return minu + sec; // Return value in seconds
}

function openLink(link) {
    window.open(link, "_blank");
    // console.log(link)
}

function contactDeveloper() {
    window.open("https://www.linkedin.com/in/shehan-maleesha-017a89261/", "_blank")
}

