function insertStyle(picture: HTMLPictureElement, containers: string[]) {
  const id = `pcp-${crypto.randomUUID()}`;
  picture.setAttribute("id", id);

  let css = "";
  for (const container of containers) {
    css += `
#${id} [container="${container}"] {
  display: none;
}`;
  }
  for (let i = containers.length - 1; i >= 0; i--) {
    const container = containers[i];
    css += `
@container ${container} {
  #${id} [container="${container}"] {
    display: block;
  }
  #${id} :not([container="${container}"]) {
    display: none;
  }
}`;
  }

  const head = document.head;
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
}

function transformSource(
  picture: HTMLPictureElement,
  source: HTMLSourceElement,
) {
  const attributes = source.attributes;
  source.remove();
  const image = document.createElement("img");
  picture.appendChild(image);
  // image.setAttribute('loading', 'lazy')
  // image.setAttribute('alt', 'TNF')
  for (const attr of attributes) {
    image.setAttribute(attr.name, attr.value);
  }
}

function pictureContainerPolyfill(root: Element | Document = document) {
  for (const picture of [...root.querySelectorAll("picture")]) {
    const sources = [...picture.querySelectorAll("source")];
    const containers = sources.map((el) => el.getAttribute("container"));
    if (!containers.some((container) => !container)) {
      for (const i in sources) {
        transformSource(picture, sources[i]);
      }
      insertStyle(picture, containers as string[]);
    }
  }
}

pictureContainerPolyfill();
