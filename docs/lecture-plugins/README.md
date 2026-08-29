# Lecture plug-ins

Most lectures need no custom JavaScript. For an optional lecture-specific
interaction, place an ES module in this directory and set the lecture's
`plugin` field in `course.json` to a path beneath `site/lecture-plugins/`.

The module should export a default function:

```js
export default function mount({ viewer, config, container }) {
  // Add original, lecture-specific controls to `container`.
}
```

The viewer works normally if the plug-in is absent or `null`. Prefer a
declarative `demos` link in the manifest when a separate page is sufficient.
