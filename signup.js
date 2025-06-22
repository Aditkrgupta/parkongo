document.querySelector('.signup').addEventListener('click', async () => {
  const email = document.querySelector('.inptuser').value;
  const password = document.querySelector('.inptpassword').value;
  const valid = document.querySelector('.valid');
  const invalid = document.querySelector('.invalid');
  const code=document.querySelectorAll(".verification-code")
  
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.success) {
          valid.innerHTML = 'Your record is saved verify urself for succesful signup';
          invalid.innerHTML=''
    

         const ressend = await fetch("/api/auth/sendVerification", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });
   const datasend=await ressend.json();
   if(datasend.success)
    {
     code.forEach(el=>el.classList.remove("hidden"))
   
    } else {
      invalid.innerHTML = datasend.message;
      valid.innerHTML = '';
    }
  }
else {
      invalid.innerHTML = data.message;
      valid.innerHTML = '';
    }
}
  catch (err) {
    invalid.innerHTML = 'Failed to connect to server';
    valid.innerHTML = '';
  }
});

document.body.addEventListener('click', async (e) => {
  if (e.target.classList.contains('verify-btn')) {
    const email = document.querySelector('.inptuser').value;
    const otp = document.querySelector('.otp').value;
    const valid = document.querySelector('.valid');
    const invalid = document.querySelector('.invalid');

    try {
      const resverify = await fetch("/api/auth/verification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const dataverify = await resverify.json();

      if (dataverify.success) {
        valid.innerHTML = dataverify.message;
        invalid.innerHTML = '';
      } else {
        invalid.innerHTML = dataverify.message;
        valid.innerHTML = '';
      }
    } catch (err) {
      invalid.innerHTML = 'OTP verification failed due to server error.';
      valid.innerHTML = '';
    }
  }
});