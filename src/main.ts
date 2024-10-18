class ContainerPicture extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const sources = [...this.querySelectorAll("source")];
    const shadow = this.attachShadow({ mode: "open" });

    this.insertStyle(shadow, sources);
    for (const i in sources) {
      this.transformSource(shadow, sources[i]);
    }
  }

  insertStyle(root: ShadowRoot, sources: HTMLSourceElement[]) {
    const containers = sources
      .map((el) => el.getAttribute("container"))
      .filter((x) => x);
    const srcSets = sources.map((el) => el.getAttribute("srcset"));

    let css = `
:host {
  display: inline-block;
}`;
    for (const src of srcSets) {
      css += `
[srcset="${src}"] {
  background: url(${src})
}`;
    }
    for (const container of containers) {
      css += `
[container="${container}"] {
  display: none;
}`;
    }
    for (let i = containers.length - 1; i >= 0; i--) {
      const container = containers[i];
      css += `
@container ${container} {
  [container="${container}"] {
    display: inline-block;
  }
  :not([container="${container}"]) {
    display: none;
  }
}`;
    }

    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.appendChild(document.createTextNode(css));
    root.appendChild(style);
  }

  transformSource(root: ShadowRoot, source: HTMLSourceElement) {
    const attributes = source.attributes;
    source.remove();
    const object = document.createElement("object");
    root.appendChild(object);
    for (const attr of attributes) {
      object.setAttribute(attr.name, attr.value);
    }
  }
}

customElements.define("container-picture", ContainerPicture);
