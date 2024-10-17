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

- Can we still use a picture tag after transformation ? => it works, but is it valid HTML ?
- How do we encapsulate the styles ? (shadow dom ? generate id ?)
- What will load the browser if we do not specify the `media` ? => source with srcset are not loaded
- What will load the browser after the transformation ? Will `display: none` prevent the loading of unused images ? => use data-src / source + srcset ?
- Is `loading="lazy"` helping ? Can we transform the HTML before the last image is loaded ?
