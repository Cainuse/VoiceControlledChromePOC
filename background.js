let dataCache = null;
let scroll = null;
async function start(tab) {
  await refreshState(tab.id);
  console.log("Hi");
}
/**
 * Changes the display state of browser
 * @param {*} win 
 */

async function changeStateOfBrowser(win) {
  let availableStates = [
    "normal",
    "minimized",
    "maximized",
    "fullscreen",
    "docked"
  ];

  if (availableStates.includes(dataCache.windowState)) {
    chrome.windows.update(win.id, { state: dataCache.windowState });
    console.log(`Updating browser size to ${dataCache.windowState}`);
  }
  
}

/**
 * Scrolls down on the highlighted tab
 * @param {*} win 
 */
function scrollPage(tab){
  // let spdMap = [
  //   {key: "slow", val: 5},
  //   {key: "middle", val: 10},
  //   {key: "fast", val: 15},
  //   {key: "lightning", val: 30}
  // ]
  let x = 0;
  let y = 0;

  switch(dataCache.page.scrollDir){
    case "up":
      x = 0;
      y = -5;
      break;
    case "down":
      x = 0;
      y = 5;
      break;
    case "right":
      x = 5;
      y = 0;
      break;
    case "left":
      x = -5;
      y = 0;
      break;
  }
  
  if(dataCache.page.keepScrolling){
    if(scroll!=null){
      clearInterval(scroll);
    }
    scroll = setInterval(()=>{
      chrome.tabs.executeScript(tab, {
        code: `window.scrollBy({top: ${y}, left: ${x}, behavior: 'smooth'})`
      })
    },
    100);
  }
  else{
    if(scroll!=null){
      clearInterval(scroll);
    }
    
  }

}

/**
 * Updates local variable from database *Very expensive function*
 */
async function refreshState(tab) {
  const response = await fetch(
    "https://flow-6c0f6.firebaseio.com/browser.json"
  );
  const responseJson = await response.json();
  dataCache = responseJson;
  //chrome.windows.getCurrent(changeStateOfBrowser);
  
  scrollPage(tab);
  setTimeout(refreshState, 1000);
}

chrome.browserAction.onClicked.addListener(start);

