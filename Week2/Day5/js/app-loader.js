// SPA page loader + auth helpers + profile hydration

const app = document.getElementById("app")

function loadPage(pageUrl) {
  fetch(pageUrl)
    .then((res) => res.text())
    .then((html) => {
      app.innerHTML = html
      attachEvents() // rewire events each time we load a page
    })
}

// Expose for standalone pages to call if needed
window.loadPage = loadPage

// --------- Storage helpers ----------
function getUsers() {
  try { return JSON.parse(localStorage.getItem("users")) || [] } catch { return [] }
}
function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("currentUser")) || null } catch { return null }
}
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user))
}
function getUserResults(email) {
  try { return JSON.parse(localStorage.getItem(`results:${email}`)) || [] } catch { return [] }
}

// Centralized navigation back to the SPA root (index.html)
function goHome() {
  // If we're already inside index.html (SPA container exists), just load landing
  if (document.getElementById("app")) {
    loadPage("landing_page.html")
  } else {
    // Otherwise, go to the SPA root; it will auto-load landing_page.html
    location.href = "index.html"
  }
}

// --------- Attach events based on loaded page ----------
function attachEvents() {
  const getStartedBtn = document.getElementById("getStartedBtn")
  const goToLoginFromSignup = document.getElementById("loginpage")
  const goToSignupFromLogin = document.getElementById("backtosignup")

  const signupForm = document.querySelector("#signup-form")
  const loginForm = document.querySelector("#login-form")

  // Landing: Get Started
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      const users = getUsers()
      if (users.length > 0) {
        loadPage("sign_in.html")
      } else {
        loadPage("sign_up.html")
      }
    })
  }

  // Cross-links between auth pages
  if (goToLoginFromSignup) {
    goToLoginFromSignup.addEventListener("click", () => loadPage("sign_in.html"))
  }
  if (goToSignupFromLogin) {
    goToSignupFromLogin.addEventListener("click", () => loadPage("sign_up.html"))
  }

  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const fullName = document.getElementById("full-name").value.trim()
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value.trim()
      const confirm_password = document.getElementById("confirm-password").value.trim()

      if (!fullName || !email || !password || !confirm_password) {
        alert("All fields are required!")
        return
      }
      if (password !== confirm_password) {
        alert("Passwords do not match!")
        return
      }

      let users = getUsers()
      const existingUser = users.find((user) => user.email === email)
      if (existingUser) {
        alert("Email already registered. Please login.")
        loadPage("sign_in.html")
        return
      }

      users.push({ fullName, email, password, joinedAt: new Date().toISOString() })
      setUsers(users)
      alert("Signup Successful!")
      loadPage("sign_in.html")
    })
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value.trim()
      if (!email || !password) {
        alert("Please enter both Email and Password")
        return
      }
      const users = getUsers()
      const foundUser = users.find((user) => user.email === email && user.password === password)

      if (foundUser) {
        alert("Login Successful!")
        setCurrentUser({ fullName: foundUser.fullName, email: foundUser.email, joinedAt: foundUser.joinedAt })
        loadPage("profile_page.html")
      } else {
        alert("Invalid email or password!")
      }
    })
  }

  // Profile hydration + logout
  const piName = document.getElementById("pi-name")
  const piEmail = document.getElementById("pi-email")
  const profileName = document.getElementById("profile-name")
  const profileJoined = document.getElementById("profile-joined")
  const historyBody = document.getElementById("quiz-history-body")
  const logoutBtn = document.getElementById("logout-btn")
  const logoutBtnMobile = document.getElementById("logout-btn-mobile")

  if (piName && piEmail && profileName && profileJoined && historyBody) {
    hydrateProfilePage({ piName, piEmail, profileName, profileJoined, historyBody })
  }

  function doLogout() {
    localStorage.removeItem("currentUser")
    alert("Logged out.")
    goHome()
  }

  if (logoutBtn) logoutBtn.addEventListener("click", (e) => { e.preventDefault(); doLogout() })
  if (logoutBtnMobile) logoutBtnMobile.addEventListener("click", (e) => { e.preventDefault(); doLogout() })
}

// Fill in profile name/email and quiz history
function hydrateProfilePage({ piName, piEmail, profileName, profileJoined, historyBody }) {
  const user = getCurrentUser()
  if (!user) {
    alert("Please sign in to view your profile.")
    // Prefer SPA if available
    if (document.getElementById("app")) {
      loadPage("sign_in.html")
    } else {
      // go to SPA root so you can sign in via SPA
      location.href = "index.html"
    }
    return
  }

  profileName.textContent = user.fullName || "—"
  piName.textContent = user.fullName || "—"
  piEmail.textContent = user.email || "—"
  profileJoined.textContent = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-CA")
    : "—"

  const rows = getUserResults(user.email)
  historyBody.innerHTML = ""
  if (!rows.length) {
    const tr = document.createElement("tr")
    tr.className = "[&>td]:px-4 [&>td]:py-4"
    tr.innerHTML = `<td colspan="3" class="text-[#61738A]">No quiz attempts yet.</td>`
    historyBody.appendChild(tr)
    return
  }

  rows
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
    .reverse()
    .forEach((r) => {
      const tr = document.createElement("tr")
      tr.className = "[&>td]:px-4 [&>td]:py-4"
      const dateStr = r.date ? new Date(r.date).toLocaleDateString("en-CA") : "—"
      tr.innerHTML = `
        <td>${r.quizTitle || r.quizId}</td>
        <td class="text-[#61738A]">${r.score}/${r.total}</td>
        <td class="text-[#61738A]">${dateStr}</td>
      `
      historyBody.appendChild(tr)
    })
}

// Expose for standalone pages to re-use if app-loader is present
window.hydrateProfilePage = hydrateProfilePage

// Start with landing page inside SPA
loadPage("landing_page.html")



