const verify = document.querySelector('.verified-message');
const verifyMg = document.querySelector('.verified');
const resend = document.querySelector('.resend');
const inputs = document.querySelectorAll('input');

// Clears localStorage
localStorage.removeItem('verified');

function generateCode() {
  // hide resend
  resend.style.display = 'none';

  // Generate 6 digit OTP
  const otp = Math.floor(Math.random() * 900000) + 100000;

  const code = document.querySelector('.code');
  // Clears the code
  code.textContent = '';

  setTimeout(() => {
    code.textContent = otp;
    resend.style.display = 'block';
  }, 3000);

  // Hide verification message
  verify.style.display = 'none';
  verifyMg.style.display = 'none';
}

generateCode();

function moveToNextInput(e) {
  let nextInput = e.target.nextElementSibling;
  let inputValue = e.target.value;
  let filled = e.target;

  // Adds Color when user has put an input
  if (filled) {
    filled.classList.add('filled');
  }

  // if inputValue is not a number or is empty do not move to the next
  if (isNaN(inputValue) || inputValue === ' ') {
    e.target.value = '';
  }

  if (!isNaN(inputValue) && inputValue.length === 1) {
    // Stops the function when there is no longer a next input
    if (nextInput === null) {
      return;
    }

    nextInput.focus();
  }
}

function moveToPreviousInput(e) {
  let inputValue = e.key;

  let previousInput = e.target.previousElementSibling;

  // Removes color if not filled
  let filled = e.target;

  if (filled.classList.contains('filled')) {
    filled.classList.remove('filled');
  }

  if (e.keyCode === 32) {
    e.preventDefault();
  }

  if (inputs.length !== 0) {
    if (inputValue === 'Enter') {
      e.preventDefault();
      checkAuthentication();
      welcomePage();
    }
  }

  if (e.key === 'Backspace') {
    e.target.value = '';
    // Stops the function when there is no longer a previous input
    if (previousInput === null) {
      return;
    }

    previousInput.focus();
  }
}

inputs.forEach((input) => {
  input.addEventListener('input', moveToNextInput);

  input.addEventListener('keydown', moveToPreviousInput);
});

function checkAuthentication() {
  verify.style.display = 'none';
  verifyMg.style.display = 'none';
  let code = document.querySelector('.code');

  setTimeout(() => {
    // Gets the user Code input
    // ['2', '3', '2'...]
    //  .join does 232219
    const arr = [...inputs].map((input) => input.value).join('');

    // Checks if the code is correct

    if (arr === code.textContent) {
      verify.classList.add('correct');
      verify.style.display = 'block';
      verifyMg.style.display = 'block';

      verify.textContent =
        'Your verification code has been successfully verified';

      // Clears localStorage
      localStorage.removeItem('verified');

      // Adds to the localStorage
      localStorage.setItem('verified', 'true');

      welcomePage();
    } else {
      verify.style.display = 'block';
      verify.classList.add('failed');
      verify.textContent = 'Authentication Error: Please Check Code!';

      // Adds to localStorage
      localStorage.setItem('verified', 'false');
    }

    if (arr === '') {
      verify.style.display = 'block';

      verify.classList.add('failed');
      verify.textContent = 'Authentication Error: Please try Again!';
    }
  }, 3000);
}

function welcomePage() {
  if (localStorage.verified === 'true') {
    setTimeout(() => {
      window.location.replace('https://leno-website-app.netlify.app/');
      console.log('welcome');
    }, 2000);
  }
}

function init() {
  resend.addEventListener('click', generateCode);
  document.querySelector('.btn').addEventListener('click', checkAuthentication);
}

init();
