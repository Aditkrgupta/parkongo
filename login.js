
  const loginBtn = document.querySelector('.login');
  const invalid = document.querySelector('.invalid');

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const email = document.querySelector('.inptuser').value;
      const password = document.querySelector('.inptpassword').value;

      try {
        const res = await fetch("http://127.0.0.1:3000/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password }),
          credentials: "include" // ensure cookies are sent
        });

        const data = await res.json();

        if (res.ok && data.success) {
          alert("Login successful");
          // console.log("Token:", data.token);

          // Redirect after login
          window.location.href = "http://127.0.0.1:3000/";
        } else {
          alert("Login failed: " + data.message);
          invalid.innerHTML = "Login failed: " + data.message;
        }

      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred while logging in.");
        invalid.innerHTML = "An error occurred while logging in.";
      }
    });
  } else {
    console.error("Login button not found in DOM.");
  };
