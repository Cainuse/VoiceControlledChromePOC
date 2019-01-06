let currState = null;
let availableStates = [
  "normal",
  "minimized",
  "maximized",
  "fullscreen",
  "docked"
];
async function start(tab) {
  await refreshState();
  chrome.windows.getCurrent(changeStateOfBrowser);
}

async function changeStateOfBrowser(win) {
  if (availableStates.includes(currState)) {
    chrome.windows.update(win.id, { state: currState });
    console.log(`Updating browser size to ${currState}`);
  }

  console.log(win);
}

async function refreshState() {
  const response = await fetch(
    "https://flow-6c0f6.firebaseio.com/browser.json"
  );
  const responseJson = await response.json();
  currState = responseJson.windowState;
  console.log(currState);
  chrome.windows.getCurrent(changeStateOfBrowser);
  setTimeout(refreshState, 1000);
}

chrome.browserAction.onClicked.addListener(start);
