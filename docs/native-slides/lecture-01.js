/**
 * Native Lecture 01 route: Robert's updated Lecture 0 logistics deck.
 *
 * The authored slides contain only course content. Navigation, print, ink,
 * erasing, and the two virtual whiteboards belong to the shared native runtime.
 */

export function mountInteraction() {
  // This reference deck has no slide-local widgets. Its only interaction is
  // the shared presentation runtime plus deterministic, meaningful reveals.
  return () => {};
}

export const deck = Object.freeze({
  schemaVersion: 1,
  id: "lecture-01",
  number: 1,
  title: "Syllabus & Logistics",
  subtitle: "ISE 5405: Optimization I · Lecture 0",
  date: "2026-08-25",
  aspectRatio: "16:9",
  styles: new URL("./lecture-01.css", import.meta.url).href,
  theme: Object.freeze({ accent: "#861f41", secondary: "#e87722" }),
  slides: Object.freeze([
    {
      id: "l1-01",
      page: 1,
      title: "Lecture 0 — Syllabus & Logistics",
      minutes: 2,
      html: String.raw`
        <article class="l1-slide l1-title-slide">
          <svg class="l1-title-art" viewBox="0 0 400 320" role="img" aria-label="A polygonal feasible region, parallel objective lines, and a marked optimal corner">
            <defs>
              <linearGradient id="l0-title-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#e5751f" stop-opacity=".22"/>
                <stop offset="1" stop-color="#861f41" stop-opacity=".30"/>
              </linearGradient>
            </defs>
            <polygon points="70,240 140,90 250,60 340,140 320,240 180,290"
              fill="url(#l0-title-gradient)" stroke="#861f41" stroke-width="2.5" stroke-opacity=".5"/>
            <g stroke="#e5751f" stroke-width="1.6" stroke-dasharray="7 6" opacity=".65">
              <line x1="20" y1="215" x2="380" y2="118"/>
              <line x1="20" y1="258" x2="380" y2="161"/>
              <line x1="20" y1="172" x2="380" y2="75"/>
            </g>
            <g fill="#861f41" opacity=".75">
              <circle cx="70" cy="240" r="5"/><circle cx="140" cy="90" r="5"/>
              <circle cx="250" cy="60" r="5"/><circle cx="340" cy="140" r="5"/>
              <circle cx="320" cy="240" r="5"/><circle cx="180" cy="290" r="5"/>
            </g>
            <circle cx="250" cy="60" r="10" fill="none" stroke="#1a7d3c" stroke-width="3"/>
            <path d="M250 60l34-14" stroke="#33658a" stroke-width="2.5" fill="none"/>
            <path d="M284 46l-9-1 4 8z" fill="#33658a"/>
          </svg>

          <p class="l1-title-overline">ISE 5405 · Optimization I · Fall 2026</p>
          <h1>Lecture 0 — Syllabus &amp; Logistics</h1>
          <p class="l1-title-meta">Tue/Thu 9:30–10:45 a.m. · Durham Hall 261 ·
            <a href="https://canvas.vt.edu/courses/236227">Canvas course 236227</a></p>

          <div class="l1-key-row" aria-label="Presentation keyboard shortcuts">
            <span><kbd>→</kbd>/<kbd>Space</kbd> advance</span>
            <span><kbd>←</kbd> back</span>
            <span><kbd>F</kbd> fullscreen</span>
            <span><kbd>M</kbd> slide menu</span>
            <span><kbd>P</kbd> pen</span>
            <span><kbd>E</kbd> eraser</span>
            <span><kbd>C</kbd> clear ink</span>
            <span><kbd>L</kbd> laser</span>
            <span><kbd>W</kbd> whiteboard</span>
            <span><kbd>H</kbd> handout</span>
            <span><kbd>K</kbd> checkpoint</span>
            <span><kbd>?</kbd> help</span>
          </div>
          <p class="l1-handout-note"><strong>Saving a PDF handout (annotations included):</strong>
            press <kbd>H</kbd> for the handout view, then print and choose “Save as PDF.” The print view shows
            every reveal and includes saved ink. On iPad, open the handout, then use Share → Print → Save to Files.
            Annotations save locally per slide; use <strong>Export ink</strong> and <strong>Import ink</strong> to
            move a backup between browsers or devices.</p>
        </article>`,
    },
    {
      id: "l1-02",
      page: 2,
      title: "Course Logistics",
      minutes: 4,
      html: String.raw`
        <article class="l1-slide">
          <h2>Course Logistics</h2>
          <ul class="l1-list l1-logistics-list">
            <li><strong>Course:</strong> ISE 5405 — Optimization I</li>
            <li><strong>Term:</strong> Fall 2026</li>
            <li><strong>Meeting times:</strong> Tuesdays &amp; Thursdays, 9:30–10:45 a.m.</li>
            <li><strong>Location:</strong> Durham Hall 261</li>
            <li><strong>Canvas:</strong> <a href="https://canvas.vt.edu/courses/236227">canvas.vt.edu/courses/236227</a> — announcements (also e-mailed), assignments, solutions, and materials</li>
          </ul>
          <p class="l1-note">No formal prerequisite—but solid linear algebra and calculus, mathematical maturity,
            and basic coding are required. Warm-up: Strang’s MIT OpenCourseWare Linear Algebra, Lectures 1–10.</p>
          <aside class="l1-callout"><strong>Textbook:</strong> Bertsimas &amp; Tsitsiklis,
            <cite>Introduction to Linear Optimization</cite>, Athena Scientific.</aside>
        </article>`,
    },
    {
      id: "l1-03",
      page: 3,
      title: "Instructional Team",
      minutes: 5,
      html: String.raw`
        <article class="l1-slide">
          <h2>Instructional Team</h2>
          <section class="l1-person-card">
            <h3>Instructor</h3>
            <p><strong>Dr. Jiaxiang “Jason” Li</strong> · <a href="mailto:jasonljx@vt.edu">jasonljx@vt.edu</a></p>
            <p>Durham Hall 213 · <a href="https://jasonjiaxiangli.github.io/">jasonjiaxiangli.github.io</a></p>
            <p>Office hours: Thursdays, 11:00 a.m.–12:00 p.m. · Zoom meeting ID: <code>89033654462</code></p>
            <p class="l1-note">Prof. Robert Hildebrand teaches the August 25 and August 27 meetings online.</p>
          </section>
          <section class="l1-person-card l1-person-card--blue">
            <h3>Teaching Assistant</h3>
            <p><strong>Asha Barua</strong> · <a href="mailto:ashabarua@vt.edu">ashabarua@vt.edu</a></p>
            <p>Office hours: Tuesdays, 11:30 a.m.–12:30 p.m. · Durham Hall 214</p>
            <p>Zoom available upon request · meeting ID: <code>ashabarua</code></p>
            <p class="l1-note">Direct solver and Python questions to the TA first.</p>
          </section>
          <aside class="l1-callout l1-callout--orange" data-fragment>
            Please ask questions early and often—in class, in office hours, or on the discussion board.
          </aside>
        </article>`,
      fragmentCount: 1,
    },
    {
      id: "l1-04",
      page: 4,
      title: "About Your Guest Lecturer",
      minutes: 4,
      html: String.raw`
        <article class="l1-slide">
          <h2>About Your Guest Lecturer</h2>
          <p class="l1-lead"><strong>Dr. Robert Hildebrand</strong> — Associate Professor, ISE, Virginia Tech ·
            teaching the August 25 and August 27 meetings before Dr. Li takes over.</p>
          <section class="l1-card">
            <h3>Research</h3>
            <ul class="l1-list l1-list--compact">
              <li>Integer programming and mixed-integer nonlinear optimization</li>
              <li>Game theory and algorithms for multi-agent decisions</li>
              <li>Applied OR: redistricting, healthcare access, and disaster relief</li>
            </ul>
          </section>
          <section class="l1-card" data-fragment>
            <h3>Background &amp; hobbies</h3>
            <p>PhD in Applied Mathematics, UC Davis · postdoctoral work at ETH Zürich, IBM Research,
              and the Simons Institute · at Virginia Tech since 2019.</p>
            <p class="l1-note">Rock climbing · time with his kids</p>
          </section>
        </article>`,
      fragmentCount: 1,
    },
    {
      id: "l1-05",
      page: 5,
      title: "What We Will Learn to Do",
      minutes: 6,
      html: String.raw`
        <article class="l1-slide">
          <h2>What We Will Learn to Do</h2>
          <section class="l1-math-card">
            <h3>LP in general form</h3>
            <div class="ns-math-display">\[
              \begin{aligned}
                \min\quad &amp; c^\top x\\
                \text{s.t.}\quad &amp; Ax \le b,\quad A_{=}x=b_{=},\quad A_{\ge}x\ge b_{\ge}
              \end{aligned}
            \]</div>
            <p class="l1-note">Linear objective + linear constraints; solvable at enormous scale.</p>
          </section>
          <ul class="l1-list l1-learning-list">
            <li data-fragment><strong>Simplex family</strong> — walks corner to corner; fast in practice</li>
            <li data-fragment><strong>Duality &amp; optimality</strong> — <em>certificates</em> that a solution is best, plus sensitivity insight</li>
            <li data-fragment><strong>Modern solvers</strong> (Gurobi) — simplex + barrier + presolve, at industrial scale</li>
          </ul>
          <aside class="l1-callout" data-fragment>Theory ↔ computation: we prove <em>why</em> algorithms work,
            and use them on real models in Python.</aside>
        </article>`,
      fragmentCount: 4,
    },
    {
      id: "l1-06",
      page: 6,
      title: "Materials & Tools",
      minutes: 5,
      html: String.raw`
        <article class="l1-slide">
          <h2>Materials &amp; Tools</h2>
          <section class="l1-card">
            <h3>Textbook (primary)</h3>
            <p>Bertsimas &amp; Tsitsiklis, <cite>Introduction to Linear Optimization</cite>, 1997.</p>
            <h3 class="l1-subhead">References</h3>
            <p class="l1-small">Bazaraa, Jarvis &amp; Sherali, <cite>Linear Programming and Network Flows</cite> ·
              Dantzig &amp; Thapa, <cite>Linear Programming 1 &amp; 2</cite> ·
              Luenberger &amp; Ye, <cite>Linear and Nonlinear Programming</cite></p>
          </section>
          <section class="l1-card l1-card--blue" data-fragment>
            <h3>Software</h3>
            <ul class="l1-list l1-list--compact">
              <li><strong>Gurobi</strong> + Python interface <code>gurobipy</code> (free academic license)</li>
              <li>Assignments include Python modeling and solving</li>
              <li>Brief in-class tutorial; solver questions → TA</li>
            </ul>
            <p class="l1-note"><strong>Set up Python + <code>gurobipy</code> in the first weeks</strong>—do not wait for the homework that needs it.</p>
          </section>
        </article>`,
      fragmentCount: 1,
    },
    {
      id: "l1-07",
      page: 7,
      title: "Homework & Late Policy",
      minutes: 7,
      html: String.raw`
        <article class="l1-slide">
          <h2>Homework &amp; Late Policy</h2>
          <ul class="l1-list l1-homework-list">
            <li><strong>6 assignments</strong> (about every 2 weeks): 5 graded + 1 ungraded practice</li>
            <li>Each graded homework = <strong>10%</strong> of the course grade (50% total)</li>
            <li>Discuss freely—but <strong>write your own solutions</strong></li>
            <li>Submit <strong>one complete PDF per attempt</strong> on Canvas (+ code files when required). Attempts are unlimited through the cutoff; ordinarily the <strong>most recent complete attempt</strong> is graded, and its timestamp determines any late penalty.</li>
            <li>High-quality presentation is part of your grade</li>
          </ul>
          <section class="l1-late-policy" data-fragment aria-labelledby="l1-late-title">
            <h3 id="l1-late-title">Late penalty</h3>
            <table class="l1-table">
              <thead><tr><th scope="col">Days late</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">4</th></tr></thead>
              <tbody><tr><th scope="row">Penalty</th><td>15%</td><td>30%</td><td>45%</td><td>60%</td></tr></tbody>
            </table>
            <p class="l1-note">Hard cutoff 4 days (96 hours) after the deadline; any fraction of a day counts as a full day late.</p>
          </section>
        </article>`,
      fragmentCount: 1,
    },
    {
      id: "l1-08",
      page: 8,
      title: "Exams & Grading",
      minutes: 6,
      html: String.raw`
        <article class="l1-slide">
          <h2>Exams &amp; Grading</h2>
          <section class="l1-card">
            <h3>Exams</h3>
            <ul class="l1-list l1-list--compact">
              <li><strong>Midterm:</strong> Thursday, <strong>October 15</strong>, during class in Durham Hall 261</li>
              <li><strong>Final:</strong> Monday, <strong>December 14</strong>, 7:45–9:45 a.m., in Durham Hall 261 (comprehensive)</li>
              <li>Both are <strong>closed book, closed notes</strong></li>
              <li>No make-ups except university-authorized absences, documented emergencies, or approved accommodations</li>
            </ul>
          </section>
          <aside class="l1-callout" data-fragment><strong>Participation:</strong> arrive early and engage—expect in-class problem solving. Practice and discussion are ungraded.</aside>
          <section class="l1-grade-band" data-fragment aria-labelledby="l1-grades-title">
            <h3 id="l1-grades-title">Grading breakdown</h3>
            <dl class="l1-grade-list">
              <div><dt>Homework</dt><dd>50%</dd></div>
              <div><dt>Midterm</dt><dd>25%</dd></div>
              <div><dt>Final</dt><dd>25%</dd></div>
            </dl>
            <p class="l1-note">Letter scale: A 93+ · A− 90 · B+ 87 · B 83 · B− 80 · C+ 77 · C 73 · C− 70 · D+ 67 · D 63 · D− 60 · F &lt;60. A curve may be applied, never against you.</p>
          </section>
        </article>`,
      fragmentCount: 2,
    },
    {
      id: "l1-09",
      page: 9,
      title: "Key Dates — Fall 2026",
      minutes: 5,
      html: String.raw`
        <article class="l1-slide">
          <h2>Key Dates — Fall 2026</h2>
          <ol class="l1-date-grid">
            <li><strong>Aug 25 (Tue)</strong><span>First class meeting</span></li>
            <li data-fragment><strong>Sep 10</strong><span>Homework 1 due</span></li>
            <li data-fragment><strong>Sep 24</strong><span>Homework 2 due</span></li>
            <li data-fragment><strong>Oct 8</strong><span>Homework 3 due</span></li>
            <li class="l1-date-major" data-fragment><strong>Oct 15 (Thu)</strong><span>Midterm · in class</span></li>
            <li data-fragment><strong>Oct 29</strong><span>Homework 4 due</span></li>
            <li data-fragment><strong>Nov 12</strong><span>Homework 5 due</span></li>
            <li data-fragment><strong>Nov 24 &amp; 26</strong><span>No class · Thanksgiving</span></li>
            <li data-fragment><strong>Dec 3 · Dec 8</strong><span>Homework 6 due (ungraded) · last class</span></li>
            <li class="l1-date-major" data-fragment><strong>Dec 14 (Mon)</strong><span>Final · 7:45–9:45 a.m. · Durham 261</span></li>
          </ol>
          <aside class="l1-callout" data-fragment>Homework lands on Thursdays, roughly every two weeks.
            Homework dates may shift (Canvas is authoritative); exam dates follow the official university schedule.</aside>
        </article>`,
      fragmentCount: 10,
    },
    {
      id: "l1-10",
      page: 10,
      title: "Policies in Brief",
      minutes: 7,
      html: String.raw`
        <article class="l1-slide l1-policies-slide">
          <h2>Policies in Brief</h2>
          <section class="l1-policy-card">
            <h3>Graduate Honor Code</h3>
            <p>Attempt problems on your own first. Discussion with classmates, the TA, or instructor is limited to
              <strong>general ideas and strategies</strong>—never exchange written material. Cite every external reference
              (books, websites, people, or AI): failure to cite is treated as cheating, while properly cited sources are
              not penalized. Suspected violations are reported to the Graduate Honor System.</p>
          </section>
          <section class="l1-policy-card l1-policy-card--blue" data-fragment>
            <h3>Accommodations</h3>
            <p>If you anticipate barriers due to a disability, contact SSD: 540-231-3788 ·
              <a href="mailto:ssd@vt.edu">ssd@vt.edu</a> · <a href="https://ssd.vt.edu/">ssd.vt.edu</a>.
              Have a letter? Meet with the instructor early (generally at least 5 business days’ notice; 10 for the final).</p>
          </section>
          <section class="l1-policy-card l1-policy-card--orange" data-fragment>
            <h3>Regrades</h3>
            <p>Within <strong>7 days</strong> of scores posting, submit to the <strong>instructor</strong> (not the TA), citing
              the specific suspected error against the posted key. Homework: e-mail. Exams: explanation sheet stapled to
              the front. The new score stands—higher, the same, or lower—and other parts may be regraded.</p>
          </section>
          <section class="l1-policy-card" data-fragment>
            <h3>In-class practice</h3>
            <p>Short exercises most meetings—ungraded and purely for practice, feedback, and discussion. Bring a laptop and charger when requested.</p>
          </section>
        </article>`,
      fragmentCount: 3,
    },
    {
      id: "l1-11",
      page: 11,
      title: "Generative AI in This Course",
      minutes: 5,
      html: String.raw`
        <article class="l1-slide">
          <h2>Generative AI in This Course</h2>
          <section class="l1-policy-card l1-policy-card--green">
            <h3>Allowed, unless an assignment says otherwise</h3>
            <p>Brainstorming and exploring ideas · clarifying concepts from lecture or the textbook · debugging your own code</p>
          </section>
          <section class="l1-policy-card l1-policy-card--red" data-fragment>
            <h3>Not allowed</h3>
            <p>Any AI use <strong>during exams</strong> · generating complete solutions, proofs, written explanations, or code that you submit as your own</p>
          </section>
          <aside class="l1-callout l1-callout--orange" data-fragment><strong>Disclosure required:</strong>
            if permitted AI assistance contributes to submitted work, add a brief note naming the tool and how you used it.
            You remain responsible for correctness and for citing external sources.</aside>
          <aside class="l1-callout" data-fragment>Undisclosed or unauthorized use is treated as a potential
            Graduate Honor Code violation. Unsure whether a use is permitted? <strong>Ask first.</strong></aside>
        </article>`,
      fragmentCount: 3,
    },
    {
      id: "l1-12",
      page: 12,
      title: "Topics Roadmap (tentative)",
      minutes: 6,
      html: String.raw`
        <article class="l1-slide l1-roadmap-slide">
          <h2>Topics Roadmap <span class="l1-heading-note">(tentative)</span></h2>
          <ol class="l1-roadmap" aria-label="Tentative course topic sequence">
            <li><strong>Chapter 1</strong><span>Introduction and formulations; LP / IP modeling</span></li>
            <li data-fragment><strong>Chapter 2</strong><span>LP geometry—polyhedra, extreme points; linear algebra refresher</span></li>
            <li data-fragment><strong>Python + Gurobi</strong><span>Modeling with <code>gurobipy</code></span></li>
            <li data-fragment><strong>Chapter 3</strong><span>Simplex—tableau, two-phase, degeneracy, revised simplex</span></li>
            <li data-fragment><strong>Chapter 4</strong><span>Duality; complementary slackness; Farkas; KKT</span></li>
            <li data-fragment><strong>Chapter 5</strong><span>Sensitivity analysis and optimality ranges</span></li>
            <li data-fragment><strong>Variants</strong><span>Dual simplex and bounded variables</span></li>
            <li data-fragment><strong>If time</strong><span>Interior-point methods at scale; PDHG/PDLP for huge LPs</span></li>
          </ol>
          <aside class="l1-callout l1-callout--orange" data-fragment><strong>Milestones:</strong>
            homework due Thursdays about every 2 weeks · midterm October 15 · final December 14.
            Exact dates live on Canvas.</aside>
        </article>`,
      fragmentCount: 8,
    },
    {
      id: "l1-13",
      page: 13,
      title: "First-Week To-Dos",
      minutes: 4,
      html: String.raw`
        <article class="l1-slide l1-closing-slide">
          <h2>First-Week To-Dos</h2>
          <ol class="l1-list l1-todo-list">
            <li>Complete the brief intro survey on Canvas</li>
            <li data-fragment>Skim Bertsimas–Tsitsiklis Chapter 1; dust off your linear algebra</li>
            <li data-fragment>(Soon) Install Python + <code>gurobipy</code> with an academic Gurobi license</li>
            <li data-fragment>Bookmark the
              <a href="https://open-optimization.github.io/open-optimization-or-book/visualizations/">interactive demo site</a>—start with <code>#modeling-intro</code></li>
          </ol>
          <div class="l1-welcome" data-fragment>
            <p>Welcome to ISE 5405!</p>
            <span>Questions?</span>
          </div>
        </article>`,
      fragmentCount: 4,
    },
  ]),
  mountInteraction,
});

export default deck;
