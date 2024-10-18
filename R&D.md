# Think

transform:

```html
<picture>
  <source
    srcset="
      https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=792
    "
    container="(min-width: 682px)"
    width="682"
    height="792"
  />
  <source
    srcset="
      https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=550
    "
    container="(min-width: 473px)"
    width="473"
    height="550"
  />
  <img
    alt="TNF"
    loading="lazy"
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=300"
    width="258"
    height="300"
  />
</picture>
```

Into something like:

```html
<div class="picture-1">
  <img
    class="min-682"
    alt="TNF"
    loading="lazy"
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=792"
    width="682"
    height="792"
  />
  <img
    class="min-473"
    alt="TNF"
    loading="lazy"
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=550"
    width="473"
    height="550"
  />
  <img
    alt="TNF"
    loading="lazy"
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=300"
    width="258"
    height="300"
  />
</div>
```

with some CSS (process from bottom to top):

```css
.picture-1 .min-473 {
  display: none;
}
.picture-1 .min-682 {
  display: none;
}
@container (min-width: 473px) {
  .picture-1 .min-473 {
    display: block;
  }
  .picture-1 :not(.min-473) {
    display: none;
  }
}
@container (min-width: 682px) {
  .picture-1 .min-682 {
    display: block;
  }
  .picture-1 :not(.min-682) {
    display: none;
  }
}
```

Questions:

- Can we still use a picture tag after transformation ? => it works, but is it valid HTML ?
- How do we encapsulate the styles ? (shadow dom ? generate id ?)
- What will load the browser if we do not specify the `media` ? => source with srcset are not loaded
- What will load the browser after the transformation ? Will `display: none` prevent the loading of unused images ? => use data-src / source + srcset ?
- Is `loading="lazy"` helping ? Can we transform the HTML before the last image is loaded ?

# First attempt

transformed:

```html
<picture>
  <source
    srcset="
      https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=792
    "
    container="(min-width: 682px)"
    width="682"
    height="792"
  />
  <source
    srcset="
      https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=550
    "
    container="(min-width: 473px)"
    width="473"
    height="550"
  />
  <img
    alt="TNF"
    loading="lazy"
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=300"
    width="258"
    height="300"
  />
</picture>
```

Into:

```html
<picture id="pcp-a6fb1b80-72a9-4396-bec6-cb5ce2d16299">
  <img
    alt="TNF"
    loading="lazy"
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=300"
    width="258"
    height="300"
  />
  <img
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=792"
    container="(min-width: 682px)"
    width="682"
    height="792"
  />
  <img
    src="https://images.thenorthface.com/is/image/TheNorthFace/NF0A4ALM_BQW_hero?hei=550"
    container="(min-width: 473px)"
    width="473"
    height="550"
  />
</div>
```

(the unique id is generated using `pcp-${crypto.randomUUID()}`)

with a style tag injected in the head:

```html
<style type="text/css">
#pcp-a6fb1b80-72a9-4396-bec6-cb5ce2d16299 [container="(min-width: 682px)"] {
  display: none;
}
#pcp-a6fb1b80-72a9-4396-bec6-cb5ce2d16299 [container="(min-width: 473px)"] {
  display: none;
}
@container (min-width: 473px) {
  #pcp-a6fb1b80-72a9-4396-bec6-cb5ce2d16299 [container="(min-width: 473px)"] {
    display: block;
  }
  #pcp-a6fb1b80-72a9-4396-bec6-cb5ce2d16299 :not([container="(min-width: 473px)"]) {
    display: none;
  }
}
@container (min-width: 682px) {
  #pcp-a6fb1b80-72a9-4396-bec6-cb5ce2d16299 [container="(min-width: 682px)"] {
    display: block;
  }
  #pcp-a6fb1b80-72a9-4396-bec6-cb5ce2d16299 :not([container="(min-width: 682px)"]) {
    display: none;
  }
}</style>
```

Result:

* it works
* the html is rewritten before the image is loaded (using `loading="lazy"`)
* but after the transformation all images are loaded (the display none does not prevent the loading of the image)
  * this is because doing something like: `const img = new Image(); img.src = '...'` will download the image no matter what.
* we can't use shadow DOM with the picture tag (available elements are listed here: https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)

Conclusion:

Try to find another to display the images without using img tags

