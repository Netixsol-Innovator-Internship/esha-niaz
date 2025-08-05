let button = document.getElementById('read');

button.addEventListener('click', () => {
    document.querySelectorAll('.single-box').forEach(e => {
        e.classList.remove('unseen');
        
    });
    
    document.querySelectorAll('.dot').forEach(e => {
        e.classList.remove('dot');
        
    });
    document.getElementById('num').innerText = '0';


button.classList.add('disabled');

})



document.addEventListener("DOMContentLoaded", () => {
  const notifBoxes = document.querySelectorAll(".single-box");
  const notifCount = document.getElementById("num");
  const markAllBtn = document.getElementById("read");

  // Function to update the counter
  function updateCount() {
    const unseenCount = document.querySelectorAll(".single-box.unseen").length;
    notifCount.textContent = unseenCount;
  }

  // Make each notification clickable
    notifBoxes.forEach(box => {
        box.addEventListener("click", () => {
            if (box.classList.contains("unseen")) {
                box.classList.remove("unseen");
                const dot = box.querySelector(".dot");
                if (dot) dot.style.display = "none";
                updateCount();
            }
        });
    });
    
   const boxes = document.querySelectorAll(".single-box");

  boxes.forEach((box, index) => {
    box.style.animationDelay = `${index * 0.1}s`;
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const notifCount = document.getElementById("num");

  function updateCount() {
    const unseenCount = document.querySelectorAll(".single-box.unseen").length;
    notifCount.textContent = unseenCount;
  }

  // Add delete buttons dynamically to each notification
  document.querySelectorAll(".single-box").forEach(box => {
    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.title = "Delete this notification";
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';

    // Append the delete button at the end of the box
    box.appendChild(delBtn);

    // Add delete functionality
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering the box click event
      if (box.classList.contains("unseen")) {
        // Decrement count if it was unseen
        const current = parseInt(notifCount.textContent);
        notifCount.textContent = current - 1;
      }
      box.remove();
    });
  });


    const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("toggleBtn").checked = true;
  } else if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    document.getElementById("toggleBtn").checked = false;
  } else {
    // No theme saved — follow system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add("dark-mode");
      document.getElementById("toggleBtn").checked = true;
    }
  }
});



// dark mode toggle
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("change", function () {
  if (toggleBtn.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});









