# container-picture-element

## Install

Install with:

```bash
npm i container-picture-element
```

or use the package manager of your choice.

Then just import it into your project:

```js
import "container-picture-element";
```

Or directly include the script in `dist/container-picture.global.js` in your HTML page.

## Usage

The script will register a custom element you can then use in your HTML:

```html
<container-picture>
  <source
    srcset="./682.jpg"
    container="(min-width: 682px)"
    width="682"
    height="453"
  />
  <source
    srcset="./473.jpg"
    container="(min-width: 473px)"
    width="473"
    height="314"
  />
  <img alt="A nice poppy flower" src="./258.jpg" width="258" height="171" />
</container-picture>
```

You can use the `container` attribute on the `source` element to define container queries (like proposed [here](https://github.com/w3c/csswg-drafts/issues/5889) and [here](https://github.com/whatwg/html/issues/10182)).

## Pitfalls

The usage of the `img` element is intended for SEO and accessibility reasons.

The problem is that it will be parsed by the browser speculative parsing too and will cause the browser to download the image defined in the `src` attribute before any JavaScript can be executed.

This can cause the browser to download another image when the JavaScript will be executed, the one that effectively correspond to the size of the container.

Adding the `loading="lazy"` attribute can help to prevent this behavior.

In that case, depending on the loading of the elements in your page, the execution of the JavaScript and the position of the image relative to the viewport, it can prevent the downloading of the `img` `src` image.

But this will not work in all situations.

That's why we recommend to always put the image that's intended for mobile devices at the end.

In that case:

- mobile devices will only download the mobile image
- other devices will download:
  - in the best scenario: only their image (when using `loading="lazy"`)
  - in the worst scenario: both the mobile image and their image (fortunately the mobile image is often less heavy)

If you really don't want this behavior, you can replace the `img` element by another `source` element:

```html
<container-picture>
  <source
    srcset="./682.jpg"
    container="(min-width: 682px)"
    width="682"
    height="453"
  />
  <source
    srcset="./473.jpg"
    container="(min-width: 473px)"
    width="473"
    height="314"
  />
  <source srcset="./258.jpg" width="258" height="171" />
</container-picture>
```

In that case the browser won't download anything until the JavaScript is executed, but you also lose some SEO and accessibility for that image (that's fine if you use this for some decoration image).

## Demo

You can check the embedded demo by cloning or downloading the project and running:

```bash
npm i
npm run dev
```
