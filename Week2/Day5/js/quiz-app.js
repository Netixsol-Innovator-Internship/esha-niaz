// Vanilla Quiz App (HTML + Tailwind + JS only)

// ROUTE FILENAMES
const PAGES = {
  select: "myQuizess.html",
  start: "quiz_start.html",
  result: "quiz_result.html",
  review: "review_result.html",
}

// Filters we support on the Select page
const FILTERS = ["all", "html", "css", "javascript", "tailwind", "react"]
let currentFilter = "all"

// 1) Quiz data (from your JSON)
const QUIZZES = [
  { id: "html", title: "HTML", description: "Structure the web with semantic markup.", image: "images/html_final.jpg",
    questions: [
      { id: 1, question: "What does HTML stand for?", options: ["HyperText Markup Language","Home Tool Markup Language","Hyperlinks and Text Markup Language","Hyper Transfer Markup Language"], answer: 0 },
      { id: 2, question: "Which tag represents the largest heading?", options: ["<h6>","<head>","<h1>","<header>"], answer: 2 },
      { id: 3, question: "Which element is used to create a hyperlink?", options: ["<a>","<link>","<href>","<url>"], answer: 0 },
      { id: 4, question: "Which attribute is required on an <img> element to display an image?", options: ["alt","src","title","width"], answer: 1 },
      { id: 5, question: "Which of the following is a semantic HTML element?", options: ["<div>","<span>","<article>","<b>"], answer: 2 },
      { id: 6, question: "Which tag defines a row in a table?", options: ["<td>","<tr>","<th>","<table>"], answer: 1 },
      { id: 7, question: "What is the correct HTML5 doctype?", options: ["<!DOCTYPE HTML5>","<!DOCTYPE html>","<!DOCTYPE HTML PUBLIC>","<doctype html>"], answer: 1 },
      { id: 8, question: "Which element creates an ordered list?", options: ["<ul>","<list>","<ol>","<li>"], answer: 2 },
      { id: 9, question: "Which input type validates email format?", options: ["text","email","mail","address"], answer: 1 },
      { id: 10, question: "Which element contains metadata like title and meta tags?", options: ["<head>","<header>","<meta>","<section>"], answer: 0 },
    ]
  },
  { id: "css", title: "CSS", description: "Style your pages with modern CSS.", image: "images/css_final.jpg",
    questions: [
      { id: 1, question: "What does CSS stand for?", options: ["Creative Style Sheets","Computer Styled Sections","Cascading Style Sheets","Colorful Style Sheets"], answer: 2 },
      { id: 2, question: 'How do you select an element with id="main"?', options: ["main",".main","#main","*main"], answer: 2 },
      { id: 3, question: "Which property changes the text color?", options: ["font-color","text-color","color","font-style"], answer: 2 },
      { id: 4, question: "How do you create a flex container?", options: ["display: inline;","display: flex;","position: flex;","flex: container;"], answer: 1 },
      { id: 5, question: "Center a block horizontally with fixed width:", options: ["text-align: center;","margin: 0 auto;","justify-content: center;","align-items: center;"], answer: 1 },
      { id: 6, question: "Which pseudo-class styles an element on hover?", options: [":focus",":active",":visited",":hover"], answer: 3 },
      { id: 7, question: "Which unit is relative to the root font size?", options: ["em","rem","px","%"], answer: 1 },
      { id: 8, question: "Correct media query for min-width 768px?", options: ["@media (min: 768px)","@media (min-width: 768px)","@media screen >= 768px","@media width >= 768px"], answer: 1 },
      { id: 9, question: "Which positioning removes the element from normal flow and positions it relative to the viewport?", options: ["absolute","relative","sticky","fixed"], answer: 3 },
      { id: 10, question: "How do you use a CSS custom property?", options: ["var(primary)","var(--primary)","--primary()","prop(--primary)"], answer: 1 },
    ]
  },
  { id: "javascript", title: "JavaScript", description: "Add interactivity with JavaScript.", image: "images/js_2.jpg",
    questions: [
      { id: 1, question: "Which keyword declares a block-scoped variable?", options: ["var","let","define","const var"], answer: 1 },
      { id: 2, question: "Which operator checks both value and type?", options: ["==","=","===","!="], answer: 2 },
      { id: 3, question: "Which method adds an item to the end of an array?", options: ["push()","pop()","shift()","unshift()"], answer: 0 },
      { id: 4, question: "What is the typeof null?", options: ["null","undefined","object","string"], answer: 2 },
      { id: 5, question: "Arrow function syntax is:", options: ["function => () {}","() => {}","=> () {}","() <= {}"], answer: 1 },
      { id: 6, question: "setTimeout is used to:", options: ["Repeat a task every X ms","Delay a function once","Block the thread","Create a Promise"], answer: 1 },
      { id: 7, question: "JSON.parse() does what?", options: ["Converts object to string","Converts string to number","Parses JSON string to object","Parses HTML to DOM"], answer: 2 },
      { id: 8, question: "Which defines a class?", options: ["object {}","class Person {}","def class {}","class: Person"], answer: 1 },
      { id: 9, question: "Which method attaches a success handler to a Promise?", options: [".catch()",".then()",".finally()",".success()"], answer: 1 },
      { id: 10, question: "Which array method returns a new array with transformed items?", options: ["forEach","map","reduce","filterInPlace"], answer: 1 },
    ]
  },
  { id: "tailwind", title: "Tailwind CSS", description: "Utility-first styling with Tailwind.", image: "images/tailwind_2.jpg",
    questions: [
      { id: 1, question: "Tailwind is primarily a ____ framework.", options: ["component","utility-first","BEM","inline-style"], answer: 1 },
      { id: 2, question: "Which class centers text?", options: ["center","text-center","align-center","content-center"], answer: 1 },
      { id: 3, question: "Add margin-top 1rem:", options: ["mt-2","mt-4","m-4t","pt-4"], answer: 1 },
      { id: 4, question: "Apply styles from the md breakpoint and up:", options: ["md()","screen-md:","md:","bp-md:"], answer: 2 },
      { id: 5, question: "Create a flex container:", options: ["flex","flexbox","d-flex","display-flex"], answer: 0 },
      { id: 6, question: "Make element take full width:", options: ["w-100","w-full","width-full","full-w"], answer: 1 },
      { id: 7, question: "Horizontal padding 1.5rem:", options: ["p-6","px-6","py-6","plr-6"], answer: 1 },
      { id: 8, question: "Add rounded corners:", options: ["rounded","radius","curve","corner"], answer: 0 },
      { id: 9, question: "Class for blue button background (600 shade):", options: ["bg-blue","bg-blue-600","text-blue-600","btn-blue"], answer: 1 },
      { id: 10, question: "Enable styles in dark mode:", options: ["theme:dark","dark:","mode-dark:","if-dark:"], answer: 1 },
    ]
  },
  { id: "react", title: "React", description: "Build interfaces with components and hooks.", image: "images/react_final.jpg",
    questions: [
      { id: 1, question: "React is mainly used for building:", options: ["Databases","User interfaces","Servers","Operating systems"], answer: 1 },
      { id: 2, question: "Components typically return:", options: ["HTML strings","JSX","CSS","JSON"], answer: 1 },
      { id: 3, question: "Which hook adds state to a function component?", options: ["useContext","useEffect","useState","useRef"], answer: 2 },
      { id: 4, question: "Props are used to:", options: ["Manage local state","Pass data from parent to child","Register events globally","Trigger re-render manually"], answer: 1 },
      { id: 5, question: "Keys in lists help React:", options: ["Apply CSS","Identify elements","Create portals","Optimize network requests"], answer: 1 },
      { id: 6, question: "Which hook runs side effects?", options: ["useMemo","useEffect","useLayout","useCache"], answer: 1 },
      { id: 7, question: "Use which attribute for CSS classes in JSX?", options: ["class","className","classList","styleClass"], answer: 1 },
      { id: 8, question: "How do you render a list of items?", options: ["items.each()","for (item of items)","items.map()","items.render()"], answer: 2 },
      { id: 9, question: "For sharing state across many components, use:", options: ["CSS Modules","Context API","Service Workers","Web Components"], answer: 1 },
      { id: 10, question: "A controlled input in React means:", options: ["The browser controls it","Value is stored in state and updated via onChange","It is disabled","It has validation"], answer: 1 },
    ]
  }
]

// 2) Helpers
function byId(id) { return document.getElementById(id) }
function getParam(name) { return new URLSearchParams(location.search).get(name) }
function getQuiz(id) { return QUIZZES.find(q => q.id === id) }

// Small helper to escape HTML for safe injection
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

// New helper to save quiz results for the current user
function saveResultForCurrentUser({ quizId, quizTitle, score, total }) {
  let currentUser = null
  try { currentUser = JSON.parse(localStorage.getItem("currentUser")) } catch {}
  if (!currentUser?.email) return // not logged in; skip persisting history

  const key = `results:${currentUser.email}`
  let list = []
  try { list = JSON.parse(localStorage.getItem(key)) || [] } catch {}
  list.push({ quizId, quizTitle, score, total, date: new Date().toISOString() })
  localStorage.setItem(key, JSON.stringify(list))
}

// 3) Page routers
document.addEventListener("DOMContentLoaded", () => {
  if (byId("featured-grid") && byId("all-quizzes-list")) {
    renderSelectPage()
    return
  }
  if (byId("options-form") && byId("options-list")) {
    renderStartPage()
    return
  }
  if (byId("score-value") && byId("result-progress-fill")) {
    renderResultPage()
    return
  }
  if (byId("review-list")) {
    renderReviewPage()
    return
  }
})

// 4) Select Quiz page (with filters)
function renderSelectPage() {
  const filtersEl = byId("quiz-filters")
  const featuredGrid = byId("featured-grid")
  const allList = byId("all-quizzes-list")

  function getFilteredQuizzes() {
    if (currentFilter === "all") return QUIZZES
    return QUIZZES.filter((q) => q.id === currentFilter)
  }

  function paintActiveFilter() {
    if (!filtersEl) return
    const buttons = filtersEl.querySelectorAll("[data-filter]")
    buttons.forEach((btn) => {
      const isActive = btn.getAttribute("data-filter") === currentFilter
      if (isActive) {
        btn.setAttribute("aria-current", "page")
        btn.className =
          "rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs sm:text-[13px] font-medium text-neutral-900"
      } else {
        btn.removeAttribute("aria-current")
        btn.className =
          "rounded-full border border-transparent bg-neutral-100 px-3 py-1 text-xs sm:text-[13px] text-neutral-700 hover:bg-neutral-200"
      }
    })
  }

  function renderLists() {
    const data = getFilteredQuizzes()

    // Featured (top 3 of filtered)
    featuredGrid.innerHTML = ""
    const featured = data.slice(0, 3)
    if (featured.length === 0) {
      featuredGrid.innerHTML =
        '<p class="text-sm text-neutral-600">No featured quizzes in this category.</p>'
    } else {
      featured.forEach((quiz) => {
        const article = document.createElement("article")
        article.className = "group cursor-pointer"
        article.innerHTML = `
          <div class="overflow-hidden rounded-lg">
            <img src="${quiz.image}" alt="${quiz.title} thumbnail"
              class="h-[143px] w-full object-cover transition-transform group-hover:scale-[1.02]" />
          </div>
          <h3 class="mt-2 text-sm font-medium">${quiz.title}</h3>
          <p class="mt-1 text-xs text-neutral-600">${quiz.description}</p>
        `
        article.addEventListener("click", () => {
          location.href = `${PAGES.start}?id=${encodeURIComponent(quiz.id)}`
        })
        featuredGrid.appendChild(article)
      })
    }

    // All
    allList.innerHTML = ""
    if (data.length === 0) {
      allList.innerHTML =
        '<li class="text-sm text-neutral-600">No quizzes found for this category.</li>'
      return
    }
    data.forEach((quiz) => {
      const li = document.createElement("li")
      li.className = "grid grid-cols-1 md:grid-cols-[1fr_280px] gap-3 md:gap-6"
      li.innerHTML = `
        <div>
          <h3 class="text-xl font-medium">
            <a href="${PAGES.start}?id=${encodeURIComponent(quiz.id)}" class="hover:underline">${quiz.title}</a>
          </h3>
          <p class="mt-1 text-xs text-neutral-600">${quiz.description}</p>
        </div>
        <a href="${PAGES.start}?id=${encodeURIComponent(quiz.id)}" class="block">
          <img src="${quiz.image}" alt="${quiz.title} thumbnail"
            class="h-[171px] w-full md:w-[280px] rounded-md object-cover" />
        </a>
      `
      allList.appendChild(li)
    })
  }

  // Wire filter clicks (event delegation)
  if (filtersEl) {
    filtersEl.addEventListener("click", (e) => {
      const target = e.target.closest("[data-filter]")
      if (!target) return
      const next = target.getAttribute("data-filter")
      if (!next || !FILTERS.includes(next)) return
      currentFilter = next
      paintActiveFilter()
      renderLists()
    })
  }

  // Initial
  paintActiveFilter()
  renderLists()
}

// 5) Start Quiz page
function renderStartPage() {
  const id = getParam("id")
  const quiz = getQuiz(id || "")
  if (!quiz) {
    location.href = PAGES.select
    return
  }

  const titleEl = byId("question-text")
  const progressFill = byId("progress-fill")
  const progressText = byId("progress-text")
  const hoursEl = byId("hours")
  const minutesEl = byId("minutes")
  const secondsEl = byId("seconds")
  const form = byId("options-form")
  const optionsList = byId("options-list")
  const prevBtn = byId("prev-btn")
  const nextBtn = byId("next-btn")

  let index = 0
  const total = quiz.questions.length
  const answers = new Array(total).fill(null)

  // Timer
  let elapsed = 0
  setInterval(() => {
    elapsed += 1
    const h = Math.floor(elapsed / 3600)
    const m = Math.floor((elapsed % 3600) / 60)
    const s = elapsed % 60
    hoursEl.textContent = String(h).padStart(2, "0")
    minutesEl.textContent = String(m).padStart(2, "0")
    secondsEl.textContent = String(s).padStart(2, "0")
  }, 1000)

  function renderQuestion() {
    const q = quiz.questions[index]
    titleEl.textContent = q.question

    // Progress
    const pct = Math.round(((index + 1) / total) * 100)
    progressFill.style.width = pct + "%"
    progressText.textContent = `Question ${index + 1} of ${total}`

    // Options
    optionsList.innerHTML = ""
    q.options.forEach((opt, optIdx) => {
      const label = document.createElement("label")
      label.className = "flex items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 cursor-pointer"

      const input = document.createElement("input")
      input.type = "radio"
      input.name = "answer"
      input.value = String(optIdx)
      input.className = "h-4 w-4 rounded-full border-neutral-300 text-neutral-900 focus:ring-neutral-900"
      input.checked = answers[index] === optIdx
      input.addEventListener("change", () => {
        answers[index] = optIdx
      })

      const span = document.createElement("span")
      span.className = "text-sm"
      span.textContent = opt

      label.appendChild(input)
      label.appendChild(span)
      optionsList.appendChild(label)
    })

    // Buttons
    prevBtn.disabled = index === 0
    nextBtn.textContent = index < total - 1 ? "Next" : "Finish"
  }

  prevBtn.addEventListener("click", () => {
    index = Math.max(0, index - 1)
    renderQuestion()
  })

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (index < total - 1) {
      index += 1
      renderQuestion()
    } else {
      const score = answers.reduce((acc, ans, i) => {
        return acc + (ans === quiz.questions[i].answer ? 1 : 0)
      }, 0)

      // Save attempt for review (existing)
      try {
        sessionStorage.setItem(`quizAttempt:${quiz.id}`, JSON.stringify({ answers, ts: Date.now() }))
      } catch {}

      // NEW: persist result for profile history (if logged in)
      saveResultForCurrentUser({ quizId: quiz.id, quizTitle: quiz.title, score, total })

      // Navigate to result
      location.href = `${PAGES.result}?id=${encodeURIComponent(quiz.id)}&score=${score}&total=${total}`
    }
  })

  // Initial render
  renderQuestion()
}

// 6) Result page
function renderResultPage() {
  const id = getParam("id")
  const score = Number(getParam("score") || 0)
  const total = Number(getParam("total") || 0)
  const quiz = getQuiz(id || "")

  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  // Elements
  const title = document.querySelector("h1")
  const completionText = byId("completion-text")
  const fill = byId("result-progress-fill")
  const scoreEl = byId("score-value")
  const primary = byId("primary-action")
  const secondary = byId("secondary-action")

  if (quiz && title) {
    title.textContent = quiz.title + " Quiz Results"
  }
  if (completionText) completionText.textContent = pct + "%"
  if (fill) fill.style.width = pct + "%"
  if (scoreEl) scoreEl.textContent = `${score}/${total}`

  // Primary => Review Answers
  if (primary) {
    primary.textContent = "Review Answers"
    primary.addEventListener("click", () => {
      if (quiz) location.href = `${PAGES.review}?id=${encodeURIComponent(quiz.id)}`
      else location.href = PAGES.select
    })
  }
  // Secondary => Take another quiz
  if (secondary) {
    secondary.textContent = "Take Another Quiz"
    secondary.addEventListener("click", () => {
      location.href = PAGES.select
    })
  }
}

// 7) Review page
function renderReviewPage() {
  const id = getParam("id")
  const quiz = getQuiz(id || "")
  const title = byId("review-title")
  const list = byId("review-list")
  const backBtn = byId("back-to-quizzes")

  if (backBtn) {
    backBtn.addEventListener("click", () => (location.href = PAGES.select))
  }

  if (!quiz) {
    if (title) title.textContent = "Quiz not found"
    if (list) {
      list.innerHTML =
        '<li class="text-sm text-neutral-600">We could not find that quiz. Please go back and try again.</li>'
    }
    return
  }

  if (title) title.textContent = "Review Incorrect Answers"

  let attempt = null
  try {
    const raw = sessionStorage.getItem(`quizAttempt:${quiz.id}`)
    attempt = raw ? JSON.parse(raw) : null
  } catch {}

  if (!attempt || !Array.isArray(attempt.answers)) {
    list.innerHTML =
      '<li class="text-sm text-neutral-600">No recent attempt found. Finish the quiz to see review details.</li>'
    return
  }

  const answers = attempt.answers
  const incorrect = quiz.questions
    .map((q, i) => ({ q, idx: i, chosen: answers[i] }))
    .filter(({ q, chosen }) => chosen !== q.answer)

  // If all correct
  if (incorrect.length === 0) {
    list.innerHTML =
      '<li class="text-sm text-neutral-700">Great job! All your answers were correct.</li>'
    return
  }

  // Render incorrect items
  list.innerHTML = ""
  incorrect.forEach(({ q, idx, chosen }) => {
    const li = document.createElement("li")
    li.className = "space-y-2"
    const yourAnswer =
      chosen == null ? "Not answered" : q.options[chosen] ?? "Not answered"
    const correctAnswer = q.options[q.answer]

    li.innerHTML = `
      <h2 class="text-sm font-semibold">Question ${idx + 1}</h2>
      <p class="text-sm text-neutral-900">${escapeHtml(q.question)}</p>

      <p class="text-sm text-neutral-600 mt-2"><span class="font-medium">Your answer:</span> ${escapeHtml(yourAnswer)}</p>
      <p class="text-sm text-neutral-600"><span class="font-medium">Correct answer:</span> ${escapeHtml(correctAnswer)}</p>
    `
    list.appendChild(li)
  })
}