function emojify(text: string): string {
  return text
    .replace(/ dog[ ']/gim, " 🐶 $& ")
    .replace(/ wolf[ ']/gim, " 🐺 $&");
}

function sanitize(htmlContent: string): string {
  return htmlContent.replace(
    /<\/?[a-zA-Z0-9 \=\"\'\-\_\:\;\(\)\,\/]+\/?>/gm,
    " $& "
  );
}

function getAllTextElement(): HTMLElement[] {
  try {
    const relevantTags: (keyof HTMLElementTagNameMap)[] = ["body"];
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
  } catch (e) {
    console.error("getAllTextElement failed");
    throw e;
  }
}

export function emojifyContent(): void {
  try {
    console.info(`start page emojification`);
    const elements = getAllTextElement();
    elements.map((element) => {
      const text = element.innerHTML;
      if (!text) {
        return element;
      }
      const sanitizedText = sanitize(text);
      element.innerHTML = emojify(sanitizedText);
      return element;
    });
    console.info("page emojified");
  } catch (e) {
    console.error("emojified webpage failed");
    throw e;
  }
}

export function resetContent(): void {
  console.info(`start page reset`);
  window.location.reload();
}
