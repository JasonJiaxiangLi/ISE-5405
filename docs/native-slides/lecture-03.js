/**
 * Native Lecture 03: Proof Techniques & LaTeX.
 *
 * The private reference deck supplies the instructional sequence only. This
 * module is an independent semantic implementation for the shared native
 * runtime: no reference framework, script, stylesheet, or asset is imported.
 */

const checkpointContrapositive = Object.freeze({
  prompt: "Claim: if \\(n\\) is odd, then \\(n^2\\) is odd. Which statement is its contrapositive?",
  choices: [
    "If \\(n^2\\) is odd, then \\(n\\) is odd",
    "If \\(n^2\\) is even, then \\(n\\) is even",
    "If \\(n\\) is even, then \\(n^2\\) is even",
    "If \\(n^2\\) is odd, then \\(n\\) is even",
  ],
  correctIndex: 1,
  explanation:
    "For \\(P \\Rightarrow Q\\) with \\(P\\) = ‘\\(n\\) odd’ and \\(Q\\) = ‘\\(n^2\\) odd’, the contrapositive is \\(\\neg Q \\Rightarrow \\neg P\\): if \\(n^2\\) is even, then \\(n\\) is even.",
  autoOpen: true,
});

const checkpointEvidence = Object.freeze({
  prompt: "A conjecture has been verified by computer for \\(n=1,\\ldots,10^6\\). What do we know?",
  choices: [
    "It is true",
    "Nothing conclusive — it remains unproven",
    "It is false for some larger n",
    "Induction now finishes the proof automatically",
  ],
  correctIndex: 1,
  explanation:
    "A million confirmations are evidence, not proof—remember \\(n^2+n+41\\) surviving 39 checks. Until there is a proof, the honest status is ‘open.’",
  autoOpen: true,
});

const checkpointTechnique = Object.freeze({
  prompt: "Which technique fits best: “there is no smallest positive rational number”?",
  choices: ["Direct proof", "Induction", "Contradiction", "Counterexample"],
  correctIndex: 2,
  explanation:
    "There is nothing to construct—you rule the object out. Assume a smallest positive rational \\(q\\) exists; then \\(q/2\\) is a smaller one. Contradiction.",
  autoOpen: true,
});

const trainerQuestions = Object.freeze([
  {
    html: "For every \\(n \\ge 1\\): \\(1+3+5+\\cdots+(2n-1)=n^2\\).",
    answer: "induction",
    why: "The statement is indexed by n. Prove a base case, then show the claim for k implies the claim for k + 1.",
    whyHtml: "The statement is indexed by \\(n\\). Prove a base case, then show \\(S(k)\\Rightarrow S(k+1)\\).",
  },
  {
    html: "\\(\\sqrt{3}\\) is irrational.",
    answer: "contradiction",
    why: "This is a non-existence claim. Assume a lowest-terms fraction equals √3 and derive an impossibility.",
    whyHtml: "This is a non-existence claim. Assume a lowest-terms fraction equals \\(\\sqrt{3}\\) and derive an impossibility.",
  },
  {
    html: "Claim: \\(n^2+n+41\\) is prime for every \\(n \\ge 1\\).",
    answer: "counterexample",
    why: "The universal claim is false: n = 40 gives 41². One failing case ends it.",
    whyHtml: "The universal claim is false: \\(n=40\\) gives \\(41^2\\). One failing case ends it.",
  },
  {
    html: "If \\(3n+2\\) is odd, then \\(n\\) is odd.",
    answer: "contrapositive",
    why: "Assuming n is even makes 3n + 2 = 2(3k + 1) even immediately. Flip and negate.",
    whyHtml: "Assuming \\(n=2k\\) makes \\(3n+2=2(3k+1)\\) even immediately. Flip and negate.",
  },
  {
    html: "The product of two odd integers is odd.",
    answer: "direct",
    why: "Write the integers as 2a + 1 and 2b + 1, multiply, and regroup as twice an integer plus one.",
    whyHtml: "Write the integers as \\(2a+1\\) and \\(2b+1\\), multiply, and regroup as twice an integer plus one.",
  },
  {
    html: "If \\(x^*\\) is feasible and \\(c^\\top x^* \\le c^\\top x\\) for every feasible \\(x\\), then no feasible point has strictly smaller cost.",
    answer: "contradiction",
    why: "Assume a strictly better feasible point exists; that directly contradicts the stated inequality.",
    whyHtml: "Assume a strictly better feasible point exists; that directly contradicts \\(c^\\top x^*\\le c^\\top x\\).",
  },
  {
    html: "For every \\(n \\ge 1\\): \\(2^n \\ge n+1\\).",
    answer: "induction",
    why: "A natural-number claim with a recurrence-like comparison is a good induction target.",
    whyHtml: "A natural-number claim such as \\(2^n\\ge n+1\\) is a good induction target.",
  },
  {
    html: "Claim: every LP with an optimal solution has exactly one optimal solution.",
    answer: "counterexample",
    why: "A linear objective can be constant along an optimal edge, so one LP with multiple optima disproves the claim.",
  },
]);

const latexTemplates = Object.freeze({
  lp: {
    label: "LP template",
    source: String.raw`\begin{align}
\min_{x \in \mathbb{R}^n}\quad & c^\top x \\
\text{s.t.}\quad & Ax \le b, \\
& x \ge 0
\end{align}`,
    preview: String.raw`<span class="ns-math">\(\begin{aligned}\min_x\quad & c^\top x\\ \text{s.t.}\quad & Ax\le b,\\ &x\ge0\end{aligned}\)</span>`,
  },
  sum: {
    label: "Induction sum",
    source: String.raw`\sum_{i=1}^{n} i = \frac{n(n+1)}{2}`,
    preview: String.raw`<span class="ns-math">\(\displaystyle \sum_{i=1}^{n} i=\frac{n(n+1)}{2}\)</span>`,
  },
  matrix: {
    label: "Matrix",
    source: String.raw`A = \begin{bmatrix}
1 & 2 \\
3 & 4
\end{bmatrix}`,
    preview: String.raw`<span class="ns-math">\(A=\begin{bmatrix}1&2\\3&4\end{bmatrix}\)</span>`,
  },
  set: {
    label: "Set notation",
    source: String.raw`P = \{x \in \mathbb{R}^n : Ax \le b\}`,
    preview: String.raw`<span class="ns-math">\(P=\{x\in\mathbb{R}^n:Ax\le b\}\)</span>`,
  },
});

function bind(element, eventName, handler, cleanups) {
  element?.addEventListener(eventName, handler);
  if (element) cleanups.push(() => element.removeEventListener(eventName, handler));
}

function mountTruthTable(root, announce) {
  const cleanups = [];
  const output = root.querySelector("[data-truth-output]");
  root.querySelectorAll("[data-truth-value]").forEach((button) => {
    bind(button, "click", () => {
      const value = button.dataset.truthValue;
      button.textContent = value;
      button.setAttribute("aria-pressed", "true");
      const message = button.dataset.truthMessage;
      output.textContent = message;
      output.dataset.tone = value === "False" ? "bad" : "good";
      announce?.(`${value}. ${message}`);
    }, cleanups);
  });
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function mountLinearStepper(root, announce, typesetMath, clearMath) {
  const cleanups = [];
  const steps = [...root.querySelectorAll("[data-proof-step]")];
  const progress = root.querySelector("[data-proof-progress]");
  const previous = root.querySelector("[data-proof-previous]");
  const next = root.querySelector("[data-proof-next]");
  const restart = root.querySelector("[data-proof-restart]");
  const assumption = root.querySelector("[data-proof-assumption]");
  const goal = root.querySelector("[data-proof-goal]");
  const solved = new Set();
  let index = 0;

  const render = ({ focus = false } = {}) => {
    steps.forEach((step, stepIndex) => step.toggleAttribute("hidden", stepIndex !== index));
    progress.textContent = `Move ${index + 1} of ${steps.length}`;
    previous.disabled = index === 0;
    next.disabled = index === steps.length - 1
      || (steps[index].hasAttribute("data-proof-question") && !solved.has(index));
    next.textContent = index === steps.length - 1 ? "Q.E.D. ■" : "Next move";
    if (assumption && goal) {
      clearMath?.([assumption, goal]);
      assumption.textContent = steps[index].dataset.proofAssume || "—";
      goal.textContent = steps[index].dataset.proofGoal || "—";
      void typesetMath?.([steps[index], assumption, goal]);
    }
    if (focus) steps[index].focus();
  };
  bind(previous, "click", () => { index = Math.max(0, index - 1); render({ focus: true }); }, cleanups);
  bind(next, "click", () => { index = Math.min(steps.length - 1, index + 1); render({ focus: true }); }, cleanups);
  bind(restart, "click", () => {
    index = 0;
    solved.clear();
    root.querySelectorAll("[data-proof-choice]").forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-pressed");
    });
    root.querySelectorAll("[data-proof-feedback]").forEach((feedback) => {
      clearMath?.([feedback]);
      feedback.textContent = "Choose an answer to unlock the next move.";
      feedback.dataset.tone = "";
    });
    render({ focus: true });
  }, cleanups);
  steps.forEach((step, stepIndex) => {
    const feedback = step.querySelector("[data-proof-feedback]");
    step.querySelectorAll("[data-proof-choice]").forEach((button) => {
      bind(button, "click", () => {
        const correct = button.hasAttribute("data-correct");
        const explanation = button.dataset.explanation || "";
        clearMath?.([feedback]);
        feedback.textContent = `${correct ? "Correct. " : "Not quite—try again. "}${explanation}`;
        feedback.dataset.tone = correct ? "good" : "bad";
        void typesetMath?.([feedback]);
        announce?.(feedback.textContent);
        if (!correct) return;
        solved.add(stepIndex);
        step.querySelectorAll("[data-proof-choice]").forEach((choice) => {
          choice.disabled = true;
          choice.setAttribute("aria-pressed", String(choice === button));
        });
        if (stepIndex === index) render();
      }, cleanups);
    });
  });
  render();
  announce?.("Guided proof ready. Use Next move to build the argument.");
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function mountDominoes(root, announce) {
  const cleanups = [];
  const button = root.querySelector("[data-domino-toggle]");
  const output = root.querySelector("[data-domino-output]");
  const dominoes = [...root.querySelectorAll("[data-domino]")];
  let fallen = false;
  const render = () => {
    dominoes.forEach((domino) => domino.classList.toggle("is-fallen", fallen));
    button.setAttribute("aria-pressed", String(fallen));
    button.textContent = fallen ? "Reset dominoes" : "Push the base case";
    output.textContent = fallen
      ? "Base case plus inductive step: every domino falls."
      : "The base case starts the chain; the inductive step links each case to the next.";
  };
  bind(button, "click", () => {
    fallen = !fallen;
    render();
    announce?.(output.textContent);
  }, cleanups);
  render();
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function mountStaircase(root, announce, typesetMath, clearMath) {
  const cleanups = [];
  const slider = root.querySelector("[data-stair-n]");
  const value = root.querySelector("[data-stair-value]");
  const svg = root.querySelector("[data-stair-svg]");
  const pairButton = root.querySelector("[data-stair-pair]");
  const result = root.querySelector("[data-stair-result]");
  let paired = false;

  const render = () => {
    const n = Number(slider.value);
    const size = Math.min(38, 420 / n, 215 / (n + 1));
    const startX = (520 - n * size) / 2;
    const baseY = 252;
    const blocks = [];
    for (let column = 0; column < n; column += 1) {
      for (let row = 0; row <= column; row += 1) {
        blocks.push(`<rect x="${startX + column * size}" y="${baseY - (row + 1) * size}" width="${size - 1}" height="${size - 1}" rx="2" class="l3-stair-primary"/>`);
      }
      if (paired) {
        for (let row = column + 1; row <= n; row += 1) {
          blocks.push(`<rect x="${startX + column * size}" y="${baseY - (row + 1) * size}" width="${size - 1}" height="${size - 1}" rx="2" class="l3-stair-pair"/>`);
        }
      }
    }
    svg.innerHTML = `<line x1="34" y1="252" x2="486" y2="252" class="l3-axis"/>${blocks.join("")}`;
    svg.setAttribute("aria-label", paired
      ? `Two paired staircases form a ${n} by ${n + 1} rectangle.`
      : `A staircase of ${n} columns contains one through ${n} blocks.`);
    value.textContent = String(n);
    pairButton.setAttribute("aria-pressed", String(paired));
    pairButton.textContent = paired ? "Show one staircase" : "Pair a second copy";
    const message = paired
      ? `Two copies contain ${n} times ${n + 1} blocks, so one contains half that number.`
      : `One staircase contains the sum from 1 through ${n} blocks.`;
    clearMath?.([result]);
    result.innerHTML = paired
      ? `Two copies contain \\(${n}(${n + 1})\\) blocks, so one contains \\(\\frac{${n}(${n + 1})}{2}\\).`
      : `One staircase contains \\(1+2+\\cdots+${n}\\) blocks.`;
    typesetMath?.([result]);
    return message;
  };
  bind(slider, "input", render, cleanups);
  bind(pairButton, "click", () => {
    paired = !paired;
    announce?.(render());
  }, cleanups);
  render();
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function isPrime(value) {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function firstFactor(value) {
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return divisor;
  }
  return value;
}

function mountCounterexample(root, announce, typesetMath, clearMath) {
  const cleanups = [];
  const slider = root.querySelector("[data-counter-n]");
  const nOutput = root.querySelector("[data-counter-n-output]");
  const valueOutput = root.querySelector("[data-counter-value]");
  const status = root.querySelector("[data-counter-status]");
  const render = () => {
    const n = Number(slider.value);
    const value = n * n + n + 41;
    const prime = isPrime(value);
    nOutput.value = String(n);
    valueOutput.value = String(value);
    clearMath?.([status]);
    if (prime) {
      status.textContent = `${value} is prime. This is evidence for the conjecture—not a proof.`;
      status.dataset.announcement = status.textContent;
      status.dataset.tone = "mid";
    } else {
      const factor = firstFactor(value);
      const message = `${value} equals ${factor} times ${value / factor}. Counterexample found; the universal claim is false.`;
      status.innerHTML = `\\(${value}=${factor}\\times${value / factor}\\). Counterexample found; the universal claim is false.`;
      typesetMath?.([status]);
      status.dataset.announcement = message;
      status.dataset.tone = "bad";
    }
  };
  bind(slider, "input", render, cleanups);
  bind(slider, "change", () => announce?.(status.dataset.announcement ?? status.textContent), cleanups);
  render();
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function mountTrainer(root, announce, typesetMath, clearMath) {
  const cleanups = [];
  const prompt = root.querySelector("[data-trainer-prompt]");
  const promptText = root.querySelector("[data-trainer-prompt-text]");
  const feedback = root.querySelector("[data-trainer-feedback]");
  const progress = root.querySelector("[data-trainer-progress]");
  const next = root.querySelector("[data-trainer-next]");
  const answerButtons = [...root.querySelectorAll("[data-trainer-answer]")];
  let index = 0;
  let answered = false;
  let score = 0;

  const render = () => {
    clearMath?.([promptText]);
    promptText.innerHTML = trainerQuestions[index].html;
    typesetMath?.([promptText]);
    feedback.textContent = "Choose the most natural first technique.";
    feedback.dataset.tone = "";
    progress.textContent = `Question ${index + 1} of ${trainerQuestions.length} · ${score} correct on the first try`;
    answered = false;
    answerButtons.forEach((button) => { button.disabled = false; });
  };
  answerButtons.forEach((button) => bind(button, "click", () => {
    const question = trainerQuestions[index];
    const correct = button.dataset.trainerAnswer === question.answer;
    if (!answered && correct) score += 1;
    answered = true;
    clearMath?.([feedback]);
    feedback.innerHTML = `${correct ? "Correct. " : "Try another choice. "}${question.whyHtml ?? question.why}`;
    typesetMath?.([feedback]);
    feedback.dataset.tone = correct ? "good" : "bad";
    progress.textContent = `Question ${index + 1} of ${trainerQuestions.length} · ${score} correct on the first try`;
    announce?.(`${correct ? "Correct. " : "Try another choice. "}${question.why}`);
  }, cleanups));
  bind(next, "click", () => {
    index = (index + 1) % trainerQuestions.length;
    render();
    prompt.focus();
  }, cleanups);
  render();
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function mountLatexTemplates(root, announce, typesetMath, clearMath) {
  const cleanups = [];
  const buttons = [...root.querySelectorAll("[data-latex-template]")];
  const source = root.querySelector("[data-latex-source]");
  const preview = root.querySelector("[data-latex-preview]");
  const error = root.querySelector("[data-latex-error]");
  let timer = 0;

  const mathSource = (value) => {
    const trimmed = value.trim();
    const align = trimmed.match(/^\\begin\{align\*?\}([\s\S]*)\\end\{align\*?\}$/);
    if (align) return `\\[\\begin{aligned}${align[1]}\\end{aligned}\\]`;
    const equation = trimmed.match(/^\\begin\{equation\*?\}([\s\S]*)\\end\{equation\*?\}$/);
    if (equation) return `\\[${equation[1]}\\]`;
    return `\\[${trimmed}\\]`;
  };

  const render = async () => {
    error.textContent = "";
    clearMath?.([preview]);
    preview.textContent = mathSource(source.value);
    const rendered = await typesetMath?.([preview]);
    if (rendered === false) error.textContent = "The preview could not be rendered. Check braces, environments, and commands.";
  };

  const activate = (button, { focus = false } = {}) => {
    const template = latexTemplates[button.dataset.latexTemplate];
    buttons.forEach((candidate) => {
      const selected = candidate === button;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    });
    source.value = template.source;
    void render();
    if (focus) button.focus();
    announce?.(`${template.label} selected.`);
  };
  const onKeydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = buttons.indexOf(event.currentTarget);
    const index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    activate(buttons[index], { focus: true });
  };
  buttons.forEach((button) => {
    bind(button, "click", () => activate(button), cleanups);
    bind(button, "keydown", onKeydown, cleanups);
  });
  bind(source, "input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => void render(), 350);
  }, cleanups);
  activate(buttons[0]);
  return () => {
    window.clearTimeout(timer);
    cleanups.splice(0).forEach((cleanup) => cleanup());
  };
}

export const styles = new URL("./lecture-03.css", import.meta.url).href;

export const slides = Object.freeze([
  {
    id: "l3-01",
    page: 1,
    title: "Proof Techniques & LaTeX",
    className: "native-title-slide",
    html: String.raw`
      <section class="l3-title" aria-labelledby="l3-title-heading">
        <p class="l3-kicker">ISE 5405 · Optimization I · Fall 2026</p>
        <h2 id="l3-title-heading">Proof Techniques &amp; LaTeX</h2>
        <p class="l3-title-subtitle">The reasoning and writing toolkit for everything that follows</p>
        <p><strong>Lecture 2</strong> · September 1, 2026</p>
        <div class="ns-title-shortcuts" aria-label="Presentation keyboard shortcuts">
          <span><kbd>→</kbd>/<kbd>Space</kbd> advance</span><span><kbd>←</kbd> back</span>
          <span><kbd>F</kbd> fullscreen</span><span><kbd>M</kbd> menu</span>
          <span><kbd>P</kbd> pen</span><span><kbd>E</kbd> eraser</span>
          <span><kbd>C</kbd> clear ink</span><span><kbd>L</kbd> laser</span>
          <span><kbd>W</kbd> whiteboard</span><span><kbd>H</kbd> handout</span>
          <span><kbd>K</kbd> checkpoint</span><span><kbd>?</kbd> help</span>
        </div>
        <p class="ns-title-handout"><strong>Saving an annotated PDF:</strong> press <kbd>H</kbd>, then print and choose “Save as PDF.” All reveals and saved slide ink are included. On iPad, use Share → Print → Save to Files; Export ink / Import ink moves annotations between devices.</p>
      </section>`,
  },
  {
    id: "l3-02",
    page: 2,
    title: "What is a Proof?",
    html: String.raw`
      <p class="l3-lead">A <strong>logical argument</strong> that establishes the truth of a mathematical statement.</p>
      <section class="l3-card" data-reveal="ingredients">
        <h3>A proof is built from</h3>
        <ul class="l3-grid-list">
          <li><strong>Definitions</strong><span>Precise meanings for every term.</span></li>
          <li><strong>Axioms</strong><span>Agreed starting points.</span></li>
          <li><strong>Known results</strong><span>Theorems, lemmas, and corollaries.</span></li>
          <li><strong>Rules of logic</strong><span>Valid ways to combine truths.</span></li>
        </ul>
      </section>
      <aside class="l3-callout" data-tone="orange" data-reveal="reader"><strong>Your weekly task:</strong> write a convincing argument for a skeptical—but fair—reader.</aside>`,
  },
  {
    id: "l3-03",
    page: 3,
    title: "Logic Warm-up: Implication",
    html: String.raw`
      <p class="l3-lead">Most statements we prove have the form <strong class="ns-math">\(P \Rightarrow Q\)</strong>: “if \(P\), then \(Q\).”</p>
      <section class="l3-card">
        <h3>Statement</h3><p><strong class="ns-math">\(P \Rightarrow Q\):</strong> If \(n\) is even, then \(n^2\) is even.</p>
      </section>
      <section class="l3-card" data-tone="green" data-reveal="contrapositive">
        <h3>Contrapositive—always equivalent</h3><p><strong class="ns-math">\(\neg Q \Rightarrow \neg P\):</strong> If \(n^2\) is odd, then \(n\) is odd.</p>
      </section>
      <div class="l3-two" data-reveal="contrast">
        <section class="l3-card" data-tone="orange"><h3>Converse—logically separate</h3><p><strong class="ns-math">\(Q \Rightarrow P\):</strong> If \(n^2\) is even, then \(n\) is even. It happens to be true, but needs its own proof.</p></section>
        <section class="l3-card" data-tone="orange"><h3>Negation trap</h3><p>The negation of “all \(x\) satisfy \(A\)” is “<em>some</em> \(x\) fails \(A\),” not “no \(x\) satisfies \(A\).”</p></section>
      </div>`,
  },
  {
    id: "l3-04",
    page: 4,
    title: "The Truth Table — Click Each Row",
    html: String.raw`
      <p>Think of <strong class="ns-math">\(P \Rightarrow Q\)</strong> as a promise: whenever \(P\) holds, \(Q\) holds too.</p>
      <table class="l3-truth-table">
        <caption>Truth values for an implication</caption>
        <thead><tr><th scope="col">\(P\)</th><th scope="col">\(Q\)</th><th scope="col">\(P \Rightarrow Q\)</th></tr></thead>
        <tbody>
          <tr><td>True</td><td>True</td><td><button type="button" data-truth-value="True" data-truth-message="P happened and Q followed: the promise was kept." aria-pressed="false">Reveal</button><span class="l3-print-truth">True</span></td></tr>
          <tr><td>True</td><td>False</td><td><button type="button" data-truth-value="False" data-truth-message="This is the only liar row: P happened, but Q did not." aria-pressed="false">Reveal</button><span class="l3-print-truth">False</span></td></tr>
          <tr><td>False</td><td>True</td><td><button type="button" data-truth-value="True" data-truth-message="P never happened, so the promise was not tested; it is vacuously true." aria-pressed="false">Reveal</button><span class="l3-print-truth">True</span></td></tr>
          <tr><td>False</td><td>False</td><td><button type="button" data-truth-value="True" data-truth-message="P again never happened, so the implication is vacuously true." aria-pressed="false">Reveal</button><span class="l3-print-truth">True</span></td></tr>
        </tbody>
      </table>
      <output class="l3-feedback" data-truth-output aria-live="polite">Choose a row to explain its truth value.</output>
      <div class="l3-two l3-truth-lessons">
        <aside class="l3-callout"><strong>Proof target:</strong> rule out one possibility—\(P\) true with \(Q\) false. So a direct proof may assume \(P\) and establish \(Q\).</aside>
        <aside class="l3-callout" data-tone="blue"><strong>Vacuous truth:</strong> if \(P\) is false, the promise is untested. Thus every element of the empty set is purple; empty feasible sets require care.</aside>
      </div>`,
    onMount: ({ slideElement, announce }) => mountTruthTable(slideElement, announce),
  },
  {
    id: "l3-05",
    page: 5,
    title: "Implication is Containment",
    html: String.raw`
      <div class="l3-text-visual">
        <div class="l3-stack">
          <section class="l3-card"><p><strong class="ns-math">\(P \Rightarrow Q\)</strong> says that everything satisfying \(P\) lies inside the set satisfying \(Q\).</p></section>
          <section class="l3-card" data-reveal="outside"><p>The <strong>contrapositive</strong> reads the same picture from outside: outside \(Q\) means outside \(P\).</p></section>
          <section class="l3-card" data-tone="orange" data-reveal="converse"><p>The <strong>converse</strong> swaps the sets. It is false here: 6 is even but not divisible by 4.</p></section>
        </div>
        <svg class="l3-figure" viewBox="0 0 560 340" role="img" aria-labelledby="l3-containment-title l3-containment-desc">
          <title id="l3-containment-title">Implication shown as nested sets</title>
          <desc id="l3-containment-desc">Numbers divisible by four form a set contained within the set of even numbers.</desc>
          <rect x="12" y="12" width="536" height="310" rx="18" class="l3-universe"/>
          <text x="30" y="44" class="l3-diagram-muted">all integers</text>
          <ellipse cx="285" cy="168" rx="220" ry="126" class="l3-set-q"/>
          <text x="342" y="78" class="l3-label-q">Q: n is even</text>
          <ellipse cx="225" cy="184" rx="108" ry="70" class="l3-set-p"/>
          <text x="156" y="189" class="l3-label-p">P: 4 divides n</text>
          <g data-reveal="outside"><circle cx="255" cy="214" r="8" class="l3-point-good"/><text x="272" y="219" class="l3-label-good">8: in P and Q</text><circle cx="494" cy="287" r="8" class="l3-point-bad"/><text x="336" y="314" class="l3-label-bad">7: outside Q, hence outside P</text></g>
          <g data-reveal="converse"><circle cx="400" cy="172" r="8" class="l3-point-bad"/><text x="416" y="177" class="l3-label-bad">6: in Q, not P</text></g>
        </svg>
      </div>`,
  },
  {
    id: "l3-06",
    page: 6,
    title: "Technique 1: Direct Proof",
    html: String.raw`
      <aside class="l3-callout"><strong>Idea:</strong> start from the assumptions and follow valid steps until the conclusion appears.</aside>
      <p class="l3-lead"><strong>Claim.</strong> If \(n\) is even, then \(n^2\) is even.</p>
      <section class="l3-proof" data-reveal="proof">
        <h3>Proof</h3>
        <p>Assume \(n\) is even, so \(n=2k\) for some integer \(k\). Then</p>
        <p class="l3-equation ns-math">\[n^2=(2k)^2=4k^2=2(2k^2).\]</p>
        <p>Because \(2k^2\) is an integer, \(n^2\) is twice an integer and therefore even. \(\square\)</p>
      </section>
      <ol class="l3-proof-chain" data-reveal="anatomy" aria-label="Anatomy of the direct proof">
        <li>unpack “even”</li><li>compute</li><li>factor out 2</li><li>repack “even”</li>
      </ol>`,
  },
  {
    id: "l3-07",
    page: 7,
    title: "Technique 2: Proof by Contrapositive",
    checkpoint: checkpointContrapositive,
    html: String.raw`
      <aside class="l3-callout"><strong>Idea:</strong> to prove \(P \Rightarrow Q\), prove the equivalent statement \(\neg Q \Rightarrow \neg P\).</aside>
      <p class="l3-lead"><strong>Claim.</strong> If \(n^2\) is odd, then \(n\) is odd.</p>
      <section class="l3-proof" data-reveal="proof">
        <h3>Proof</h3>
        <p>The contrapositive is: “if \(n\) is even, then \(n^2\) is even.” We just proved that statement directly. Therefore the original claim holds. \(\square\)</p>
      </section>
      <aside class="l3-card" data-tone="orange" data-reveal="when"><strong>Reach for it when</strong> \(\neg Q\) is easier to express than \(P\)—for example, “even = \(2k\)” is friendlier than “odd.”</aside>`,
  },
  {
    id: "l3-08",
    page: 8,
    title: "Technique 3: Proof by Contradiction",
    html: String.raw`
      <div class="l3-text-visual">
        <div class="l3-stack">
          <aside class="l3-callout"><strong>Idea:</strong> assume the statement is false, derive an impossibility, and conclude it must be true.</aside>
          <ul><li>Especially useful for non-existence and irrationality claims.</li><li>Common in LP: “suppose \(x^*\) were not optimal; then a better feasible point would exist…”</li></ul>
        </div>
        <ol class="l3-contradiction-flow" aria-label="Contradiction proof flow">
          <li>Assume \(S\) is false</li>
          <li data-reveal="logic">Take valid logical steps</li>
          <li data-tone="bad" data-reveal="impossible">Reach an impossibility \(\bot\)</li>
          <li data-tone="good" data-reveal="conclude">Therefore \(S\) is true</li>
        </ol>
      </div>`,
  },
  {
    id: "l3-09",
    page: 9,
    title: "Building the Proof: √2 is Irrational",
    html: String.raw`
      <p class="l3-kicker">Proof workshop · build one justified move at a time</p>
      <div class="l3-proof-state" aria-label="Current proof state">
        <span><strong>Assumptions</strong><output data-proof-assumption aria-live="polite">—</output></span>
        <span><strong>To show</strong><output data-proof-goal aria-live="polite">—</output></span>
      </div>
      <ol class="l3-proof-steps" aria-live="polite">
        <li data-proof-step data-proof-question tabindex="-1">
          <h3>Which tool fits a non-existence claim?</h3>
          <div class="l3-choice-grid" role="group" aria-label="Choose a proof technique">
            <button type="button" data-proof-choice data-explanation="A direct proof would have to construct an object, but the claim says no such object exists.">Direct construction</button>
            <button type="button" data-proof-choice data-correct data-explanation="Nothing can be constructed, so assume the forbidden fraction exists and destroy that hypothetical world.">Proof by contradiction</button>
            <button type="button" data-proof-choice data-explanation="Induction applies to a ladder of statements indexed by \(n\); there is no such ladder here.">Induction</button>
          </div>
          <output class="l3-feedback" data-proof-feedback aria-live="polite">Choose an answer to unlock the next move.</output>
          <p class="l3-print-answer"><strong>Answer:</strong> contradiction.</p>
        </li>
        <li data-proof-step data-proof-assume="\(\sqrt2=p/q\) with \(\gcd(p,q)=1\)" data-proof-goal="a contradiction" tabindex="-1"><strong>Plant the tripwire.</strong> Assume \(\sqrt{2}=p/q\) with \(p,q\in\mathbb{Z}\), \(q\ne0\), and \(\gcd(p,q)=1\). Choosing lowest terms costs nothing and gives the condition we will contradict.</li>
        <li data-proof-step data-proof-assume="\(\sqrt2=p/q\) with \(\gcd(p,q)=1\)" data-proof-goal="a contradiction" tabindex="-1"><strong>Clear the fraction.</strong> Squaring gives \(2=p^2/q^2\), hence \(p^2=2q^2\), so \(p^2\) is even.</li>
        <li data-proof-step data-proof-question data-proof-assume="\(p^2=2q^2\)" data-proof-goal="justify that \(p\) is even" tabindex="-1">
          <h3>Does our earlier result already prove that \(p\) is even?</h3>
          <div class="l3-choice-grid" role="group" aria-label="Check the implication direction">
            <button type="button" data-proof-choice data-explanation="That would reverse the implication. We proved \(p\text{ even}\Rightarrow p^2\text{ even}\), not its converse.">Yes—apply “even \(p\) gives even \(p^2\)” backward</button>
            <button type="button" data-proof-choice data-correct data-explanation="Exactly. The needed direction \(p^2\text{ even}\Rightarrow p\text{ even}\) is the converse and needs its own proof.">No—the needed converse requires a lemma</button>
            <button type="button" data-proof-choice data-explanation="If \(p\) were odd, \(p^2\) would be odd, contradicting \(p^2=2q^2\).">\(p\) must be odd</button>
          </div>
          <output class="l3-feedback" data-proof-feedback aria-live="polite">Choose an answer to unlock the next move.</output>
          <p class="l3-print-answer"><strong>Answer:</strong> prove the converse via its contrapositive.</p>
        </li>
        <li data-proof-step data-proof-assume="\(p^2=2q^2\)" data-proof-goal="a contradiction" tabindex="-1"><strong>Prove the missing lemma.</strong> If \(p=2k+1\), then \(p^2=4k^2+4k+1=2(2k^2+2k)+1\), which is odd. Thus, by contrapositive, \(p^2\) even \(\Rightarrow p\) even.</li>
        <li data-proof-step data-proof-assume="\(\sqrt2=p/q\), \(\gcd(p,q)=1\), \(p=2k\)" data-proof-goal="a contradiction" tabindex="-1"><strong>Feed the lemma back.</strong> Write \(p=2k\). Then \(4k^2=2q^2\), so \(q^2=2k^2\).</li>
        <li data-proof-step data-proof-question data-proof-assume="\(p\text{ even}\) and \(q^2=2k^2\)" data-proof-goal="locate the contradiction" tabindex="-1">
          <h3>Where is the contradiction hiding?</h3>
          <div class="l3-choice-grid" role="group" aria-label="Locate the contradiction">
            <button type="button" data-proof-choice data-correct data-explanation="Apply the lemma to \(q\): it is even too. Then \(p\) and \(q\) share a factor of 2, contradicting lowest terms.">\(q\) is also even—impossible with \(\gcd(p,q)=1\)</button>
            <button type="button" data-proof-choice data-explanation="The new variable \(k\) is harmless; the pressure is on \(q\) through the same even-square lemma.">Something is wrong with \(k\)</button>
            <button type="button" data-proof-choice data-explanation="Every algebra step is valid. The impossibility is a consequence of the assumption, which is exactly how contradiction works.">An algebra step must be wrong</button>
          </div>
          <output class="l3-feedback" data-proof-feedback aria-live="polite">Choose an answer to unlock the next move.</output>
          <p class="l3-print-answer"><strong>Answer:</strong> \(q\) is even, contradicting \(\gcd(p,q)=1\).</p>
        </li>
        <li data-proof-step data-proof-assume="\(p,q\text{ both even}\)" data-proof-goal="DONE—contradiction reached" tabindex="-1"><strong>Conclude.</strong> Both \(p\) and \(q\) are even, contradicting \(\gcd(p,q)=1\). Therefore no such fraction exists and \(\sqrt{2}\) is irrational. \(\square\)</li>
      </ol>
      <div class="l3-step-controls" aria-label="Guided proof controls">
        <button type="button" data-proof-previous>Previous move</button>
        <span data-proof-progress aria-live="polite"></span>
        <button type="button" data-proof-next>Next move</button>
        <button type="button" data-proof-restart>Restart</button>
      </div>
      <aside class="l3-callout" data-tone="orange"><strong>Craft matters:</strong> choosing lowest terms plants exactly the condition the contradiction will violate.</aside>`,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountLinearStepper(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l3-10",
    page: 10,
    title: "Technique 4: Proof by Induction",
    html: String.raw`
      <div class="l3-text-visual">
        <div class="l3-stack">
          <aside class="l3-callout"><strong>Idea:</strong> prove a statement for every \(n\in\mathbb{N}\) by setting up a chain of dominoes.</aside>
          <section class="l3-card" data-reveal="base"><h3>1 · Base case</h3><p>Show the first domino falls: \(S(1)\) is true.</p></section>
          <section class="l3-card" data-reveal="step"><h3>2 · Inductive step</h3><p>For an arbitrary \(k\ge1\), prove \(S(k)\Rightarrow S(k+1)\).</p></section>
          <aside class="l3-card" data-tone="orange" data-reveal="step"><strong>Common bug:</strong> the step must work for every allowed \(k\), not merely after a hidden threshold.</aside>
          <p class="l3-small" data-reveal="uses"><strong>Where it returns:</strong> correctness of iterative algorithms—including simplex pivots—recursive structures, and improving bounds.</p>
        </div>
        <div class="l3-domino-widget">
        <svg class="l3-figure" viewBox="0 0 560 330" role="img" aria-labelledby="l3-domino-title l3-domino-desc">
          <title id="l3-domino-title">Induction as a row of dominoes</title><desc id="l3-domino-desc">The base case starts the chain; the inductive step links each case to the next.</desc>
          <line x1="35" y1="274" x2="525" y2="274" class="l3-axis"/>
          <g data-reveal="base"><rect data-domino style="--domino-index:0" x="58" y="146" width="42" height="128" rx="6" class="l3-domino l3-domino-first"/><text x="79" y="305" class="l3-domino-label">1</text><text x="34" y="112" class="l3-label-p">base</text><path d="M68 122L76 140" class="l3-arrow"/></g>
          <g data-reveal="step">
            <rect data-domino style="--domino-index:1" x="128" y="146" width="42" height="128" rx="6" class="l3-domino"/><rect data-domino style="--domino-index:2" x="198" y="146" width="42" height="128" rx="6" class="l3-domino"/><rect data-domino style="--domino-index:3" x="268" y="146" width="42" height="128" rx="6" class="l3-domino"/><rect data-domino style="--domino-index:4" x="338" y="146" width="42" height="128" rx="6" class="l3-domino"/><rect data-domino style="--domino-index:5" x="408" y="146" width="42" height="128" rx="6" class="l3-domino"/>
            <text x="149" y="305" class="l3-domino-label">2</text><text x="219" y="305" class="l3-domino-label">3</text><text x="289" y="305" class="l3-domino-label">4</text><text x="359" y="305" class="l3-domino-label">5</text><text x="429" y="305" class="l3-domino-label">…</text>
            <path d="M105 210H122 M175 210H192 M245 210H262 M315 210H332 M385 210H402" class="l3-arrow"/>
            <text x="281" y="104" class="l3-label-q">S(k) ⇒ S(k + 1)</text>
          </g>
        </svg>
        <button type="button" data-domino-toggle aria-pressed="false">Push the base case</button>
        <output class="l3-feedback" data-domino-output aria-live="polite"></output>
        </div>
      </div>`,
    onMount: ({ slideElement, announce }) => mountDominoes(slideElement, announce),
  },
  {
    id: "l3-11",
    page: 11,
    title: "Click-through: ∑ᵢ₌₁ⁿ i = n(n+1)/2",
    titleHtml: String.raw`Click-through: \(\sum_{i=1}^{n} i=\frac{n(n+1)}{2}\)`,
    html: String.raw`
      <ol class="l3-cumulative-proof" aria-label="Cumulative induction proof">
        <li><strong>1 · Target.</strong><span>\(S(n):\displaystyle \sum_{i=1}^{n}i=\frac{n(n+1)}{2}\).</span></li>
        <li data-reveal="1"><strong>2 · Base case.</strong><span>For \(n=1\), \(\mathrm{LHS}=1=\frac{1\cdot2}{2}=\mathrm{RHS}\). \(\checkmark\)</span></li>
        <li data-reveal="2"><strong>3 · Assume.</strong><span>For an arbitrary \(k\ge1\), assume \(\displaystyle \sum_{i=1}^{k}i=\frac{k(k+1)}{2}\).</span></li>
        <li data-reveal="3"><strong>4 · Peel the last term.</strong><span>\(\displaystyle \sum_{i=1}^{k+1}i=\sum_{i=1}^{k}i+(k+1)=\frac{k(k+1)}{2}+(k+1)\).</span></li>
        <li data-reveal="4"><strong>5 · Factor and match.</strong><span>\(\displaystyle \frac{k(k+1)}{2}+(k+1)=\frac{(k+1)(k+2)}{2}\), exactly \(S(k+1)\). \(\square\)</span></li>
      </ol>
      <p class="l3-small l3-muted">Advance once per proof step; each earlier line remains visible.</p>`,
  },
  {
    id: "l3-12",
    page: 12,
    title: "Why 1+2+⋯+n = n(n+1)/2",
    titleHtml: String.raw`Why \(1+2+\cdots+n=\frac{n(n+1)}{2}\)`,
    html: String.raw`
      <div class="l3-text-visual">
        <section class="l3-widget">
          <svg data-stair-svg class="l3-staircase" viewBox="0 0 520 290" role="img" aria-label="A six-column staircase of blocks">
            <line x1="34" y1="252" x2="486" y2="252" class="l3-axis"/>
            <path d="M140 220h32v32h-32zm32-32h32v64h-32zm32-32h32v96h-32zm32-32h32v128h-32zm32-32h32v160h-32zm32-32h32v192h-32z" class="l3-stair-primary"/>
          </svg>
          <label class="l3-range-label">Staircase size \(n=\) <output data-stair-value>6</output><input type="range" min="3" max="10" value="6" data-stair-n></label>
          <button type="button" data-stair-pair aria-pressed="false">Pair a second copy</button>
        </section>
        <div class="l3-stack">
          <section class="l3-card"><p>The sum \(1+2+\cdots+n\) is a staircase of blocks.</p></section>
          <section class="l3-card" data-tone="orange"><p>A flipped copy fills the gaps to make an \(n\times(n+1)\) rectangle.</p></section>
          <section class="l3-card" data-tone="green"><p>Therefore \(2(1+\cdots+n)=n(n+1)\); divide by 2.</p></section>
          <p class="l3-small l3-muted">The induction proof verifies the identity; this picture explains why it is true.</p>
          <output class="l3-feedback" data-stair-result aria-live="polite">One staircase contains \(1+2+\cdots+6\) blocks.</output>
        </div>
      </div>`,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountStaircase(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l3-13",
    page: 13,
    title: "Disproving: One Counterexample Suffices",
    html: String.raw`
      <div class="l3-text-visual">
        <div class="l3-stack">
          <aside class="l3-callout"><strong>Idea:</strong> to disprove a claim about every \(n\), exhibit one \(n\) where it fails.</aside>
          <p><strong>Conjecture.</strong> For every integer \(n\ge1\), \(n^2+n+41\) is prime.</p>
          <p>It works for \(n=1,2,\ldots,39\). Thirty-nine confirmations are still evidence—not proof.</p>
          <aside class="l3-card" data-tone="orange"><strong>One verified failure is a complete disproof.</strong></aside>
        </div>
        <section class="l3-widget">
          <label class="l3-range-label">Test \(n=\) <output data-counter-n-output>40</output><input type="range" min="1" max="50" value="40" data-counter-n></label>
          <p class="l3-equation"><span class="ns-math">\(n^2+n+41=\)</span> <output data-counter-value>1681</output></p>
          <output class="l3-feedback" data-counter-status data-tone="bad" aria-live="polite">\(1681=41\times41\). Counterexample found; the universal claim is false.</output>
          <p class="l3-small l3-muted">Move the slider back below 40 to see how long the pattern survives.</p>
        </section>
      </div>`,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountCounterexample(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l3-14",
    page: 14,
    title: "The Toolkit at a Glance",
    checkpoint: checkpointEvidence,
    html: String.raw`
      <table class="l3-toolkit-table">
        <caption>Five proof techniques and when to use them</caption>
        <thead><tr><th scope="col">Technique</th><th scope="col">Recipe</th><th scope="col">Reach for it when…</th></tr></thead>
        <tbody>
          <tr><th scope="row">Direct</th><td>unpack → compute → repack</td><td>a constructive path exists</td></tr>
          <tr><th scope="row">Contrapositive</th><td>prove \(\neg Q\Rightarrow\neg P\)</td><td>\(\neg Q\) is friendlier than \(P\)</td></tr>
          <tr><th scope="row">Contradiction</th><td>assume false → impossible</td><td>non-existence, irrationality, optimality</td></tr>
          <tr><th scope="row">Induction</th><td>base case + inductive step</td><td>claims are indexed by \(n\)</td></tr>
          <tr><th scope="row">Counterexample</th><td>find one verified failure</td><td>disproving a universal claim</td></tr>
        </tbody>
      </table>
      <aside class="l3-callout" data-tone="orange"><strong>Next skill:</strong> identifying the natural first technique before writing any algebra.</aside>`,
  },
  {
    id: "l3-15",
    page: 15,
    title: "Proof-Technique Trainer",
    html: String.raw`
      <p id="l3-trainer-prompt" class="l3-trainer-prompt" data-trainer-prompt tabindex="-1"><span class="l3-trainer-prompt-text" data-trainer-prompt-text>For every \(n\ge1\): \(1+3+\cdots+(2n-1)=n^2\).</span></p>
      <div class="l3-answer-grid" role="group" aria-labelledby="l3-trainer-prompt">
        <button type="button" data-trainer-answer="direct">Direct</button>
        <button type="button" data-trainer-answer="contrapositive">Contrapositive</button>
        <button type="button" data-trainer-answer="contradiction">Contradiction</button>
        <button type="button" data-trainer-answer="induction">Induction</button>
        <button type="button" data-trainer-answer="counterexample">Counterexample</button>
      </div>
      <output class="l3-feedback" data-trainer-feedback aria-live="polite">Choose the most natural first technique.</output>
      <div class="l3-trainer-footer"><button type="button" data-trainer-next>Next question</button><span data-trainer-progress>Question 1 of 8</span></div>
      <ol class="l3-trainer-bank" aria-label="Complete trainer question bank">
        ${trainerQuestions.map((question) => `<li>${question.html} <strong>Answer:</strong> ${question.answer}.</li>`).join("")}
      </ol>`,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountTrainer(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l3-16",
    page: 16,
    title: "Proofs Meet LP: a First Optimization Proof",
    html: String.raw`
      <section class="l3-card">
        <h3>Claim</h3>
        <p>For a minimization ILP, let \(Z_{\mathrm{LP}}\) be the LP-relaxation optimum and \(Z_{\mathrm{IP}}\) the integer optimum. Then \(Z_{\mathrm{LP}}\le Z_{\mathrm{IP}}\). If an LP optimum \(x^*\) is integral, it is also ILP-optimal.</p>
      </section>
      <ol class="l3-lp-proof">
        <li data-reveal="sets"><strong>Compare feasible sets.</strong> Every ILP-feasible point remains LP-feasible after integrality is dropped. The LP minimizes over a larger set, so \(Z_{\mathrm{LP}}\le Z_{\mathrm{IP}}\).</li>
        <li data-reveal="integral"><strong>Use integrality.</strong> If LP optimizer \(x^*\) is integral, it is ILP-feasible; therefore \(Z_{\mathrm{IP}}\le c^\top x^*=Z_{\mathrm{LP}}\).</li>
        <li data-reveal="conclusion"><strong>Close the bounds.</strong> Both inequalities force \(Z_{\mathrm{IP}}=Z_{\mathrm{LP}}=c^\top x^*\), so \(x^*\) is ILP-optimal. \(\square\)</li>
      </ol>
      <aside class="l3-callout" data-tone="orange"><strong>Why it matters:</strong> this two-bound proof is a foundation of branch-and-bound.</aside>`,
  },
  {
    id: "l3-17",
    page: 17,
    title: "Part II — What is LaTeX?",
    checkpoint: checkpointTechnique,
    html: String.raw`
      <div class="l3-text-visual">
        <div class="l3-stack">
          <ul class="l3-large-list">
            <li>A typesetting system built for mathematics, proofs, and scientific documents.</li>
            <li>Plain text plus markup produces professional, reproducible PDFs.</li>
            <li>Standard across mathematics, computing, engineering, and research.</li>
            <li><strong>Required for homework in this course.</strong></li>
          </ul>
          <aside class="l3-callout"><strong>Why?</strong> Reliable equation layout, numbering, references, and consistent structure make precise writing easier to audit.</aside>
        </div>
        <section class="l3-code-demo" aria-label="LaTeX source and rendered result">
          <p><strong>This source</strong></p>
          <pre><code>\sum_{i=1}^n i = \frac{n(n+1)}{2}</code></pre>
          <p><strong>expresses</strong></p>
          <p class="l3-equation ns-math">\[\sum_{i=1}^{n}i=\frac{n(n+1)}{2}\]</p>
        </section>
      </div>`,
  },
  {
    id: "l3-18",
    page: 18,
    title: "Structure of a LaTeX Document",
    html: String.raw`
      <div class="l3-text-visual l3-code-layout">
        <pre class="l3-code"><code>\documentclass{article}
\usepackage{amsmath, amssymb, amsthm}

\begin{document}

Hello! Inline math: $a^2+b^2=c^2$.

\[
  \min\; c^\top x
  \quad\text{s.t.}\; Ax \ge b
\]

\end{document}</code></pre>
        <div class="l3-stack">
          <section class="l3-card"><h3>Preamble</h3><p>Document class, packages, and reusable macros—everything before <code>\begin{document}</code>.</p></section>
          <section class="l3-card"><h3>Body</h3><p>Text, math, sections, figures, tables, and proofs.</p></section>
          <ul><li>Inline math: <code>$...$</code></li><li>Displayed math: <code>\[...\]</code></li><li>Comments begin with <code>%</code></li></ul>
          <aside class="l3-callout"><strong>Useful packages:</strong> <code>amsmath</code>, <code>amssymb</code>, <code>amsthm</code>, <code>bm</code>, <code>graphicx</code>, <code>booktabs</code>, <code>hyperref</code>.</aside>
        </div>
      </div>`,
  },
  {
    id: "l3-19",
    page: 19,
    title: "Overleaf: LaTeX in the Browser",
    html: String.raw`
      <div class="l3-overleaf-layout">
        <p class="l3-lead">Overleaf is a browser-based LaTeX editor: no local installation is required, and its free tier is enough for the course workflow.</p>
        <ul class="l3-grid-list">
          <li><strong>Write and compile</strong><span>Edit source, choose Recompile, inspect the PDF.</span></li>
          <li><strong>Collaborate</strong><span>Share a project and edit in real time.</span></li>
          <li><strong>Start from templates</strong><span>Homework, papers, Beamer slides, and CVs.</span></li>
          <li><strong>History &amp; integrations</strong><span>Recover versions and connect GitHub or Dropbox when needed.</span></li>
        </ul>
        <div class="l3-stack l3-overleaf-start">
          <section class="l3-card"><h3>First project</h3><p>Create account → New Project → Blank Project → write → <strong>Recompile</strong>.</p></section>
          <aside class="l3-callout"><strong>Learn the log:</strong> the left panel’s files, errors, and warnings point back to source lines. Start with the first real error.</aside>
        </div>
      </div>`,
  },
  {
    id: "l3-20",
    page: 20,
    title: "Displayed Math: equation vs align",
    html: String.raw`
      <div class="l3-text-visual l3-code-layout">
        <div class="l3-stack">
          <section><h3>One numbered equation</h3><pre class="l3-code"><code>\begin{equation}
  \min\; c^\top x
  \quad \text{s.t.}\; Ax \ge b
\end{equation}</code></pre></section>
          <section><h3>Several aligned lines</h3><pre class="l3-code"><code>\begin{align}
  Ax &amp;= b \label{eq:cons}\\
  x  &amp;\ge 0
\end{align}</code></pre></section>
        </div>
        <div class="l3-stack">
          <ul><li>In <code>align</code>, place <code>&amp;</code> at the alignment point.</li><li>Use <code>align*</code> or <code>\nonumber</code> to suppress numbering.</li><li>Refer to a numbered line with <code>\eqref{eq:cons}</code>.</li><li>Use <code>\left(...\right)</code> for scalable delimiters.</li></ul>
          <aside class="l3-callout" data-tone="orange"><strong>Rule of thumb:</strong> put a multi-line derivation in <code>align</code> and line up the relation symbols.</aside>
          <p class="l3-small"><strong>Frequent symbols:</strong> <code>\mathbb{R}</code>, <code>\mathbb{Z}</code>, <code>\le</code>, <code>\ge</code>, <code>\sum</code>, <code>\top</code>, <code>\forall</code>, <code>\exists</code>.</p>
        </div>
      </div>`,
  },
  {
    id: "l3-21",
    page: 21,
    title: "Live LaTeX Playground",
    html: String.raw`
      <p class="l3-small">Type LaTeX math below: the semantic preview updates live. Use the templates as editable starting points, then copy the source into Overleaf for full document compilation.</p>
      <div class="l3-tabs" role="tablist" aria-label="LaTeX examples">
        <button type="button" role="tab" data-latex-template="lp">LP template</button>
        <button type="button" role="tab" data-latex-template="sum">Induction sum</button>
        <button type="button" role="tab" data-latex-template="matrix">Matrix</button>
        <button type="button" role="tab" data-latex-template="set">Set notation</button>
      </div>
      <div class="l3-text-visual l3-playground">
        <section class="l3-code-demo"><label for="l3-latex-source"><strong>LaTeX source</strong></label><textarea id="l3-latex-source" class="l3-code l3-latex-editor" data-latex-source spellcheck="false">\begin{align}
\min_{x \in \mathbb{R}^n}\quad &amp; c^\top x \\
\text{s.t.}\quad &amp; Ax \le b, \\
&amp; x \ge 0
\end{align}</textarea></section>
        <section class="l3-code-demo"><h3>Rendered output</h3><div class="l3-preview ns-math" data-latex-preview aria-live="polite">\[\begin{aligned}\min_x\quad & c^\top x\\ \text{s.t.}\quad & Ax\le b,\\ &x\ge0\end{aligned}\]</div><output class="l3-latex-error" data-latex-error aria-live="assertive"></output><p class="l3-small l3-muted">Try changing <code>\le</code> to <code>\ge</code>, adding a line with <code>\\</code>, and aligning on <code>&amp;</code>.</p></section>
      </div>`,
    onMount: ({ slideElement, announce, typesetMath, clearMath }) =>
      mountLatexTemplates(slideElement, announce, typesetMath, clearMath),
  },
  {
    id: "l3-22",
    page: 22,
    title: "Theorems & Proofs in LaTeX",
    html: String.raw`
      <div class="l3-text-visual l3-code-layout">
        <pre class="l3-code"><code>% preamble: \usepackage{amsthm}
\newtheorem{theorem}{Theorem}
\newtheorem{lemma}{Lemma}

\begin{lemma}
If $n$ is even, then $n^2$ is even.
\end{lemma}

\begin{proof}
Write $n=2k$. Then
$n^2=4k^2=2(2k^2)$,
so $n^2$ is even.
\end{proof}</code></pre>
        <div class="l3-stack">
          <section class="l3-card"><h3>Expected homework structure</h3><p>State the claim in a <code>theorem</code> or <code>lemma</code> environment; put the argument in <code>proof</code>. The proof environment supplies the QED box.</p></section>
          <section class="l3-card"><h3>Reusable macros</h3><pre class="l3-code"><code>\newcommand{\R}{\mathbb{R}}
\newcommand{\vect}[1]{\mathbf{#1}}</code></pre><p>Now <code>\R^n</code> produces \(\mathbb{R}^n\) and <code>\vect{x}</code> produces \(\mathbf{x}\).</p></section>
        </div>
      </div>`,
  },
  {
    id: "l3-23",
    page: 23,
    title: "Debugging LaTeX (You Will Need This)",
    html: String.raw`
      <table class="l3-debug-table">
        <caption>Common compiler messages and likely fixes</caption>
        <thead><tr><th scope="col">Message</th><th scope="col">Start here</th></tr></thead>
        <tbody><tr><th scope="row"><code>Undefined control sequence</code></th><td>Check spelling and required packages.</td></tr><tr><th scope="row"><code>Missing $ inserted</code></th><td>Move math-only syntax into math mode.</td></tr><tr><th scope="row"><code>Runaway argument</code></th><td>Look for an unmatched brace.</td></tr><tr><th scope="row"><code>File not found</code></th><td>Check the filename, extension, and path.</td></tr></tbody>
      </table>
      <ol class="l3-debug-process">
        <li><strong>Read the first error</strong> in the log.</li><li><strong>Bisect</strong> by commenting out blocks.</li><li><strong>Cut early</strong> with a temporary <code>\end{document}</code>.</li><li><strong>Minimize</strong> to a short example that still fails.</li>
      </ol>
      <aside class="l3-callout"><strong>Course boundary:</strong> AI help with LaTeX mechanics is allowed; the mathematical reasoning and submitted work must still be yours.</aside>`,
  },
  {
    id: "l3-24",
    page: 24,
    title: "Wrap-up & Practice",
    html: String.raw`
      <div class="l3-two">
        <section class="l3-card"><h3>Proof toolkit</h3><ul><li>Direct—unpack, compute, repack.</li><li>Contrapositive—flip and negate.</li><li>Contradiction—assume false, demolish.</li><li>Induction—base plus step.</li><li>Counterexample—one failure disproves.</li></ul></section>
        <section class="l3-card" data-tone="orange"><h3>Before next class</h3><ol><li>Create an Overleaf account and compile an <code>align</code> block.</li><li>Typeset a theorem and proof: the sum of two even integers is even.</li><li>Revisit any trainer questions you missed.</li></ol></section>
      </div>
      <div class="l3-next"><strong>Next: the geometry of polyhedra</strong><span>where corners become theorems</span></div>`,
  },
]);

export const metadata = Object.freeze({
  id: "lecture-03",
  number: 3,
  title: "Proof Techniques & LaTeX",
  subtitle: "Lecture 2 · ISE 5405: Optimization I",
  course: "ISE 5405 · Optimization I",
  date: "2026-09-01",
  aspectRatio: "16:9",
  theme: "virginia-tech",
  homeUrl: "../../",
  pdfUrl: "../../materials/lecture_03.pdf",
  whiteboards: 7,
});

export const deck = Object.freeze({
  schemaVersion: 1,
  id: metadata.id,
  number: metadata.number,
  title: metadata.title,
  metadata,
  styles,
  slides,
});

export default deck;
