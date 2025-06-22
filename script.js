
document.addEventListener("DOMContentLoaded", async () => {
  const register = document.querySelector(".register");
  const search = document.querySelector(".search");
  const desktopLogin = document.querySelector('.log-in');
  const desktopLogout = document.querySelector('.log-out');

  try {
    const res = await fetch("/api/auth/verify-token", {
      credentials: "include",
    });
    const data = await res.json();

    if (res.ok && data.success) {
      desktopLogin.classList.add("hidden");
      desktopLogout.classList.remove("hidden");
      register.innerHTML = '<a href="/register">Register ur space </a>';
      search.innerHTML = '<a href="/search">Search the space </a>';

      desktopLogout.addEventListener("click", async () => {
        await fetch("/api/auth/signout", {
          method: "POST",
          credentials: "include"
        });
        window.location.reload();
      });
    } else {
      throw new Error("Token invalid or expired");
    }
  } catch (err) {
    desktopLogin.classList.remove("hidden");
    desktopLogout.classList.add("hidden");
    register.innerHTML = '<a href="/signup.html">Register ur space </a>';
    search.innerHTML = '<a href="/signup.html">Search the space </a>';
  }
});

const sidebar = document.querySelector(".sidebar");
const side = document.querySelector(".side");
let isOpen = false;

sidebar.addEventListener("click", async () => {
  let isLoggedIn = false;
  try {
    const res = await fetch("/api/auth/verify-token", {
      credentials: "include"
    });
    const data = await res.json();
    isLoggedIn = res.ok && data.success;
  } catch (e) {
    isLoggedIn = false;
  }

  if (!isOpen) {
    side.innerHTML = `
      <button class="home block w-full text-left px-4 py-2 text-gray-700 rounded hover:bg-blue-100 transition">Home</button>
      <button class="contact block w-full text-left px-4 py-2 text-gray-700 rounded hover:bg-blue-100 transition">Contact Us</button>
      <button class="about block w-full text-left px-4 py-2 text-gray-700 rounded hover:bg-blue-100 transition">About</button>
      <button class="register block w-full text-left px-4 py-2 text-gray-700 rounded hover:bg-blue-100 transition">
        <a href="${isLoggedIn ? '/register' : '/signup.html'}">Register ur space </a>
      </button>
      <button class="search block w-full text-left px-4 py-2 text-gray-700 rounded hover:bg-blue-100 transition">
        <a href="${isLoggedIn ? '/search' : '/signup.html'}">Search the space </a>
      </button>
      ${isLoggedIn ? `<a href="#" class="log-out block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Log out</a>` : `<a href="http://127.0.0.1:3000/signup.html" class="log-in block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Sign Up</a>`}
    `;

    side.classList.remove("hidden");
    side.classList.add("flex", "flex-col");

    if (isLoggedIn) {
      const logoutBtn = side.querySelector('.log-out');
      logoutBtn.addEventListener("click", async () => {
        await fetch("/api/auth/signout", {
          method: "POST",
          credentials: "include"
        });
        window.location.reload();
      });
    }
  } else {
    side.innerHTML = ``;
    side.classList.remove("flex", "flex-col");
    side.classList.add("hidden");
  }

  isOpen = !isOpen;
});


const scrollToSection = (id) => {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
};

document.querySelector(".about").addEventListener("click", () => scrollToSection("about"));
document.querySelector(".contact").addEventListener("click", () => scrollToSection("contact"));
document.querySelector(".home").addEventListener("click", () =>window.location.href = "/");