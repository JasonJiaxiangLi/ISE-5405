# Third-party notices

## Mozilla PDF.js

This project vendors the browser distribution of Mozilla PDF.js 6.2.108 in
`site/vendor/pdfjs/`. PDF.js is Copyright Mozilla Foundation and contributors
and is licensed under the Apache License, Version 2.0. The complete upstream
license is included at `site/vendor/pdfjs/LICENSE` and is copied into the
generated website.

Upstream project: <https://github.com/mozilla/pdf.js>

The bundled CMaps, standard fonts, color profiles, and WebAssembly helpers
retain the notices and license files distributed with PDF.js.

## MathJax

This project vendors the browser distribution of MathJax 4.1.3 in
`site/vendor/mathjax/` and the MathJax New Computer Modern font 4.1.3 in
`site/vendor/mathjax/mathjax-newcm-font/`. MathJax and the font package are
licensed under the Apache License, Version 2.0. The complete MathJax license is
included at `site/vendor/mathjax/LICENSE` and is copied into the generated
website.

Upstream projects: <https://github.com/mathjax/MathJax> and
<https://github.com/mathjax/MathJax-fonts>

Both packages are pinned and served from this site. Lecture mathematics does
not depend on a third-party content-delivery network.

## Fonts

The site requests Source Serif 4 and JetBrains Mono from Google Fonts when a
network connection is available. Local and system fallbacks are declared, so
the site remains readable without the remote fonts. No Google font files are
vendored in this repository.
