const green = "#3aa757";
const none = "";
const active = false;

function updateBackgroundColor(color: string): void {
  console.log("set background color to", color);
  document.body.style.backgroundColor = color;
}

function getAllTextElement(): HTMLElement[] {
  const relevantTags: (keyof HTMLElementTagNameMap)[] = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
  ];
  const collections = relevantTags.map((tag) =>
    document.getElementsByTagName(tag)
  );
  const list = collections.flatMap((collection) =>
    new Array<HTMLCollectionOf<HTMLElement>>(collection.length)
      .fill(collection)
      .map((collection, index) => collection.item(index))
      .filter((element): element is HTMLElement => element !== null)
  );
  return list;
}

function changeLetterToAnOther(source: string, target: string) {
  const elements = getAllTextElement();
  elements.map(
    (element) =>
      (element.textContent =
        element.textContent?.replace(source, target) ?? null)
  );
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
      chrome.scripting.executeScript({
        target: { tabId: tab.id ? tab.id : -1 },
        func: changeLetterToAnOther,
        args: ["a", "A"],
      }),
    ]);
  } catch (e) {
    console.error(e);
  }
});
