(function configureCourseMathJax() {
  "use strict";

  window.MathJax = {
    loader: {
      load: ["a11y/assistive-mml"],
      paths: {
        fonts: "../../vendor/mathjax",
        "mathjax-newcm": "../../vendor/mathjax/mathjax-newcm-font",
      },
    },
    tex: {
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["\\[", "\\]"]],
      processEscapes: true,
      processEnvironments: false,
      packages: { "[+]": ["ams"] },
    },
    options: {
      enableMenu: true,
      enableAssistiveMml: true,
      ignoreHtmlClass: "tex2jax_ignore",
      processHtmlClass: "tex2jax_process",
      skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    },
    output: {
      font: "mathjax-newcm",
      fontPath: "../../vendor/mathjax/mathjax-newcm-font",
      displayOverflow: "linebreak",
      linebreaks: {
        inline: true,
        width: "100%",
      },
    },
    chtml: {
      fontURL: "../../vendor/mathjax/mathjax-newcm-font/chtml/woff2",
      dynamicPrefix: "../../vendor/mathjax/mathjax-newcm-font/chtml/dynamic",
    },
    startup: {
      typeset: false,
    },
  };
})();
