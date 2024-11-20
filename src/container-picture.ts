class ContainerPicture extends HTMLElement {
  divs: HTMLDivElement[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Add style tag
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    this.shadowRoot?.appendChild(style);
    // Add slot to listen to slot change and update the shadow DOM
    const slot = document.createElement("slot");
    this.shadowRoot?.appendChild(slot);
    this.shadowRoot?.addEventListener("slotchange", () => {
      this.updateStyle();
      this.transformSource();
    });
  }

  connectedCallback(): void {
    this.updateStyle();
    this.transformSource();
  }

  transformSource(): void {
    for (const div of this.divs) {
      div.remove();
    }
    const images = this.querySelectorAll<HTMLImageElement | HTMLSourceElement>(
      "source, img",
    );
    for (let i = 0; i < images.length; i++) {
      const div = document.createElement("div");
      this.shadowRoot?.appendChild(div);
      this.divs.push(div);
    }
  }

  updateStyle(): void {
    const images = this.querySelectorAll<HTMLImageElement | HTMLSourceElement>(
      "source, img",
    );

    let css = `
:host {
  display: inline-block;
}
slot {
  display: none;
}`;
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const container = image.getAttribute("container");
      css += `
:nth-child(${Number(i) + 3}) {
  background: url(${image.src || image.srcset});
  width: ${image.width ? image.width + "px" : "auto"};
  height: ${image.height ? image.height + "px" : "auto"};
  ${container ? "display: none" : "display: inline-block"};
}`;
    }

    for (let i = images.length; i > 0; i--) {
      const image = images[i - 1];
      const container = image.getAttribute("container");
      if (container) {
        css += `
@container ${container} {
  :nth-child(${i + 2}) {
    display: inline-block;
  }
  :not(:nth-child(${i + 2})) {
    display: none;
  }
}`;
      }
    }

    const style = this.shadowRoot?.querySelector("style");
    if (style) {
      style.textContent = css;
    }
  }
}

customElements.define("container-picture", ContainerPicture);
