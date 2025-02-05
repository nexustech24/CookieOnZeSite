const cookieList = document.getElementById("cookie-list");
const editSection = document.getElementById("edit-section");
const cookieNameInput = document.getElementById("cookie-name");
const cookieValueInput = document.getElementById("cookie-value");
const saveButton = document.getElementById("save-cookie");
const cancelButton = document.getElementById("cancel-edit");

function displayCookies(cookies) {
  cookieList.innerHTML = "";
  cookies.forEach((cookie) => {
    const cookieDiv = document.createElement("div");
    cookieDiv.className = "cookie";

    const name = document.createElement("span");
    name.textContent = cookie.name;
    name.className = "cookie-name";

    const value = document.createElement("span");
    value.textContent = cookie.value;
    value.className = "cookie-value";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editCookie(cookie);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteCookie(cookie);

    cookieDiv.append(name, value, editButton, deleteButton);
    cookieList.appendChild(cookieDiv);
  });
}

function fetchCookies() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    chrome.cookies.getAll({ domain: url.hostname }, (cookies) => {
      displayCookies(cookies);
    });
  });
}

function editCookie(cookie) {
  editSection.classList.remove("hidden");
  cookieNameInput.value = cookie.name;
  cookieValueInput.value = cookie.value;
  saveButton.onclick = () => saveEditedCookie(cookie);
}

function saveEditedCookie(cookie) {
  chrome.cookies.set({
    url: `https://${cookie.domain}`,
    name: cookie.name,
    value: cookieValueInput.value,
    path: cookie.path,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    expirationDate: cookie.expirationDate,
  });
  editSection.classList.add("hidden");
  fetchCookies();
}

function deleteCookie(cookie) {
  chrome.cookies.remove({
    url: `https://${cookie.domain}${cookie.path}`,
    name: cookie.name,
  });
  fetchCookies();
}

cancelButton.onclick = () => editSection.classList.add("hidden");

document.addEventListener("DOMContentLoaded", fetchCookies);
