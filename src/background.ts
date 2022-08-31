const green = "#3aa757";
const none = "";
const active = false;

function updateBackgroundColor(color: string): void {
  console.log("set background color to", color);
  document.body.style.backgroundColor = color;
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({ color: green, active });
  console.log("Default background color set to %cgreen", `color: ${green}`);
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const keys = await chrome.storage.local.get(["color", "active"]);
    const active = !keys.active;
    const color = active ? keys.color : none;
    await Promise.all([
      chrome.storage.local.set({ active }),
      chrome.scripting.executeScript({
        target: { tabId: tab.id ? tab.id : -1 },
        func: updateBackgroundColor,
        args: [color],
      }),
    ]);
  } catch (e) {
    console.error(e);
  }
});
