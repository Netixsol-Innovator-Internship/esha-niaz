function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isValidDate(day, month, year) {
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
}

function showError(inputId, message) {
  const inputGroup = document.getElementById(inputId).parentElement;

  // Label red
  const label = inputGroup.querySelector("label");
  label.style.color = "hsl(0, 100%, 67%)";

  // Input border red
  const input = inputGroup.querySelector("input");
  input.style.borderColor = "hsl(0, 100%, 67%)";

  // Add error message if not already there
  let error = inputGroup.querySelector(".error-message");
  if (!error) {
    error = document.createElement("small");
    error.className = "error-message";
    error.style.color = "hsl(0, 100%, 67%)";
    error.style.fontSize = "10px";
    error.style.marginTop = "5px";
    inputGroup.appendChild(error);
  }
  error.textContent = message;
}

function clearErrors() {
  const inputGroups = document.querySelectorAll(".input-group");
  inputGroups.forEach(group => {
    group.querySelector("label").style.color = ""; // Reset label
    const input = group.querySelector("input");
    input.style.borderColor = ""; // Reset border

    const error = group.querySelector(".error-message");
    if (error) error.remove();
  });
}


function animateCountUp(elementId, target, duration = 1000) {
  const element = document.getElementById(elementId);
  let start = 0;
  const increment = target / (duration / 20); // update every 20ms
  const interval = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(interval);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 20);
}

document.getElementById("calculate").addEventListener("click", function () {
  clearErrors();

  const dayInput = document.getElementById("day");
  const monthInput = document.getElementById("month");
  const yearInput = document.getElementById("year");

  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  const currentDate = new Date();
  const birthDate = new Date(year, month - 1, day);

  let hasError = false;

  // Required field checks (simple first pass)
  if (!dayInput.value.trim()) {
    showError("day", "This field is required");
    hasError = true;
  }
  if (!monthInput.value.trim()) {
    showError("month", "This field is required");
    hasError = true;
  }
  if (!yearInput.value.trim()) {
    showError("year", "This field is required");
    hasError = true;
  }

  // Stop further validation if any field is empty
  if (hasError) return;

  // Now do individual validation
  validateField("day");
  validateField("month");
  validateField("year");

  // Re-check for visible error messages
  const anyErrorStill = document.querySelectorAll(".error-message");
  if (anyErrorStill.length > 0) return;


if (!hasError) {
  if (!isValidDate(day, month, year)) {
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check if month is invalid (e.g. 13)
    if (month < 1 || month > 12) {
      showError("month", "Must be a valid month");
    }
    // Check if day is invalid for a valid month
    else if (day < 1 || day > daysInMonth[month - 1]) {
      showError("day", "Must be a valid date" );
    }
    // Otherwise, fallback
    else {
      showError("day", "Must be a valid date");
    }

    hasError = true;
  }
}

  // Future date check
  if (!hasError && birthDate >= currentDate) {
    showError("year", "Must be in past");
    hasError = true;
  }

  if (hasError) {
    document.getElementById("years").textContent = "--";
    document.getElementById("months").textContent = "--";
    document.getElementById("days").textContent = "--";
    return;
  }

  // Age calculation
  let ageYear = currentDate.getFullYear() - birthDate.getFullYear();
  let ageMonth = currentDate.getMonth() - birthDate.getMonth();
  let ageDay = currentDate.getDate() - birthDate.getDate();

  if (ageDay < 0) {
    ageMonth--;
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    ageDay += lastMonth.getDate();
  }

  if (ageMonth < 0) {
    ageYear--;
    ageMonth += 12;
  }

animateCountUp("years", ageYear);
animateCountUp("months", ageMonth);
animateCountUp("days", ageDay);


     // ✅ Show clear button
  document.getElementById("clear-container").classList.remove("hidden");
});

// ✅ Clear button functionality
// ✅ Clear button functionality without page reload
document.getElementById("clear-btn").addEventListener("click", function () {
  // Clear input fields
  document.getElementById("day").value = "";
  document.getElementById("month").value = "";
  document.getElementById("year").value = "";

  // Reset output
  document.getElementById("years").textContent = "--";
  document.getElementById("months").textContent = "--";
  document.getElementById("days").textContent = "--";

  // Hide clear button again (optional)
  document.getElementById("clear-container").classList.add("hidden");

  // Clear errors if any
  clearErrors();
});


// Remove error styles and messages when any input is focused
// ["day", "month", "year"].forEach((id) => {
//   const input = document.getElementById(id);
//   input.addEventListener("focus", () => {
//     const group = input.parentElement;
//     const error = group.querySelector(".error-message");
//     if (error) error.remove();

//     input.style.borderColor = ""; // Reset border
//     group.querySelector("label").style.color = ""; // Reset label color
//   });
// });



function validateField(id) {
  const day = parseInt(document.getElementById("day").value, 10);
  const month = parseInt(document.getElementById("month").value, 10);
  const year = parseInt(document.getElementById("year").value, 10);
  const currentDate = new Date();

  const input = document.getElementById(id);
  const value = input.value.trim();

  // Required field check
  if (value === "") {
    showError(id, "This field is required");
    return;
  }

  // Individual field checks
  if (id === "day") {
    if (isNaN(day) || day < 1 || day > 31) {
      showError("day", "Must be a valid day");
      return;
    } else {
      clearFieldError("day");
    }
  }

  if (id === "month") {
    if (isNaN(month) || month < 1 || month > 12) {
      showError("month", "Must be a valid month");
      return;
    } else {
      clearFieldError("month");
    }
  }

  if (id === "year") {
    if (isNaN(year) || year < 1900 || year > currentDate.getFullYear()) {
      showError("year", "Must be a valid year");
      return;
    } else if (!isNaN(day) && !isNaN(month) && new Date(year, month - 1, day) >= currentDate) {
      showError("year", "Must be in past");
      return;
    } else {
      clearFieldError("year");
    }
  }

  // Check if full date is valid only when all 3 fields are filled
// Check if full date is valid ONLY IF day and month are in acceptable range
if (
  !isNaN(day) && day >= 1 && day <= 31 &&
  !isNaN(month) && month >= 1 && month <= 12 &&
  !isNaN(year)
) {
  if (!isValidDate(day, month, year)) {
    showError("day", "Must be a valid date");
  } else {
    clearFieldError("day");
  }
}

}


function clearFieldError(id) {
  const input = document.getElementById(id);
  const group = input.parentElement;

  const error = group.querySelector(".error-message");
  if (error) error.remove();

  input.style.borderColor = "";
  group.querySelector("label").style.color = "";
}

["day", "month", "year"].forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => validateField(id));
});
