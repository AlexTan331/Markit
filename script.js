const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const websiteDescriptionEl = document.getElementById("website-description");
const bookmarkContainer = document.getElementById("bookmarks-container");
const infoContainer = document.getElementById("info-container");
const description = document.getElementById("description");

let bookmarks = {};

modal.classList.remove("show-modal");
fetchBookmarks();
infoContainer.style.display = "none";

function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// Form Validation
function submitBookmark() {
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  const desc = websiteDescriptionEl.value;

  if (!urlValue.includes("http://") && !urlValue.includes("https://")) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(nameValue, urlValue)) return false;

  const bookmark = {
    name: nameValue,
    url: urlValue,
    description: desc,
  };

  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  bookmarkForm.reset();
  websiteNameEl.focus();
  fetchBookmarks();
}

function validate(nameValue, urlValue) {
  const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Input cannot be empty.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Invalid web address.");
    return false;
  }
  return true;
}

// Fetch Bookmarks From cache
function fetchBookmarks() {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    buildBookmarks();
  }
}

// Build bookmark div component
function buildBookmarks() {
  bookmarkContainer.textContent = "";

  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];

    const item = document.createElement("div");
    item.classList.add("item");
    item.setAttribute("onmouseover", `displayInfo('${id}')`);
    item.setAttribute("onmouseout", "hideInfo(this)");
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-window-close");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);

    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");

    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarkContainer.appendChild(item);
  });
}

function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

bookmarkForm.addEventListener("submit", submitBookmark);

function displayInfo(id) {
  description.innerText = bookmarks[id].description;
  infoContainer.style.display = "contents";
}

function hideInfo() {
  infoContainer.style.display = "none";
}
