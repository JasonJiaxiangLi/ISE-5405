/**
 * Lecture 04 native-slide content.
 *
 * This module mirrors the instructional sequence of the private faculty
 * reference deck while using only the course site's original native runtime,
 * semantic HTML, and inline SVG. The reference framework and assets are not
 * dependencies of this file.
 */

const checkpointConvexity = Object.freeze({
  id: "l4-checkpoint-convexity",
  question: "Which of these sets is NOT convex?",
  choices: [
    "A halfspace \\(\\{x:a^\\top x\\ge b\\}\\)",
    "A line segment",
    "A five-pointed star",
    "The intersection of two convex sets",
  ],
  correct_index: 2,
  explanation:
    "A star has dents: choose points on different arms and part of their segment leaves the set. Halfspaces, line segments, and intersections of convex sets are convex.",
  autoOpen: true,
});

const checkpointExtreme = Object.freeze({
  id: "l4-checkpoint-extreme",
  question: "To prove \\(x\\in P\\) is not an extreme point, you must…",
  choices: [
    "Show every pair \\(y,z\\in P\\) has \\(x\\) between them",
    "Exhibit \\(y,z\\in P\\setminus\\{x\\}\\) and \\(\\lambda\\in[0,1]\\) with \\(x=\\lambda y+(1-\\lambda)z\\)",
    "Show \\(x\\) is not optimal for any cost vector",
    "Show fewer than \\(n\\) constraints exist",
  ],
  correct_index: 1,
  explanation:
    "Not extreme is an existence statement. One valid pair of distinct points \\(y\\) and \\(z\\), together with a convex-combination weight \\(\\lambda\\), is enough to disprove extremality.",
  autoOpen: true,
});

const checkpointFiniteness = Object.freeze({
  id: "l4-checkpoint-finiteness",
  question: "With \\(m\\) constraints in \\(\\mathbb{R}^n\\), the number of basic solutions is at most…",
  choices: ["\\(mn\\)", "\\(2^m\\)", "\\(\\binom{m}{n}\\)", "It can be infinite"],
  correct_index: 2,
  explanation:
    "A basic solution needs \\(n\\) linearly independent active constraints chosen from the \\(m\\) available. There are \\(\\binom{m}{n}\\) such choices, and each choice determines at most one point.",
  autoOpen: true,
});

function svgPoint(svg, event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function pointOnSegment(point, start, end, tolerance = 5) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]) <= tolerance;
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared));
  return Math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy)) <= tolerance;
}

function pointInPolygon(point, polygon) {
  if (polygon.some((start, index) => pointOnSegment(point, start, polygon[(index + 1) % polygon.length], 2.5))) return true;
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const [xi, yi] = polygon[index];
    const [xj, yj] = polygon[previous];
    if ((yi > point[1]) !== (yj > point[1])
      && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function mountConvexityTester({ slideElement, announce }) {
  const buttons = [...slideElement.querySelectorAll("[data-l4-shape]")];
  const drawings = [...slideElement.querySelectorAll("[data-l4-shape-drawing]")];
  const output = slideElement.querySelector("[data-l4-shape-output]");
  const svg = slideElement.querySelector("[data-l4-convexity-svg]");
  const samples = slideElement.querySelector("[data-l4-shape-samples]");
  const endpoints = slideElement.querySelector("[data-l4-shape-endpoints]");
  const cursor = slideElement.querySelector("[data-l4-shape-cursor]");
  const shapes = {
    pentagon: [[110, 270], [80, 130], [255, 48], [480, 95], [515, 265]],
    star: [[300, 34], [349, 139], [465, 103], [396, 203], [486, 276], [365, 252], [300, 304], [235, 252], [114, 276], [204, 203], [135, 103], [251, 139]],
    ell: [[105, 55], [275, 55], [275, 195], [500, 195], [500, 285], [105, 285]],
  };
  const presets = {
    pentagon: [[155, 220], [440, 135]],
    star: [[156, 116], [444, 116]],
    ell: [[165, 100], [445, 245]],
  };
  let key = "pentagon";
  let points = [];
  let cursorPoint = [...presets.pentagon[0]];

  const renderCursor = () => {
    cursor.setAttribute("cx", String(cursorPoint[0]));
    cursor.setAttribute("cy", String(cursorPoint[1]));
  };

  const drawTest = (shouldAnnounce = true) => {
    endpoints.innerHTML = points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11"/>`).join("");
    if (points.length < 2) {
      samples.innerHTML = "";
      output.textContent = points.length === 1 ? "Now choose a second point inside the region." : "Choose two points inside the region.";
      return;
    }
    let allInside = true;
    const dots = [];
    for (let step = 0; step <= 50; step += 1) {
      const t = step / 50;
      const x = points[0][0] + t * (points[1][0] - points[0][0]);
      const y = points[0][1] + t * (points[1][1] - points[0][1]);
      const inside = pointInPolygon([x, y], shapes[key]);
      allInside &&= inside;
      dots.push(`<circle cx="${x}" cy="${y}" r="3.8" class="${inside ? "l4-test-inside" : "l4-test-outside"}"/>`);
    }
    samples.innerHTML = dots.join("");
    output.textContent = allInside
      ? "The entire segment stays inside—this pair is consistent with convexity."
      : "The segment leaves the set. This one pair is a complete counterexample to convexity.";
    output.dataset.tone = allInside ? "good" : "bad";
    if (shouldAnnounce) announce(output.textContent);
  };

  const select = (shapeKey, shouldAnnounce = true) => {
    // The preset is a keyboard-accessible representative pair; pointer users
    // may immediately replace it by choosing any two points in the region.
    key = shapeKey;
    points = presets[key].map((point) => [...point]);
    cursorPoint = [...points[0]];
    renderCursor();
    buttons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.l4Shape === key)),
    );
    drawings.forEach((drawing) =>
      drawing.toggleAttribute("hidden", drawing.dataset.l4ShapeDrawing !== key),
    );
    drawTest(shouldAnnounce);
  };
  const onClick = (event) => {
    key = event.currentTarget.dataset.l4Shape;
    select(key);
  };
  const chooseCandidate = (candidate) => {
    if (!pointInPolygon(candidate, shapes[key])) {
      output.textContent = "That point is outside the selected region. Choose a point inside it.";
      output.dataset.tone = "bad";
      announce(output.textContent);
      return;
    }
    if (points.length >= 2) points = [];
    points.push(candidate);
    drawTest();
  };
  const onPointerDown = (event) => {
    const point = svgPoint(svg, event);
    cursorPoint = [point.x, point.y];
    renderCursor();
    chooseCandidate(cursorPoint);
  };
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseCandidate([...cursorPoint]);
      return;
    }
    const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!delta) return;
    event.preventDefault();
    const step = event.shiftKey ? 18 : 6;
    cursorPoint = [
      Math.max(8, Math.min(592, cursorPoint[0] + delta[0] * step)),
      Math.max(8, Math.min(322, cursorPoint[1] + delta[1] * step)),
    ];
    renderCursor();
  };
  buttons.forEach((button) => button.addEventListener("click", onClick));
  svg.addEventListener("pointerdown", onPointerDown);
  svg.addEventListener("keydown", onKeyDown);
  select("pentagon", false);

  return () => {
    buttons.forEach((button) => button.removeEventListener("click", onClick));
    svg.removeEventListener("pointerdown", onPointerDown);
    svg.removeEventListener("keydown", onKeyDown);
  };
}

function mountPolyhedronBuilder({ slideElement, announce }) {
  const add = slideElement.querySelector("[data-l4-halfspace-add]");
  const reset = slideElement.querySelector("[data-l4-halfspace-reset]");
  const region = slideElement.querySelector("[data-l4-poly-region]");
  const cutLine = slideElement.querySelector("[data-l4-poly-cut]");
  const vertices = slideElement.querySelector("[data-l4-poly-vertices]");
  const emptyLabel = slideElement.querySelector("[data-l4-poly-empty]");
  const output = slideElement.querySelector("[data-l4-poly-output]");
  const cuts = [[1, 1, 560], [-6, -11, -1860], [3, -13, -180], [9, -5, 2520], [-1, 8, 1780], [-12, 5, -480]];
  let step = 0;

  const clip = (polygon, [a, b, rhs]) => {
    const clipped = [];
    polygon.forEach((point, index) => {
      const nextPoint = polygon[(index + 1) % polygon.length];
      const value = a * point[0] + b * point[1] - rhs;
      const nextValue = a * nextPoint[0] + b * nextPoint[1] - rhs;
      const inside = value <= 1e-9;
      const nextInside = nextValue <= 1e-9;
      if (inside) clipped.push(point);
      if (inside !== nextInside) {
        const ratio = value / (value - nextValue);
        clipped.push([
          point[0] + ratio * (nextPoint[0] - point[0]),
          point[1] + ratio * (nextPoint[1] - point[1]),
        ]);
      }
    });
    return clipped;
  };

  const lineEndpoints = ([a, b, rhs]) => {
    const candidates = [];
    if (Math.abs(b) > 1e-9) {
      candidates.push([0, rhs / b], [450, (rhs - 450 * a) / b]);
    }
    if (Math.abs(a) > 1e-9) {
      candidates.push([rhs / a, 0], [(rhs - 300 * b) / a, 300]);
    }
    const inBox = candidates.filter(([x, y]) => x >= 0 && x <= 450 && y >= 0 && y <= 300);
    const unique = inBox.filter((point, index) => !inBox.slice(0, index)
      .some((other) => Math.hypot(point[0] - other[0], point[1] - other[1]) < 1e-6));
    return unique.slice(0, 2);
  };

  const render = (shouldAnnounce = true) => {
    let polygon = [[5, 5], [445, 5], [445, 295], [5, 295]];
    for (let index = 0; index < step; index += 1) polygon = clip(polygon, cuts[index]);
    region.setAttribute("points", polygon.map((point) => point.join(",")).join(" "));
    region.toggleAttribute("hidden", polygon.length === 0);
    emptyLabel.toggleAttribute("hidden", polygon.length !== 0);
    const trueVertices = polygon.filter(([x, y]) => x > 6 && x < 444 && y > 6 && y < 294);
    vertices.innerHTML = trueVertices.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join("");
    if (step > 0) {
      const endpoints = lineEndpoints(cuts[step - 1]);
      if (endpoints.length === 2) {
        cutLine.setAttribute("x1", String(endpoints[0][0]));
        cutLine.setAttribute("y1", String(endpoints[0][1]));
        cutLine.setAttribute("x2", String(endpoints[1][0]));
        cutLine.setAttribute("y2", String(endpoints[1][1]));
        cutLine.removeAttribute("hidden");
      } else cutLine.setAttribute("hidden", "");
    } else cutLine.setAttribute("hidden", "");
    output.textContent = step === 0
      ? "0 halfspaces · start with the whole plane"
      : `${step} ${step === 1 ? "halfspace" : "halfspaces"} · ${trueVertices.length} ${trueVertices.length === 1 ? "corner" : "corners"}`;
    add.disabled = step === cuts.length;
    reset.disabled = step === 0;
    if (shouldAnnounce) announce(output.textContent);
  };
  const onAdd = () => {
    step = Math.min(cuts.length, step + 1);
    render();
  };
  const onReset = () => {
    step = 0;
    render();
  };
  add.addEventListener("click", onAdd);
  reset.addEventListener("click", onReset);
  render(false);

  return () => {
    add.removeEventListener("click", onAdd);
    reset.removeEventListener("click", onReset);
  };
}

function symmetricWitness(point, direction, polygon) {
  const centroid = polygon.reduce((sum, vertex) => [sum[0] + vertex[0], sum[1] + vertex[1]], [0, 0])
    .map((value) => value / polygon.length);
  let lower = -Infinity;
  let upper = Infinity;
  polygon.forEach((start, index) => {
    const end = polygon[(index + 1) % polygon.length];
    const edge = [end[0] - start[0], end[1] - start[1]];
    const cross = (left, right) => left[0] * right[1] - left[1] * right[0];
    const interior = cross(edge, [centroid[0] - start[0], centroid[1] - start[1]]);
    const sign = interior >= 0 ? 1 : -1;
    const base = sign * cross(edge, [point[0] - start[0], point[1] - start[1]]);
    const coefficient = sign * cross(edge, direction);
    if (Math.abs(coefficient) < 1e-9) return;
    const bound = -base / coefficient;
    if (coefficient > 0) lower = Math.max(lower, bound);
    else upper = Math.min(upper, bound);
  });
  const radius = Math.min(upper, -lower) * 0.78;
  if (!Number.isFinite(radius) || radius <= 1e-6) return null;
  return {
    y: [point[0] + radius * direction[0], point[1] + radius * direction[1]],
    z: [point[0] - radius * direction[0], point[1] - radius * direction[1]],
  };
}

function mountExtremePointTester({ slideElement, announce }) {
  const buttons = [...slideElement.querySelectorAll("[data-l4-point]")];
  const svg = slideElement.querySelector("[data-l4-extreme-svg]");
  const marker = slideElement.querySelector("[data-l4-point-marker]");
  const label = slideElement.querySelector("[data-l4-point-label]");
  const witnessSegment = slideElement.querySelector("[data-l4-point-witness-segment]");
  const witnessY = slideElement.querySelector("[data-l4-point-witness='y']");
  const witnessZ = slideElement.querySelector("[data-l4-point-witness='z']");
  const witnessLabelY = slideElement.querySelector("[data-l4-point-witness-label='y']");
  const witnessLabelZ = slideElement.querySelector("[data-l4-point-witness-label='z']");
  const cursor = slideElement.querySelector("[data-l4-point-cursor]");
  const output = slideElement.querySelector("[data-l4-point-output]");
  const polygon = [[92, 270], [135, 112], [310, 48], [505, 92], [470, 268], [265, 302]];
  let cursorPoint = [310, 48];

  const renderCursor = () => {
    cursor.setAttribute("cx", String(cursorPoint[0]));
    cursor.setAttribute("cy", String(cursorPoint[1]));
  };

  const display = (point, witnesses, message, shouldAnnounce = true) => {
    buttons.forEach((button) =>
      button.setAttribute("aria-pressed", "false"),
    );
    marker.setAttribute("cx", String(point[0]));
    marker.setAttribute("cy", String(point[1]));
    label.setAttribute("x", String(Math.min(525, point[0] + 17)));
    label.setAttribute("y", String(Math.max(25, point[1] - 14)));
    label.textContent = witnesses ? "x · not extreme" : "x · extreme";
    const hasWitnesses = Boolean(witnesses);
    [witnessSegment, witnessY, witnessZ, witnessLabelY, witnessLabelZ].forEach((element) =>
      element.toggleAttribute("hidden", !hasWitnesses),
    );
    if (hasWitnesses) {
      const { y, z } = witnesses;
      witnessSegment.setAttribute("x1", String(y[0]));
      witnessSegment.setAttribute("y1", String(y[1]));
      witnessSegment.setAttribute("x2", String(z[0]));
      witnessSegment.setAttribute("y2", String(z[1]));
      witnessY.setAttribute("cx", String(y[0]));
      witnessY.setAttribute("cy", String(y[1]));
      witnessZ.setAttribute("cx", String(z[0]));
      witnessZ.setAttribute("cy", String(z[1]));
      witnessLabelY.setAttribute("x", String(y[0] + 11));
      witnessLabelY.setAttribute("y", String(y[1] - 10));
      witnessLabelZ.setAttribute("x", String(z[0] + 11));
      witnessLabelZ.setAttribute("y", String(z[1] - 10));
    }
    output.textContent = message;
    output.dataset.tone = witnesses ? "bad" : "good";
    if (shouldAnnounce) announce(message);
  };

  const classify = (point, shouldAnnounce = true) => {
    const vertex = polygon.find((candidate) => Math.hypot(candidate[0] - point[0], candidate[1] - point[1]) <= 17);
    if (vertex) {
      display(vertex, null, "Extreme point: a polygon corner cannot be a nontrivial midpoint of two other feasible points.", shouldAnnounce);
      return;
    }
    if (!pointInPolygon(point, polygon)) {
      output.textContent = "That point is outside P. Extremeness is defined only for points of P.";
      output.dataset.tone = "bad";
      if (shouldAnnounce) announce(output.textContent);
      return;
    }
    let direction = [1, 0.31];
    for (let index = 0; index < polygon.length; index += 1) {
      const start = polygon[index];
      const end = polygon[(index + 1) % polygon.length];
      if (!pointOnSegment(point, start, end, 7)) continue;
      const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
      direction = [(end[0] - start[0]) / length, (end[1] - start[1]) / length];
      break;
    }
    const witnesses = symmetricWitness(point, direction, polygon);
    display(point, witnesses, "Not extreme: the displayed feasible points y and z are distinct and satisfy x = ½y + ½z.", shouldAnnounce);
  };

  const presets = { corner: [310, 48], edge: [222.5, 80], interior: [300, 190] };
  const select = (key, shouldAnnounce = true) => {
    cursorPoint = [...presets[key]];
    renderCursor();
    classify(cursorPoint, shouldAnnounce);
    buttons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.l4Point === key)),
    );
  };
  const onClick = (event) => select(event.currentTarget.dataset.l4Point);
  const onPointerDown = (event) => {
    const point = svgPoint(svg, event);
    cursorPoint = [point.x, point.y];
    renderCursor();
    classify(cursorPoint);
  };
  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      classify([...cursorPoint]);
      return;
    }
    const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!delta) return;
    event.preventDefault();
    const step = event.shiftKey ? 18 : 6;
    cursorPoint = [
      Math.max(8, Math.min(592, cursorPoint[0] + delta[0] * step)),
      Math.max(8, Math.min(322, cursorPoint[1] + delta[1] * step)),
    ];
    renderCursor();
  };
  buttons.forEach((button) => button.addEventListener("click", onClick));
  svg.addEventListener("pointerdown", onPointerDown);
  svg.addEventListener("keydown", onKeyDown);
  select("corner", false);

  return () => {
    buttons.forEach((button) => button.removeEventListener("click", onClick));
    svg.removeEventListener("pointerdown", onPointerDown);
    svg.removeEventListener("keydown", onKeyDown);
  };
}

function mountGuidedWorkshop({ slideElement, announce, typesetMath, clearMath }) {
  const steps = [...slideElement.querySelectorAll("[data-l4-workshop-step]")];
  const stage = slideElement.querySelector(".l4-workshop-stage");
  const previous = slideElement.querySelector("[data-l4-workshop-previous]");
  const next = slideElement.querySelector("[data-l4-workshop-next]");
  const restart = slideElement.querySelector("[data-l4-workshop-restart]");
  const progress = slideElement.querySelector("[data-l4-workshop-progress]");
  const assumption = slideElement.querySelector("[data-l4-workshop-assumption]");
  const goal = slideElement.querySelector("[data-l4-workshop-goal]");
  const storageKey = `ise5405:proof-workshop:lecture-04:${slideElement.dataset.slideId}:v1`;
  const cleanups = [];
  const readProgress = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  };
  const savedProgress = readProgress();
  const solved = new Set(
    Array.isArray(savedProgress?.solved)
      ? savedProgress.solved.filter((stepIndex) => Number.isInteger(stepIndex)
        && stepIndex >= 0 && stepIndex < steps.length)
      : [],
  );
  let index = Number.isInteger(savedProgress?.index)
    ? Math.max(0, Math.min(steps.length - 1, savedProgress.index))
    : 0;

  const listen = (element, eventName, handler) => {
    element.addEventListener(eventName, handler);
    cleanups.push(() => element.removeEventListener(eventName, handler));
  };
  const saveProgress = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ index, solved: [...solved] }));
    } catch {
      // The workshop remains fully usable when storage is unavailable.
    }
  };
  const keepCurrentInView = () => {
    requestAnimationFrame(() => {
      if (!stage?.isConnected) return;
      const current = steps[index];
      const stageRect = stage.getBoundingClientRect();
      const currentRect = current.getBoundingClientRect();
      if (currentRect.top < stageRect.top) stage.scrollTop -= stageRect.top - currentRect.top;
      else if (currentRect.bottom > stageRect.bottom) {
        stage.scrollTop += currentRect.bottom - stageRect.bottom;
      }
    });
  };
  const render = ({ focus = false, scroll = false } = {}) => {
    steps.forEach((step, stepIndex) => {
      const isQuestion = step.hasAttribute("data-l4-question");
      const visible = isQuestion ? stepIndex === index : stepIndex <= index;
      step.toggleAttribute("hidden", !visible);
      step.classList.toggle("l4-workshop-current", stepIndex === index);
      if (stepIndex === index) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    });
    progress.textContent = `Move ${index + 1} of ${steps.length}`;
    previous.disabled = index === 0;
    next.disabled = index === steps.length - 1
      || (steps[index].hasAttribute("data-l4-question") && !solved.has(index));
    next.textContent = index === steps.length - 1 ? "Q.E.D. ■" : "Next move";
    clearMath?.([assumption, goal]);
    // Use text, not HTML: decoded data attributes can contain literal `<`
    // inequalities, which innerHTML would misread as a tag and truncate.
    assumption.textContent = steps[index].dataset.l4Assume || "—";
    goal.textContent = steps[index].dataset.l4Goal || "—";
    // MathJax may skip future workshop steps during the deck's initial pass.
    // Typeset the newly visible step while leaving completed proof steps in
    // the bounded history, matching Robert's cumulative workshop sequence.
    void typesetMath?.([steps[index], assumption, goal]);
    if (focus) {
      steps[index].focus({ preventScroll: true });
    }
    if (focus || scroll) keepCurrentInView();
    saveProgress();
  };

  steps.forEach((step, stepIndex) => {
    const feedback = step.querySelector("[data-l4-workshop-feedback]");
    if (solved.has(stepIndex)) {
      const correctChoice = step.querySelector("[data-l4-workshop-choice][data-correct]");
      if (feedback && correctChoice) {
        feedback.textContent = `Correct. ${correctChoice.dataset.explanation || ""}`;
        feedback.dataset.tone = "good";
        step.querySelectorAll("[data-l4-workshop-choice]").forEach((choice) => {
          choice.disabled = true;
          choice.setAttribute("aria-pressed", String(choice === correctChoice));
        });
      }
    }
    step.querySelectorAll("[data-l4-workshop-choice]").forEach((button) => {
      listen(button, "click", () => {
        const correct = button.hasAttribute("data-correct");
        clearMath?.([feedback]);
        feedback.textContent = `${correct ? "Correct. " : "Not quite—try again. "}${button.dataset.explanation || ""}`;
        feedback.dataset.tone = correct ? "good" : "bad";
        void typesetMath?.([feedback]);
        announce(feedback.textContent);
        if (!correct) return;
        solved.add(stepIndex);
        step.querySelectorAll("[data-l4-workshop-choice]").forEach((choice) => {
          choice.disabled = true;
          choice.setAttribute("aria-pressed", String(choice === button));
        });
        if (stepIndex === index) render();
      });
    });
  });
  listen(previous, "click", () => { index = Math.max(0, index - 1); render({ focus: true }); });
  listen(next, "click", () => { index = Math.min(steps.length - 1, index + 1); render({ focus: true }); });
  listen(restart, "click", () => {
    index = 0;
    solved.clear();
    slideElement.querySelectorAll("[data-l4-workshop-choice]").forEach((button) => {
      button.disabled = false;
      button.removeAttribute("aria-pressed");
    });
    slideElement.querySelectorAll("[data-l4-workshop-feedback]").forEach((feedback) => {
      clearMath?.([feedback]);
      feedback.textContent = "Choose an answer to unlock the next move.";
      feedback.dataset.tone = "";
    });
    if (stage) stage.scrollTop = 0;
    render({ focus: true });
  });
  render({ scroll: index > 0 });
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

export const styles = new URL("./lecture-04.css", import.meta.url).href;

export const slides = [
  {
    id: "l4-01",
    page: 1,
    title: "The Geometry of Linear Programming I",
    eyebrow: "ISE 5405 · Lecture 3",
    className: "l4-title-slide",
    html: String.raw`
      <div class="l4-title-content">
        <svg class="l4-title-art" viewBox="0 0 520 300" role="img" aria-labelledby="l4-title-art-title l4-title-art-desc">
          <title id="l4-title-art-title">A polygon and its corner points</title>
          <desc id="l4-title-art-desc">A six-sided convex polygon with every corner emphasized.</desc>
          <defs>
            <linearGradient id="l4-title-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#e87722" stop-opacity=".24" />
              <stop offset="1" stop-color="#861f41" stop-opacity=".34" />
            </linearGradient>
          </defs>
          <polygon points="55,225 135,65 285,42 445,116 405,245 210,275" fill="url(#l4-title-gradient)" stroke="#861f41" stroke-width="6" />
          <g fill="#861f41">
            <circle cx="55" cy="225" r="10" /><circle cx="135" cy="65" r="10" />
            <circle cx="285" cy="42" r="10" /><circle cx="445" cy="116" r="10" />
            <circle cx="405" cy="245" r="10" /><circle cx="210" cy="275" r="10" />
          </g>
        </svg>
        <p class="l4-lead">Polyhedra, convexity, and three equivalent definitions of a corner point</p>
        <p><strong>ISE 5405 · Optimization I</strong> · September 3, 2026</p>
        <p class="l4-muted">Bertsimas–Tsitsiklis, §§2.1–2.2</p>
        <div class="ns-title-shortcuts" aria-label="Presentation keyboard shortcuts">
          <span><kbd>→</kbd>/<kbd>Space</kbd> advance</span><span><kbd>←</kbd> back</span>
          <span><kbd>F</kbd> fullscreen</span><span><kbd>M</kbd> menu</span>
          <span><kbd>P</kbd> pen</span><span><kbd>E</kbd> eraser</span>
          <span><kbd>C</kbd> clear ink</span><span><kbd>L</kbd> laser</span>
          <span><kbd>W</kbd> whiteboard</span><span><kbd>H</kbd> handout</span>
          <span><kbd>K</kbd> checkpoint</span><span><kbd>?</kbd> help</span>
        </div>
        <p class="ns-title-handout"><strong>Saving an annotated PDF:</strong> press <kbd>H</kbd>, then print and choose “Save as PDF.” All reveals and saved slide ink are included. On iPad, use Share → Print → Save to Files; Export ink / Import ink moves annotations between devices.</p>
      </div>`,
  },
  {
    id: "l4-02",
    page: 2,
    title: "Where We're Headed (Ch. 2)",
    html: String.raw`
      <div class="l4-stack l4-fill">
        <section class="l4-route" aria-label="Chapter 2 route">
          <article class="l4-card" data-tone="maroon">
            <p class="l4-kicker">Today · §§2.1–2.2</p>
            <h3>Build the playground</h3>
            <p>Polyhedra as intersections of halfspaces, convexity, and three equivalent definitions of a corner.</p>
          </article>
          <article class="l4-card" data-tone="blue">
            <p class="l4-kicker">Next lecture · §§2.3–2.8</p>
            <h3>Use the corners</h3>
            <p>Standard form, degeneracy, when corners exist, and why an optimum can be found at one.</p>
          </article>
        </section>
        <aside class="l4-callout" data-tone="orange">
          <strong>Chapter 1 showed optima at corners.</strong> Chapter 2 proves why corners matter and gives the simplex method its playground.
        </aside>
        <aside class="l4-callout">
          Definitions, contradiction, and careful “for every / there exists” reasoning from Lecture 2 all return today.
        </aside>
      </div>`,
  },
  {
    id: "l4-03",
    page: 3,
    title: "The General Optimization Problem",
    html: String.raw`
      <div class="l4-stack l4-fill">
        <div class="l4-equation ns-math" role="math" aria-label="Minimize f of x subject to x belonging to S">
          \[\begin{aligned}\min_x\quad & f(x)\\ \text{s.t.}\quad &x\in S\end{aligned}\]
        </div>
        <p class="l4-center l4-muted">Here \(f:\mathbb{R}^n\to\mathbb{R}\) and \(S\subseteq\mathbb{R}^n\).</p>
        <section class="l4-outcomes" aria-label="Three common outcomes">
          <article class="l4-card"><h3>Infeasible</h3><p>\(S=\varnothing\).</p></article>
          <article class="l4-card"><h3>Unbounded</h3><p>For every \(K\), some \(x\in S\) has \(f(x)&lt;K\).</p></article>
          <article class="l4-card"><h3>Optimal solution</h3><p>Some \(x^*\in S\) satisfies \(f(x^*)\le f(x)\) for every \(x\in S\).</p></article>
        </section>
        <aside class="l4-callout" data-tone="orange" data-reveal="pathology">
          <strong>General problems can escape all three labels.</strong> For minimizing \(e^x\) over \(\mathbb{R}\), the infimum is 0 but no point attains it: the problem is feasible, not unbounded below, and has no optimizer.
        </aside>
        <aside class="l4-callout" data-tone="green" data-reveal="lp-promise">
          <strong>LPs are better behaved:</strong> their trichotomy is exact. We use minimization and \(Ax\ge b\) to align with the broader language of convex optimization.
        </aside>
      </div>`,
  },
  {
    id: "l4-04",
    page: 4,
    title: "Local vs Global Optima",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card">
            <h3>Global optimum</h3>
            <p>\(f(x^*)\le f(x)\) for every \(x\in S\).</p>
          </section>
          <section class="l4-card">
            <h3>Local optimum</h3>
            <p>\(x^*\) only has to beat feasible neighbors within some distance \(\varepsilon&gt;0\).</p>
          </section>
          <aside class="l4-callout" data-tone="orange" data-reveal="linear">
            <strong>For LPs, local means global.</strong> A linear objective has one downhill direction everywhere; it cannot create an isolated trap.
          </aside>
        </div>
        <figure class="l4-figure-card">
          <svg class="l4-figure" viewBox="0 0 620 370" role="img" aria-labelledby="l4-local-title l4-local-desc">
            <title id="l4-local-title">Local and global minima compared with a linear objective</title>
            <desc id="l4-local-desc">A nonlinear curve has one local minimum and a lower global minimum. A straight objective line, revealed with its direction arrow, has no such local trap.</desc>
            <path data-l4-objective-curve d="M55 92 C115 190 165 214 225 145 C286 73 333 267 412 285 C483 302 535 164 575 72" fill="none" stroke="#27658a" stroke-width="7" />
            <circle data-l4-extremum="local" cx="158.806" cy="184.425" r="11" fill="#e87722" />
            <path d="M179 96 L161 172" stroke="#9e4e15" stroke-width="3" />
            <rect x="92" y="54" width="175" height="42" rx="8" fill="#fff8f1" stroke="#e87722" stroke-width="2" />
            <text x="179" y="81" text-anchor="middle" fill="#8b4513" font-size="19" font-weight="700">local, not global</text>
            <circle data-l4-extremum="global" cx="423.945" cy="286.433" r="11" fill="#25834a" />
            <rect x="333" y="309" width="190" height="42" rx="8" fill="#f1faf4" stroke="#25834a" stroke-width="2" />
            <text x="428" y="336" text-anchor="middle" fill="#176536" font-size="19" font-weight="700">global minimum</text>
            <g data-reveal="linear">
              <line x1="72" y1="312" x2="565" y2="119" stroke="#861f41" stroke-width="6" />
              <line x1="485" y1="154" x2="438" y2="214" stroke="#861f41" stroke-width="5" />
              <path d="M438 214 L445 194 L456 205 Z" fill="#861f41" />
              <rect x="332" y="18" width="258" height="44" rx="8" fill="#faeaf0" stroke="#861f41" stroke-width="2" />
              <text x="461" y="47" text-anchor="middle" fill="#701a36" font-size="18" font-weight="700">one downhill direction everywhere</text>
            </g>
          </svg>
          <figcaption>Nonlinear objectives can have traps; linear objectives cannot.</figcaption>
        </figure>
      </div>
      <aside class="l4-property-strip" data-reveal="linear">
        LPs earn three facts: exact outcome trichotomy · every local optimum is global · a nonempty polytope has an optimal corner.
      </aside>`,
  },
  {
    id: "l4-05",
    page: 5,
    title: "Convex Sets",
    eyebrow: "The shape property behind everything",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card" data-tone="maroon">
            <h3>Definition</h3>
            <p>A set \(S\) is <strong>convex</strong> if, for every \(y,z\in S\) and \(\lambda\in[0,1]\),</p>
            <div class="l4-equation ns-math" role="math">\[\lambda y+(1-\lambda)z\in S.\]</div>
            <p>The entire segment between any two points stays inside.</p>
          </section>
          <ul class="l4-list" data-reveal="consequences">
            <li>\(\lambda\) slides from \(z\) at 0 to \(y\) at 1.</li>
            <li>Intersections of convex sets remain convex.</li>
            <li>Halfspaces are convex, so every polyhedron is convex.</li>
          </ul>
        </div>
        <section class="l4-widget" aria-labelledby="l4-shape-prompt">
          <h3 id="l4-shape-prompt">Convexity tester</h3>
          <p class="l4-small">Choose a region, then select any two points. Keyboard: focus the diagram, move the dashed cursor with Arrow keys (Shift = faster), and press Enter or Space; buttons load representative pairs.</p>
          <div class="l4-button-row" role="group" aria-label="Choose a region">
            <button type="button" data-l4-shape="pentagon" aria-pressed="true">Pentagon</button>
            <button type="button" data-l4-shape="star" aria-pressed="false">Star</button>
            <button type="button" data-l4-shape="ell" aria-pressed="false">L-shape</button>
          </div>
          <svg class="l4-figure l4-shape-figure l4-interactive-figure" data-l4-convexity-svg viewBox="0 0 600 330" role="img" tabindex="0" aria-labelledby="l4-shape-title l4-shape-desc">
            <title id="l4-shape-title">Convexity examples</title>
            <desc id="l4-shape-desc">The selected region contains two points and the segment connecting them. For nonconvex examples, part of the segment lies outside.</desc>
            <g data-l4-shape-drawing="pentagon">
              <polygon points="110,270 80,130 255,48 480,95 515,265" fill="#e9f2f8" stroke="#27658a" stroke-width="7" />
            </g>
            <g data-l4-shape-drawing="star" hidden>
              <polygon points="300,34 349,139 465,103 396,203 486,276 365,252 300,304 235,252 114,276 204,203 135,103 251,139" fill="#fff0e3" stroke="#e87722" stroke-width="7" />
            </g>
            <g data-l4-shape-drawing="ell" hidden>
              <polygon points="105,55 275,55 275,195 500,195 500,285 105,285" fill="#f0e6ed" stroke="#861f41" stroke-width="7" />
            </g>
            <g data-l4-shape-samples aria-hidden="true"></g>
            <g data-l4-shape-endpoints class="l4-test-endpoints" aria-hidden="true"></g>
            <circle data-l4-shape-cursor class="l4-keyboard-cursor" cx="155" cy="220" r="13" aria-hidden="true" />
          </svg>
          <p class="l4-widget-output" data-l4-shape-output role="status" aria-live="polite"></p>
        </section>
      </div>`,
    onMount: mountConvexityTester,
  },
  {
    id: "l4-06",
    page: 6,
    title: "Hyperplanes & Halfspaces (Def. 2.3)",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card">
            <p>For nonzero \(a\in\mathbb{R}^n\) and scalar \(b\):</p>
            <dl class="l4-def-list">
              <div><dt>Hyperplane</dt><dd>\(\{x:a^\top x=b\}\)</dd></div>
              <div><dt>Halfspace</dt><dd>\(\{x:a^\top x\ge b\}\)</dd></div>
            </dl>
            <p class="l4-small">A hyperplane is a line in \(\mathbb{R}^2\) and a plane in \(\mathbb{R}^3\).</p>
          </section>
          <ul class="l4-list" data-reveal="facts">
            <li>The hyperplane is the boundary of its halfspace.</li>
            <li>A hyperplane is the intersection of two opposing halfspaces.</li>
            <li>The vector \(a\) is perpendicular to the hyperplane.</li>
          </ul>
        </div>
        <figure class="l4-figure-card">
          <svg class="l4-figure" viewBox="0 0 620 390" role="img" aria-labelledby="l4-half-title l4-half-desc">
            <title id="l4-half-title">A hyperplane and one of its halfspaces</title>
            <desc id="l4-half-desc">A diagonal boundary line separates a shaded satisfying halfspace from the other side. The normal vector a is perpendicular to the line.</desc>
            <polygon points="52,375 535,28 610,28 610,375" fill="#f4e5eb" />
            <line x1="52" y1="375" x2="535" y2="28" stroke="#861f41" stroke-width="7" />
            <rect x="372" y="294" width="180" height="46" rx="8" fill="#fff" stroke="#861f41" stroke-width="2" />
            <text x="462" y="324" text-anchor="middle" fill="#701a36" font-size="23" font-weight="700">aᵀx ≥ b</text>
            <rect x="70" y="72" width="175" height="46" rx="8" fill="#fff" stroke="#999" stroke-width="2" />
            <text x="157" y="102" text-anchor="middle" fill="#555" font-size="23">aᵀx &lt; b</text>
            <rect x="305" y="52" width="185" height="44" rx="8" fill="#fff" stroke="#861f41" stroke-width="2" />
            <text x="397" y="81" text-anchor="middle" fill="#701a36" font-size="21" font-weight="700">aᵀx = b</text>
            <line x1="300" y1="198" x2="363.09" y2="285.82" stroke="#27658a" stroke-width="7" />
            <path d="M363.09 285.82 L340.1 272.7 L359.1 258.9 Z" fill="#27658a" />
            <rect x="370" y="214" width="92" height="44" rx="8" fill="#fff" stroke="#27658a" stroke-width="2" />
            <text x="416" y="243" text-anchor="middle" fill="#1f5575" font-size="23" font-weight="700">normal a</text>
          </svg>
        </figure>
      </div>`,
  },
  {
    id: "l4-07",
    page: 7,
    title: "Polyhedra (Def. 2.1): Intersections of Halfspaces",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card" data-tone="maroon">
            <h3>Definition</h3>
            <p>A <strong>polyhedron</strong> is any set</p>
            <div class="l4-equation ns-math" role="math">\[\{x\in\mathbb{R}^n:Ax\ge b\},\]</div>
            <p>the intersection of finitely many halfspaces.</p>
          </section>
          <ul class="l4-list" data-reveal="consequences">
            <li>Every LP feasible set is a polyhedron.</li>
            <li>Standard form is included: equalities are pairs of inequalities.</li>
            <li>Every polyhedron is convex.</li>
          </ul>
          <aside class="l4-callout" data-tone="orange" data-reveal="polytope">
            A <strong>bounded polyhedron</strong>—one that fits inside a sufficiently large box—is a <strong>polytope</strong> (Def. 2.2).
          </aside>
        </div>
        <section class="l4-widget" aria-labelledby="l4-poly-builder-title">
          <h3 id="l4-poly-builder-title">Build a polyhedron</h3>
          <p class="l4-small">Start with the plane, then intersect one halfspace at a time.</p>
          <div data-screen-only>
            <svg class="l4-figure l4-poly-figure" viewBox="0 0 450 300" role="img" aria-labelledby="l4-poly-title l4-poly-desc">
              <title id="l4-poly-title">A polyhedron built by intersecting six halfspaces</title>
              <desc id="l4-poly-desc">Each button press clips the current feasible region by one more halfspace. The newest boundary is dashed and every genuine corner is marked.</desc>
              <rect x="5" y="5" width="440" height="290" rx="8" fill="#f7f4ef" stroke="#aaa" stroke-width="3" />
              <polygon data-l4-poly-region points="5,5 445,5 445,295 5,295" fill="#f4e5eb" stroke="#861f41" stroke-width="4" />
              <line data-l4-poly-cut x1="0" y1="0" x2="0" y2="0" stroke="#e87722" stroke-width="3" stroke-dasharray="8 6" hidden />
              <g data-l4-poly-vertices fill="#172b33"></g>
              <text data-l4-poly-empty x="225" y="154" text-anchor="middle" font-size="22" fill="#8f201b" hidden>empty intersection</text>
            </svg>
            <div class="l4-button-row">
              <button type="button" data-l4-halfspace-add>Add a halfspace</button>
              <button type="button" data-l4-halfspace-reset class="l4-secondary">Reset</button>
            </div>
            <p class="l4-widget-output" data-l4-poly-output role="status" aria-live="polite"></p>
          </div>
          <figure class="l4-print-only">
            <svg class="l4-figure l4-poly-figure" viewBox="0 0 450 300" role="img" aria-label="Final six-sided polytope formed by six halfspaces">
              <rect x="5" y="5" width="440" height="290" rx="8" fill="#f7f4ef" stroke="#aaa" stroke-width="3" />
              <polygon points="380,180 300,260 140,240 90,120 200,60 330,90" fill="#fff0e3" stroke="#e87722" stroke-width="5" />
              <g fill="#861f41"><circle cx="380" cy="180" r="6"/><circle cx="300" cy="260" r="6"/><circle cx="140" cy="240" r="6"/><circle cx="90" cy="120" r="6"/><circle cx="200" cy="60" r="6"/><circle cx="330" cy="90" r="6"/></g>
            </svg>
            <figcaption>Six halfspaces intersect to form a bounded six-corner polyhedron.</figcaption>
          </figure>
        </section>
      </div>`,
    checkpoint: checkpointConvexity,
    onMount: mountPolyhedronBuilder,
  },
  {
    id: "l4-08",
    page: 8,
    title: "Three Definitions of \"Corner Point\"",
    eyebrow: "§2.2 · What exactly is a corner?",
    html: String.raw`
      <div class="l4-stack l4-fill l4-center-items">
        <section class="l4-roadmap" aria-label="Three corner definitions">
          <article class="l4-card" data-tone="blue">
            <span class="l4-number">1</span><h3>Extreme point</h3>
            <p>Not a convex combination of other points in \(P\).</p>
            <p class="l4-kicker">Geometric</p>
          </article>
          <article class="l4-card" data-tone="orange">
            <span class="l4-number">2</span><h3>Vertex</h3>
            <p>The unique winner of some LP over \(P\).</p>
            <p class="l4-kicker">Optimization</p>
          </article>
          <article class="l4-card" data-tone="green">
            <span class="l4-number">3</span><h3>Basic feasible solution</h3>
            <p>Pinned by \(n\) independent active constraints.</p>
            <p class="l4-kicker">Algebraic · computable</p>
          </article>
        </section>
        <aside class="l4-callout l4-large" data-tone="maroon">
          <strong>Theorem 2.3:</strong> all three definitions are equivalent. We can think geometrically and compute algebraically.
        </aside>
        <p class="l4-center l4-muted">Why keep three definitions? Each one makes a different theorem easier.</p>
      </div>`,
  },
  {
    id: "l4-09",
    page: 9,
    title: "Extreme Points (Def. 2.6)",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card" data-tone="maroon">
            <h3>Definition</h3>
            <p>A point \(x\in P\) is an <strong>extreme point</strong> if it cannot be written as</p>
            <div class="l4-equation ns-math" role="math">\[x=\lambda y+(1-\lambda)z\]</div>
            <p>with \(y,z\in P\setminus\{x\}\) and \(\lambda\in[0,1]\).</p>
          </section>
          <ul class="l4-list">
            <li>The definition is geometric; it does not depend on how \(P\) is written.</li>
            <li>Interior points and edge-interior points are midpoints of neighbors, so they fail.</li>
          </ul>
          <aside class="l4-callout" data-tone="blue">
            <strong>Negation practice:</strong> disprove extremality by exhibiting \(y\), \(z\), and \(\lambda\). Prove it by assuming such witnesses exist and deriving a contradiction.
          </aside>
        </div>
        <section class="l4-widget" aria-labelledby="l4-extreme-tester-title">
          <h3 id="l4-extreme-tester-title">Test a point</h3>
          <p class="l4-small">Choose any point. Keyboard: focus the diagram, move the dashed cursor with Arrow keys (Shift = faster), and press Enter or Space; buttons load exact representative points.</p>
          <div class="l4-button-row" role="group" aria-label="Choose a point in the polygon">
            <button type="button" data-l4-point="corner" aria-pressed="true">Corner</button>
            <button type="button" data-l4-point="edge" aria-pressed="false">Edge</button>
            <button type="button" data-l4-point="interior" aria-pressed="false">Interior</button>
          </div>
          <svg class="l4-figure l4-interactive-figure" data-l4-extreme-svg viewBox="0 0 600 330" role="img" tabindex="0" aria-labelledby="l4-extreme-title l4-extreme-desc">
            <title id="l4-extreme-title">Selected point in a convex polygon</title>
            <desc id="l4-extreme-desc">Select any point in the polygon, or use the keyboard-accessible presets. A corner is marked extreme; for any other feasible point a segment joins witnesses y and z whose midpoint is the selected point.</desc>
            <polygon points="92,270 135,112 310,48 505,92 470,268 265,302" fill="#f4e5eb" stroke="#861f41" stroke-width="7" />
            <line data-l4-point-witness-segment x1="0" y1="0" x2="0" y2="0" stroke="#27658a" stroke-width="6" stroke-linecap="round" hidden />
            <circle data-l4-point-witness="y" cx="0" cy="0" r="10" fill="#27658a" stroke="#fff" stroke-width="3" hidden />
            <circle data-l4-point-witness="z" cx="0" cy="0" r="10" fill="#27658a" stroke="#fff" stroke-width="3" hidden />
            <text data-l4-point-witness-label="y" x="0" y="0" fill="#1f5575" font-size="21" font-weight="700" hidden>y</text>
            <text data-l4-point-witness-label="z" x="0" y="0" fill="#1f5575" font-size="21" font-weight="700" hidden>z</text>
            <circle data-l4-point-marker cx="310" cy="48" r="14" fill="#25834a" stroke="#fff" stroke-width="4" />
            <text data-l4-point-label x="337" y="42" fill="#176536" font-size="21" font-weight="700">x · corner</text>
            <circle data-l4-point-cursor class="l4-keyboard-cursor" cx="310" cy="48" r="18" aria-hidden="true" />
          </svg>
          <p class="l4-widget-output" data-l4-point-output role="status" aria-live="polite"></p>
        </section>
      </div>`,
    onMount: mountExtremePointTester,
  },
  {
    id: "l4-10",
    page: 10,
    title: "Vertices (Def. 2.7)",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card" data-tone="maroon">
            <h3>Definition</h3>
            <p>A point \(x\in P\) is a <strong>vertex</strong> if some cost vector \(c\) makes it the unique optimum:</p>
            <div class="l4-equation ns-math" role="math">\[c^\top x&lt;c^\top y\qquad\text{for every }y\in P,\ y\ne x.\]</div>
          </section>
          <ul class="l4-list">
            <li>A supporting level line touches \(P\) only at \(x\).</li>
            <li>Changing \(c\) changes which corner wins uniquely.</li>
          </ul>
        </div>
        <figure class="l4-figure-card">
          <svg class="l4-figure" viewBox="0 0 620 390" role="img" aria-labelledby="l4-vertex-title l4-vertex-desc">
            <title id="l4-vertex-title">A vertex exposed by a supporting objective line</title>
            <desc id="l4-vertex-desc">A dashed level line touches a convex polygon at exactly one top corner. An arrow labeled cost vector c is perpendicular to the line.</desc>
            <polygon points="90,310 130,130 315,62 505,132 468,300 255,348" fill="#f4e5eb" stroke="#861f41" stroke-width="7" />
            <line x1="105" y1="104" x2="555" y2="14" stroke="#e87722" stroke-width="6" stroke-dasharray="15 11" />
            <circle cx="315" cy="62" r="14" fill="#25834a" stroke="#fff" stroke-width="4" />
            <rect x="334" y="76" width="220" height="45" rx="8" fill="#f1faf4" stroke="#25834a" stroke-width="2" />
            <text x="444" y="105" text-anchor="middle" fill="#176536" font-size="21" font-weight="700">unique minimizer x</text>
            <line x1="204" y1="48" x2="222" y2="138" stroke="#27658a" stroke-width="7" />
            <path d="M222 138 L208 117 L231 113 Z" fill="#27658a" />
            <rect x="105" y="75" width="116" height="42" rx="8" fill="#fff" stroke="#27658a" stroke-width="2" />
            <text x="163" y="102" text-anchor="middle" fill="#1f5575" font-size="20" font-weight="700">cost c</text>
            <text x="310" y="382" text-anchor="middle" fill="#555" font-size="18">The dashed level line meets P at one point only.</text>
          </svg>
        </figure>
      </div>`,
  },
  {
    id: "l4-11",
    page: 11,
    title: "Active Constraints (Def. 2.8)",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card">
            <h3>Definition</h3>
            <p>Constraint \(i\) is <strong>active</strong> (tight or binding) at \(x^*\) when it holds with equality:</p>
            <div class="l4-equation ns-math" role="math">\[a_i^\top x^*=b_i.\]</div>
          </section>
          <ul class="l4-list">
            <li>Active constraints are the boundaries a point is pressed against.</li>
            <li>In \(\mathbb{R}^2\): an interior point has 0 active boundaries, an edge point 1, and a nondegenerate corner 2.</li>
            <li>Corners occur where enough independent constraints are active.</li>
          </ul>
        </div>
        <figure class="l4-figure-card">
          <svg class="l4-figure" viewBox="0 0 620 390" role="img" aria-labelledby="l4-active-title l4-active-desc">
            <title id="l4-active-title">Points with zero, one, and two active constraints</title>
            <desc id="l4-active-desc">Three labeled points lie inside, on an edge, and at a corner of a polygon.</desc>
            <polygon points="90,310 130,130 315,62 505,132 468,300 255,348" fill="#f4e5eb" stroke="#861f41" stroke-width="7" />
            <circle cx="300" cy="210" r="13" fill="#27658a" />
            <line x1="313" y1="214" x2="355" y2="232" stroke="#27658a" stroke-width="3" />
            <rect x="354" y="216" width="160" height="42" rx="8" fill="#fff" stroke="#27658a" stroke-width="2" />
            <text x="434" y="243" text-anchor="middle" fill="#1f5575" font-size="20" font-weight="700">0 active</text>
            <circle cx="223" cy="96" r="13" fill="#e87722" />
            <line x1="215" y1="86" x2="179" y2="56" stroke="#9e4e15" stroke-width="3" />
            <rect x="50" y="22" width="150" height="42" rx="8" fill="#fff" stroke="#e87722" stroke-width="2" />
            <text x="125" y="49" text-anchor="middle" fill="#8b4513" font-size="20" font-weight="700">1 active</text>
            <circle cx="505" cy="132" r="14" fill="#25834a" />
            <line x1="514" y1="122" x2="535" y2="87" stroke="#25834a" stroke-width="3" />
            <rect x="428" y="46" width="178" height="44" rx="8" fill="#fff" stroke="#25834a" stroke-width="2" />
            <text x="517" y="74" text-anchor="middle" fill="#176536" font-size="20" font-weight="700">2 active</text>
            <text x="310" y="383" text-anchor="middle" fill="#555" font-size="18">In ℝⁿ, a corner needs n independent active constraints.</text>
          </svg>
        </figure>
      </div>`,
  },
  {
    id: "l4-12",
    page: 12,
    title: "Basic (Feasible) Solutions (Def. 2.9)",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card" data-tone="maroon">
            <h3>Basic solution</h3>
            <ol class="l4-list">
              <li>Every equality constraint is active.</li>
              <li>Among all active constraints, some \(n\) have linearly independent normals \(a_i\).</li>
            </ol>
            <p>If the point also satisfies every constraint, it is a <strong>basic feasible solution (BFS)</strong>.</p>
          </section>
          <aside class="l4-callout" data-tone="orange">
            <strong>Algebraic meaning:</strong> \(n\) independent active equations pin down one point in \(\mathbb{R}^n\). That makes corners computable.
          </aside>
        </div>
        <figure class="l4-figure-card">
          <svg class="l4-figure" viewBox="0 0 620 390" role="img" aria-labelledby="l4-bfs-title l4-bfs-desc">
            <title id="l4-bfs-title">A feasible and an infeasible basic solution</title>
            <desc id="l4-bfs-desc">Three gray constraint lines extend actual edges of the polygon. The first two meet at the green feasible corner. The second and third meet at the red point outside the polygon.</desc>
            <g stroke="#b8aaa0" stroke-width="4" stroke-linecap="round">
              <line data-l4-bfs-constraint-line="AB" x1="122.664671" y1="360" x2="193.922156" y2="20" />
              <line data-l4-bfs-constraint-line="BC" x1="60" y1="193.202312" x2="570" y2="22.219653" />
              <line data-l4-bfs-constraint-line="DE" x1="514.142857" y1="20" x2="465.571429" y2="360" />
            </g>
            <polygon data-l4-bfs-polygon points="130,325 165,158 338,100 491,182 471,322" fill="#f4e5eb" stroke="#861f41" stroke-width="7" />
            <g aria-hidden="true">
              <line x1="165" y1="141" x2="165" y2="144" stroke="#25834a" stroke-width="3" />
              <rect x="35" y="97" width="205" height="44" rx="8" fill="#fff" stroke="#25834a" stroke-width="2" />
              <text x="137" y="125" text-anchor="middle" fill="#176536" font-size="19" font-weight="700">basic + feasible</text>
              <line x1="511" y1="56" x2="511" y2="62" stroke="#b3261e" stroke-width="3" />
              <rect x="390" y="62" width="215" height="44" rx="8" fill="#fff" stroke="#b3261e" stroke-width="2" />
              <text x="497" y="90" text-anchor="middle" fill="#8c1e19" font-size="19" font-weight="700">basic, infeasible</text>
            </g>
            <circle data-l4-bfs-point="feasible" cx="165" cy="158" r="14" fill="#25834a" stroke="#fff" stroke-width="4" />
            <circle data-l4-bfs-point="infeasible" cx="511" cy="42" r="14" fill="#b3261e" stroke="#fff" stroke-width="4" />
            <text x="310" y="382" text-anchor="middle" fill="#555" font-size="18">Two independent lines determine one point when n = 2.</text>
          </svg>
        </figure>
      </div>`,
    checkpoint: checkpointExtreme,
  },
  {
    id: "l4-13",
    page: 13,
    title: "The Equivalence Theorem (Thm 2.3)",
    html: String.raw`
      <div class="l4-stack l4-fill">
        <section class="l4-theorem">
          <p><strong>Theorem.</strong> For a nonempty polyhedron \(P\) and \(x^*\in P\), the following are equivalent:</p>
          <div class="l4-equivalence" aria-label="Vertex if and only if extreme point if and only if basic feasible solution">
            <span>vertex</span><strong>⇔</strong><span>extreme point</span><strong>⇔</strong><span>basic feasible solution</span>
          </div>
        </section>
        <section class="l4-stack">
          <article class="l4-card" data-tone="blue">
            <h3>Why it matters</h3>
            <p>A BFS definition mentions the constraint representation, but the theorem says the underlying geometry decides. Use whichever definition makes the current argument easiest.</p>
          </article>
          <article class="l4-card" data-tone="orange" data-reveal="proof-cycle">
            <h3>Proof architecture</h3>
            <p>Prove one cycle of implications:</p>
            <div class="l4-equivalence l4-equivalence-small" aria-label="Vertex implies extreme point implies basic feasible solution implies vertex">
              <span>vertex</span><strong>⇒</strong><span>extreme</span><strong>⇒</strong><span>BFS</span><strong>⇒</strong><span>vertex</span>
            </div>
            <p>Those three arrows imply all six pairwise directions.</p>
          </article>
        </section>
      </div>`,
  },
  {
    id: "l4-14",
    page: 14,
    title: "Vertex ⇒ Extreme Point",
    eyebrow: "Proof workshop 1 · You make the moves",
    html: String.raw`
      <section class="l4-workshop l4-fill">
        <div class="l4-workshop-state"><span><strong>Assumptions</strong><output data-l4-workshop-assumption>—</output></span><span><strong>To show</strong><output data-l4-workshop-goal>—</output></span></div>
        <div class="l4-workshop-stage" role="region" aria-label="Cumulative proof history" tabindex="0">
          <article data-l4-workshop-step data-l4-assume="\(x^*\) is a vertex: \(\exists c\) with \(c^\top x^*&lt;c^\top y\) for all other \(y\in P\)" data-l4-goal="\(x^*\) is extreme" tabindex="-1"><h3>Unpack “vertex.”</h3><p>Some cost vector \(c\) makes \(x^*\) the unique minimizer over \(P\). That same \(c\) is the proof's weapon.</p></article>
          <article data-l4-workshop-step data-l4-question data-l4-assume="vertex cost vector \(c\)" data-l4-goal="choose a proof shape" tabindex="-1"><h3>“Extreme” is a cannot-be-written statement. What proof shape is natural?</h3><div class="l4-workshop-choices"><button type="button" data-l4-workshop-choice data-correct data-explanation="Assume \(x^*\) can be written as a nontrivial convex combination and use uniqueness to derive an absurdity.">Contradiction: assume it can be written that way</button><button type="button" data-l4-workshop-choice data-explanation="There is no natural-number ladder here; the claim concerns one point in one polyhedron.">Induction on the dimension</button><button type="button" data-l4-workshop-choice data-explanation="A counterexample would disprove the theorem, not prove it.">Find a counterexample</button></div><output class="l4-workshop-feedback" data-l4-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output><p class="l4-print-answer"><strong>Answer:</strong> contradiction.</p></article>
          <article data-l4-workshop-step data-l4-assume="vertex \(c\); \(x^*=\lambda y+(1-\lambda)z\), \(y,z\ne x^*\), \(0&lt;\lambda&lt;1\)" data-l4-goal="a contradiction" tabindex="-1"><h3>Assume the negation of extremality.</h3><p>Let \(x^*=\lambda y+(1-\lambda)z\) with \(y,z\in P\setminus\{x^*\}\) and \(\lambda\in[0,1]\). The endpoints would force \(x^*=z\) or \(x^*=y\), so in fact \(0&lt;\lambda&lt;1\).</p></article>
          <article data-l4-workshop-step data-l4-question data-l4-assume="vertex \(c\); a strict convex combination" data-l4-goal="deploy uniqueness" tabindex="-1"><h3>What does the vertex property say about \(c^\top y\) and \(c^\top z\)?</h3><div class="l4-workshop-choices"><button type="button" data-l4-workshop-choice data-correct data-explanation="Both points lie in \(P\) and differ from the unique minimizer \(x^*\), so both inequalities are strict.">\(c^\top y&gt;c^\top x^*\) and \(c^\top z&gt;c^\top x^*\)</button><button type="button" data-l4-workshop-choice data-explanation="That is backward: \(x^*\) is the unique minimizer.">\(c^\top y&lt;c^\top x^*\)</button><button type="button" data-l4-workshop-choice data-explanation="The vertex definition quantifies over exactly these other points of \(P\).">Nothing—\(y,z\) are arbitrary</button></div><output class="l4-workshop-feedback" data-l4-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output><p class="l4-print-answer"><strong>Answer:</strong> both costs are strictly larger.</p></article>
          <article data-l4-workshop-step data-l4-assume="the two strict cost inequalities" data-l4-goal="a contradiction" tabindex="-1"><h3>Apply \(c^\top\) to the combination.</h3><p class="l4-proof-math ns-math">\[c^\top x^*=\lambda c^\top y+(1-\lambda)c^\top z&gt;\lambda c^\top x^*+(1-\lambda)c^\top x^*=c^\top x^*.\]</p><p>Strictness survives because both weights are positive.</p></article>
          <article data-l4-workshop-step data-l4-assume="\(c^\top x^*&gt;c^\top x^*\)" data-l4-goal="DONE" tabindex="-1"><h3>Contradiction.</h3><p>A number cannot be strictly greater than itself. No such \(y,z,\lambda\) exist, so \(x^*\) is an extreme point. \(\square\)</p></article>
        </div>
        <div class="l4-workshop-controls"><button type="button" data-l4-workshop-previous>Previous move</button><output data-l4-workshop-progress aria-live="polite"></output><button type="button" data-l4-workshop-next>Next move</button><button type="button" data-l4-workshop-restart>Restart</button></div>
      </section>`,
    onMount: mountGuidedWorkshop,
  },
  {
    id: "l4-15",
    page: 15,
    title: "Extreme Point ⇒ Basic Feasible Solution",
    eyebrow: "Proof workshop 2 · The meaty one",
    html: String.raw`
      <section class="l4-workshop l4-fill">
        <div class="l4-workshop-state"><span><strong>Assumptions</strong><output data-l4-workshop-assumption>—</output></span><span><strong>To show</strong><output data-l4-workshop-goal>—</output></span></div>
        <div class="l4-workshop-stage" role="region" aria-label="Cumulative proof history" tabindex="0">
          <article data-l4-workshop-step data-l4-question tabindex="-1"><h3>Which restatement gives us something constructive?</h3><div class="l4-workshop-choices"><button type="button" data-l4-workshop-choice data-correct data-explanation="Not-BFS gives rank deficiency, which lets us construct witnesses for not-extreme.">Contrapositive: not a BFS \(\Rightarrow\) not extreme</button><button type="button" data-l4-workshop-choice data-explanation="Assuming extreme gives a non-existence statement that is hard to compute with; flipping it puts construction on our side.">Work directly from “extreme”</button></div><output class="l4-workshop-feedback" data-l4-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output><p class="l4-print-answer"><strong>Answer:</strong> use the contrapositive.</p></article>
          <article data-l4-workshop-step data-l4-assume="\(x^*\in P\), \(I=I(x^*)=\{i:a_i^\top x^*=b_i\}\), \(\operatorname{rank}\{a_i:i\in I\}&lt;n\)" data-l4-goal="exhibit \(y,z\in P\setminus\{x^*\}\) with \(x^*=\tfrac12y+\tfrac12z\)" tabindex="-1"><h3>Unpack not-basic.</h3><p>Let \(I=I(x^*)=\{i:a_i^\top x^*=b_i\}\) be the index set of active inequality constraints. Since \(x^*\) is not basic, their constraint vectors span a subspace of dimension less than \(n\).</p></article>
          <article data-l4-workshop-step data-l4-question data-l4-assume="rank-deficient active constraint vectors" data-l4-goal="find a witness direction" tabindex="-1"><h3>What does linear algebra hand us?</h3><div class="l4-workshop-choices"><button type="button" data-l4-workshop-choice data-correct data-explanation="A rank-deficient row system has a nontrivial null-space direction invisible to every active constraint.">A nonzero \(d\) with \(a_i^\top d=0\) for every \(i\in I\)</button><button type="button" data-l4-workshop-choice data-explanation="Objective-improving directions belong to later simplex analysis; here we need a direction orthogonal to all active constraint vectors.">A direction that improves the objective</button><button type="button" data-l4-workshop-choice data-explanation="The null space is exactly the concrete object rank deficiency supplies.">Nothing useful</button></div><output class="l4-workshop-feedback" data-l4-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output><p class="l4-print-answer"><strong>Answer:</strong> a nonzero null-space direction.</p></article>
          <article data-l4-workshop-step data-l4-assume="\(a_i^\top d=0\) for active \(i\)" data-l4-goal="two feasible witnesses" tabindex="-1"><h3>Step both ways.</h3><p>For \(\varepsilon&gt;0\), set \(y=x^*+\varepsilon d\) and \(z=x^*-\varepsilon d\). Their midpoint is already \(x^*\); now keep them feasible.</p></article>
          <article data-l4-workshop-step data-l4-question data-l4-assume="\(y=x^*+\varepsilon d\), \(z=x^*-\varepsilon d\)" data-l4-goal="prove \(y,z\in P\)" tabindex="-1"><h3>Why does a small \(\varepsilon\) preserve feasibility?</h3><div class="l4-workshop-choices"><button type="button" data-l4-workshop-choice data-correct data-explanation="Active rows do not move because \(a_i^\top d=0\); each inactive row has positive slack that survives a sufficiently small common step.">Active rows stay equalities; inactive slack absorbs the step</button><button type="button" data-l4-workshop-choice data-explanation="Convexity only combines points already known to lie in \(P\); feasibility of \(y,z\) is exactly what remains to prove.">Because \(P\) is convex</button></div><output class="l4-workshop-feedback" data-l4-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output><p class="l4-print-answer"><strong>Answer:</strong> active rows do not move and inactive rows have slack.</p></article>
          <article data-l4-workshop-step data-l4-assume="finitely many inactive rows with positive slack" data-l4-goal="one \(\varepsilon\) that works for all rows" tabindex="-1"><h3>Choose one common step size.</h3><p class="l4-proof-math ns-math">\[\varepsilon&lt;\min_{\substack{i\notin I\\a_i^\top d\ne0}}\frac{a_i^\top x^*-b_i}{\lvert a_i^\top d\rvert}.\]</p><p>Then every inactive constraint still holds at both \(y\) and \(z\), so \(y,z\in P\).</p></article>
          <article data-l4-workshop-step data-l4-assume="\(d\ne0\), \(\varepsilon&gt;0\), \(y,z\in P\)" data-l4-goal="DONE—witnesses exhibited" tabindex="-1"><h3>Exhibit non-extremality.</h3><p>The points are distinct and \(x^*=\tfrac12y+\tfrac12z\). Thus \(x^*\) is not extreme. The contrapositive proves extreme \(\Rightarrow\) BFS. \(\square\)</p></article>
        </div>
        <div class="l4-workshop-controls"><button type="button" data-l4-workshop-previous>Previous move</button><output data-l4-workshop-progress aria-live="polite"></output><button type="button" data-l4-workshop-next>Next move</button><button type="button" data-l4-workshop-restart>Restart</button></div>
      </section>`,
    onMount: mountGuidedWorkshop,
  },
  {
    id: "l4-bfs-vertex",
    page: 16,
    title: "Basic Feasible Solution ⇒ Vertex",
    eyebrow: "Proof workshop 3 · Complete the cycle",
    html: String.raw`
      <section class="l4-workshop l4-fill">
        <div class="l4-workshop-state"><span><strong>Assumptions</strong><output data-l4-workshop-assumption>—</output></span><span><strong>To show</strong><output data-l4-workshop-goal>—</output></span></div>
        <div class="l4-workshop-stage" role="region" aria-label="Cumulative proof history" tabindex="0">
          <article data-l4-workshop-step data-l4-assume="\(x^*\) is a BFS; \(B\subseteq I(x^*)\), \(|B|=n\), with independent \(a_i\)" data-l4-goal="find \(c\) for which \(x^*\) is the unique minimizer" tabindex="-1"><h3>Unpack “basic feasible.”</h3><p>Let \(I(x^*)=\{i:a_i^\top x^*=b_i\}\) be the full active set. Because \(x^*\) is basic, choose \(B\subseteq I(x^*)\) with \(|B|=n\) whose constraint vectors \(a_i\) are linearly independent.</p></article>
          <article data-l4-workshop-step data-l4-question data-l4-assume="\(B\) contains \(n\) independent active constraints" data-l4-goal="build one exposing cost vector" tabindex="-1"><h3>Which cost vector combines all selected constraints?</h3><div class="l4-workshop-choices"><button type="button" data-l4-workshop-choice data-correct data-explanation="Adding the selected active constraint vectors makes the objective gap equal the sum of their nonnegative slacks.">\(c=\displaystyle\sum_{i\in B}a_i=A_B^\top\mathbf 1\)</button><button type="button" data-l4-workshop-choice data-explanation="The zero vector makes every feasible point tie, so it cannot expose a unique minimizer.">\(c=0\)</button><button type="button" data-l4-workshop-choice data-explanation="One selected constraint usually exposes a whole face; we need all \(n\) independent constraints to isolate the point.">Choose just one \(a_i\)</button></div><output class="l4-workshop-feedback" data-l4-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output><p class="l4-print-answer"><strong>Answer:</strong> sum all selected constraint vectors.</p></article>
          <article data-l4-workshop-step data-l4-assume="\(c=\sum_{i\in B}a_i=A_B^\top\mathbf 1\); \(a_i^\top y-b_i\ge0\) for every \(i\in B\)" data-l4-goal="compare \(c^\top y\) with \(c^\top x^*\)" tabindex="-1"><h3>Feasibility creates nonnegative gaps.</h3><p>For every \(i\in B\), feasibility gives \(a_i^\top y-b_i\ge0\), while activity at \(x^*\) gives \(a_i^\top x^*-b_i=0\).</p></article>
          <article data-l4-workshop-step data-l4-assume="all selected gaps are nonnegative" data-l4-goal="show \(x^*\) minimizes the chosen objective" tabindex="-1"><h3>Add the selected gaps.</h3><p class="l4-proof-math ns-math">\[c^\top(y-x^*)=\sum_{i\in B}a_i^\top(y-x^*)=\sum_{i\in B}(a_i^\top y-b_i)\ge0.\]</p><p>Thus \(c^\top x^*\le c^\top y\) for every \(y\in P\).</p></article>
          <article data-l4-workshop-step data-l4-question data-l4-assume="a sum of nonnegative selected gaps equals zero" data-l4-goal="decide whether another point can tie" tabindex="-1"><h3>When can equality hold?</h3><div class="l4-workshop-choices"><button type="button" data-l4-workshop-choice data-correct data-explanation="A finite sum of nonnegative numbers is zero only when every term is zero, so every constraint in \(B\) is active at \(y\).">Only when \(a_i^\top y=b_i\) for every \(i\in B\)</button><button type="button" data-l4-workshop-choice data-explanation="Cancellation is impossible because every selected slack is nonnegative.">Positive and negative gaps may cancel</button><button type="button" data-l4-workshop-choice data-explanation="One zero gap only places \(y\) on one boundary; it does not force the whole sum to vanish.">When at least one selected gap is zero</button></div><output class="l4-workshop-feedback" data-l4-workshop-feedback aria-live="polite">Choose an answer to unlock the next move.</output><p class="l4-print-answer"><strong>Answer:</strong> every selected gap must be zero.</p></article>
          <article data-l4-workshop-step data-l4-assume="\(A_By=b_B=A_Bx^*\); the rows of \(A_B\) are independent" data-l4-goal="DONE—prove uniqueness" tabindex="-1"><h3>Independence makes equality unique.</h3><p>The square matrix \(A_B\) is nonsingular, so equality forces \(y=x^*\). Therefore every other \(y\in P\) satisfies \(c^\top x^*&lt;c^\top y\): \(x^*\) is the unique minimizer, hence a vertex. \(\square\)</p></article>
        </div>
        <div class="l4-workshop-controls"><button type="button" data-l4-workshop-previous>Previous move</button><output data-l4-workshop-progress aria-live="polite"></output><button type="button" data-l4-workshop-next>Next move</button><button type="button" data-l4-workshop-restart>Restart</button></div>
      </section>`,
    onMount: mountGuidedWorkshop,
  },
  {
    id: "l4-16",
    page: 17,
    title: "Only Finitely Many Corners (Cor. 2.1)",
    html: String.raw`
      <div class="l4-stack l4-fill">
        <section class="l4-theorem">
          <p><strong>Corollary.</strong> A polyhedron defined by \(m\) linear constraints in \(\mathbb{R}^n\) has at most</p>
          <div class="l4-equation l4-binomial ns-math" role="math" aria-label="m choose n basic solutions">\[\binom{m}{n}\]</div>
          <p>basic solutions.</p>
        </section>
        <section class="l4-finite-layout">
          <div class="l4-stack">
            <article class="l4-card">
              <h3>Counting proof</h3>
              <p>Choose \(n\) linearly independent active constraints from \(m\). Each choice pins down at most one point; there are \(\binom{m}{n}\) choices.</p>
            </article>
            <aside class="l4-callout" data-tone="orange">
              <strong>Finite does not mean small.</strong> The unit cube \(0\le x_i\le1\) has \(2^n\) basic feasible solutions.
            </aside>
          </div>
          <table class="l4-table">
            <caption>Corner growth for the unit cube</caption>
            <thead><tr><th scope="col">\(n\)</th><th scope="col">Corners \(2^n\)</th></tr></thead>
            <tbody><tr><td>2</td><td>4</td></tr><tr><td>10</td><td>1,024</td></tr><tr><td>100</td><td>\(\approx1.27\times10^{30}\)</td></tr><tr><td>333</td><td>&gt; one googol</td></tr></tbody>
          </table>
        </section>
        <p class="l4-center l4-muted">“Check every corner” is therefore not an algorithm. Chapter 3 must be smarter.</p>
      </div>`,
  },
  {
    id: "l4-17",
    page: 18,
    title: "Adjacent Basic Solutions & Edges",
    html: String.raw`
      <div class="l4-text-visual l4-fill">
        <div class="l4-stack">
          <section class="l4-card" data-tone="maroon">
            <h3>Definition</h3>
            <p>Two distinct basic solutions in \(\mathbb{R}^n\) are <strong>adjacent</strong> if they share \(n-1\) linearly independent active constraints.</p>
            <p>If both are feasible, the segment joining them is an <strong>edge</strong> of \(P\).</p>
          </section>
          <ul class="l4-list">
            <li>In \(\mathbb{R}^2\), adjacent corners share one active boundary line.</li>
            <li>Adjacency means one constraint swap away.</li>
            <li>The simplex method moves edge by edge between adjacent BFSs.</li>
          </ul>
        </div>
        <figure class="l4-figure-card">
          <svg class="l4-figure" viewBox="0 0 620 390" role="img" aria-labelledby="l4-adj-title l4-adj-desc">
            <title id="l4-adj-title">Adjacent and nonadjacent corners of a polygon</title>
            <desc id="l4-adj-desc">Two top corners and their shared edge are highlighted in green. A separated lower-right corner is marked orange.</desc>
            <polygon points="90,310 130,130 315,62 505,132 468,300 255,348" fill="#f4e5eb" stroke="#861f41" stroke-width="7" />
            <line x1="130" y1="130" x2="315" y2="62" stroke="#25834a" stroke-width="13" />
            <circle cx="130" cy="130" r="14" fill="#25834a" stroke="#fff" stroke-width="4" />
            <circle cx="315" cy="62" r="14" fill="#25834a" stroke="#fff" stroke-width="4" />
            <rect x="80" y="19" width="286" height="43" rx="8" fill="#fff" stroke="#25834a" stroke-width="2" />
            <text x="223" y="47" text-anchor="middle" fill="#176536" font-size="19" font-weight="700">adjacent: one shared edge</text>
            <circle cx="468" cy="300" r="14" fill="#e87722" stroke="#fff" stroke-width="4" />
            <rect x="330" y="324" width="268" height="44" rx="8" fill="#fff" stroke="#e87722" stroke-width="2" />
            <text x="464" y="352" text-anchor="middle" fill="#8b4513" font-size="19" font-weight="700">not adjacent to the top pair</text>
          </svg>
        </figure>
      </div>`,
    checkpoint: checkpointFiniteness,
  },
  {
    id: "l4-18",
    page: 19,
    title: "Summary & What's Next",
    html: String.raw`
      <div class="l4-stack l4-fill">
        <ol class="l4-summary" aria-label="Lecture summary">
          <li><span class="l4-number">1</span><div><strong>Polyhedra are convex.</strong><p>A polyhedron is a finite intersection of halfspaces; a bounded one is a polytope.</p></div></li>
          <li><span class="l4-number">2</span><div><strong>Corner has three equivalent meanings.</strong><p>Extreme point = vertex = basic feasible solution.</p></div></li>
          <li><span class="l4-number">3</span><div><strong>Corners are finite but can be numerous.</strong><p>Each is pinned by \(n\) independent active constraints.</p></div></li>
          <li><span class="l4-number">4</span><div><strong>Edges encode adjacency.</strong><p>Adjacent corners share \(n-1\) independent active constraints.</p></div></li>
        </ol>
        <aside class="l4-callout l4-large" data-tone="orange">
          <strong>Next lecture:</strong> standard-form bases, degeneracy, when corners exist, corner optimality, and elimination.
        </aside>
      </div>`,
  },
];

export const metadata = {
  id: "lecture-04",
  number: 4,
  title: "The Geometry of Linear Programming I",
  subtitle: "Lecture 3 · ISE 5405: Optimization I",
  course: "ISE 5405 · Optimization I",
  date: "2026-09-03",
  aspectRatio: "16:9",
  theme: "virginia-tech",
  homeUrl: "../../",
  pdfUrl: "../../materials/lecture_04.pdf",
  whiteboards: 7,
};

export const deck = {
  schemaVersion: 1,
  id: metadata.id,
  number: metadata.number,
  title: metadata.title,
  metadata,
  styles,
  slides,
};

export default deck;
