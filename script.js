/* script.js — improved & robust version (paste over your current file) */

AOS.init();
feather.replace();

// Screens
const loginScreen = document.getElementById("login-screen");
const categoryScreen = document.getElementById("category-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Elements (IDs matched to your HTML)
const loginForm = document.getElementById("signin-form"); // was login-form
const signupForm = document.getElementById("signup-form");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");

const usernameInput = document.getElementById("email"); // sign-in email
const newNameInput = document.getElementById("new-name"); // sign-up name
const newEmailInput = document.getElementById("new-email");

const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");

const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const scoreText = document.getElementById("score-text");
const restartButton = document.getElementById("restart-button");
const categoryButtons = document.querySelectorAll(".category-btn");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15; // seconds per question
let selectedCategory = "";
let questions = [];
let username = "";
let selectedAnswers = []; // tracks user's answer index per question (null = unanswered)

// Question bank (unchanged)
const questionBank = {
  html: [
    {
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "Hyper Transfer Markup Language",
        "HighText Machine Language",
        "Hyper Tool Multi Language"
      ],
      answer: 0
    },
    {
      question: "Choose the correct HTML element for the largest heading:",
      options: ["<heading>", "<h6>", "<h1>", "<head>"],
      answer: 2
    },
    {
      question: "What is the correct HTML element for inserting a line break?",
      options: ["<lb>", "<br>", "<break>", "<line>"],
      answer: 1
    },
    {
      question: "Which tag is used to define a hyperlink?",
      options: ["<a>", "<link>", "<href>", "<hyper>"],
      answer: 0
    },
    {
      question: "Which HTML element is used to define important text?",
      options: ["<strong>", "<important>", "<b>", "<i>"],
      answer: 0
    },
    {
      question: "How can you make a numbered list?",
      options: ["<dl>", "<ul>", "<ol>", "<list>"],
      answer: 2
    },
    {
      question: "Which attribute is used to provide an image source?",
      options: ["href", "src", "link", "alt"],
      answer: 1
    },
    {
      question: "Which HTML element is used to define a table row?",
      options: ["<td>", "<row>", "<tr>", "<th>"],
      answer: 2
    },
    {
      question: "What is the correct HTML for adding a background color?",
      options: [
        "<body color='yellow'>",
        "<background>yellow</background>",
        "<body style='background-color:yellow;'>",
        "<bg>yellow</bg>"
      ],
      answer: 2
    },
    {
      question: "Which tag is used for inserting a horizontal rule?",
      options: ["<line>", "<hr>", "<br>", "<rule>"],
      answer: 1
    }
  ],
  css: [
    {
      question: "What does CSS stand for?",
      options: [
        "Cascading Style Sheets",
        "Creative Style System",
        "Colorful Style Syntax",
        "Computer Style Sheet"
      ],
      answer: 0
    },
    {
      question: "Which property is used to change text color?",
      options: ["font-style", "text-color", "color", "font-color"],
      answer: 2
    },
    {
      question: "Which CSS property controls the text size?",
      options: ["font-size", "text-style", "text-size", "font-weight"],
      answer: 0
    },
    {
      question: "How do you select an element with id 'header'?",
      options: [".header", "header", "#header", "*header"],
      answer: 2
    },
    {
      question: "How do you select all <p> elements inside a <div>?",
      options: ["div p", "div+p", "div.p", "div>p"],
      answer: 0
    },
    {
      question: "Which property is used to change the background color?",
      options: ["color", "bgcolor", "background-color", "background-style"],
      answer: 2
    },
    {
      question: "What is the correct CSS syntax to make all text bold?",
      options: ["font: bold;", "style: bold;", "font-weight: bold;", "text-style: bold;"],
      answer: 2
    },
    {
      question: "Which property controls spacing between letters?",
      options: ["word-spacing", "text-spacing", "letter-spacing", "line-height"],
      answer: 2
    },
    {
      question: "Which CSS property is used for shadows on text?",
      options: ["font-shadow", "text-decoration", "text-shadow", "shadow"],
      answer: 2
    },
    {
      question: "How do you make a list without bullet points?",
      options: [
        "list: none;",
        "list-style-type: none;",
        "bullet: none;",
        "text-decoration: none;"
      ],
      answer: 1
    }
  ],
  js: [
    {
      question: "Inside which HTML element do we put JavaScript?",
      options: ["<javascript>", "<js>", "<script>", "<code>"],
      answer: 2
    },
    {
      question: "How do you write 'Hello World' in an alert box?",
      options: [
        "alertBox('Hello World');",
        "alert('Hello World');",
        "msg('Hello World');",
        "console.log('Hello World');"
      ],
      answer: 1
    },
    {
      question: "Which operator is used to assign a value?",
      options: ["*", "-", "=", "=="],
      answer: 2
    },
    {
      question: "How do you create a function in JavaScript?",
      options: [
        "function:myFunction()",
        "function myFunction()",
        "def myFunction()",
        "create myFunction()"
      ],
      answer: 1
    },
    {
      question: "Which symbol is used for comments in JavaScript?",
      options: ["<!-- comment -->", "// comment", "# comment", "** comment **"],
      answer: 1
    },
    {
      question: "How do you write an IF statement in JavaScript?",
      options: [
        "if i = 5 then",
        "if i == 5 then",
        "if (i == 5) {}",
        "if i = 5 {}"
      ],
      answer: 2
    },
    {
      question: "How does a WHILE loop start?",
      options: [
        "while i = 1 to 10",
        "while (i <= 10)",
        "loop while i <= 10",
        "while i <= 10 {}"
      ],
      answer: 1
    },
    {
      question: "How do you round the number 7.25 to the nearest integer?",
      options: ["Math.round(7.25)", "round(7.25)", "rnd(7.25)", "Math.rnd(7.25)"],
      answer: 0
    },
    {
      question: "How do you find the length of a string?",
      options: ["length()", "strlen", ".length", "size()"],
      answer: 2
    },
    {
      question: "Which event occurs when the user clicks an HTML element?",
      options: ["onmouseover", "onchange", "onclick", "onmouseclick"],
      answer: 2
    }
  ]
};

// Utility to switch screens (rename parameter to avoid shadowing)
function showScreen(hideScreens, screenToShow) {
  hideScreens.forEach((s) => s.classList.add("hidden"));
  if (screenToShow) screenToShow.classList.remove("hidden");
}

/* -------------------------
   UI wiring & event hooks
   ------------------------- */

// Tabs: toggle sign in / sign up forms
if (tabLogin && tabSignup && loginForm && signupForm) {
  tabLogin.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    tabLogin.classList.add("text-indigo-600", "border-indigo-500");
    tabSignup.classList.remove("text-indigo-600", "border-indigo-500");
  });
  tabSignup.addEventListener("click", () => {
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    tabSignup.classList.add("text-indigo-600", "border-indigo-500");
    tabLogin.classList.remove("text-indigo-600", "border-indigo-500");
  });
}

// Password toggle
if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });
}

// Handle sign-in
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    username = usernameInput ? usernameInput.value.trim() : "";
    if (!username) return;
    showScreen([loginScreen], categoryScreen);
  });
}

// Handle sign-up
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = newNameInput ? newNameInput.value.trim() : "";
    if (!name) return;
    username = name;
    // move to category screen
    showScreen([loginScreen], categoryScreen);
  });
}

// Handle category selection
if (categoryButtons && categoryButtons.length) {
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedCategory = btn.dataset.category;
      questions = questionBank[selectedCategory] || [];
      // initialize per-quiz answers tracker
      selectedAnswers = new Array(questions.length).fill(null);
      currentQuestionIndex = 0;
      score = 0;

      showScreen([categoryScreen], quizScreen);
      loadQuestion();
    });
  });
}

/* -------------------------
   Timer logic
   ------------------------- */
function startTimer() {
  if (!timerEl) return;
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = `Time left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time left: ${timeLeft}s`;

    if (timeLeft <= 5) {
      timerEl.classList.add("low-time");
    } else {
      timerEl.classList.remove("low-time");
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      goToNextQuestion();
    }
  }, 1000);
}

/* -------------------------
   Load / render question
   ------------------------- */
function loadQuestion() {
  if (!questions || questions.length === 0) {
    questionContainer.textContent = "No questions available — please pick another category.";
    optionsContainer.innerHTML = "";
    progressBar.style.width = `0%`;
    progressText.textContent = `Question 0 of 0`;
    return;
  }

  const question = questions[currentQuestionIndex];
  questionContainer.textContent = question.question;
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button"; // explicit
    button.textContent = option;
    button.className =
      "bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition w-full text-left";
    // If this question was already answered, show the selection and disable buttons
    if (selectedAnswers[currentQuestionIndex] !== null) {
      if (selectedAnswers[currentQuestionIndex] === index) {
        button.classList.add("bg-indigo-200");
      }
      button.disabled = true;
    }
    button.addEventListener("click", (e) => selectOption(index, e));
    optionsContainer.appendChild(button);
  });

  // Progress update
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.textContent = currentQuestionIndex === questions.length - 1 ? "Finish" : "Next";

  startTimer();
}

/* -------------------------
   Handle option selection
   - prevents double-scoring
   - shows immediate correct / incorrect feedback
   - disables options and advances after a short delay
   ------------------------- */
function selectOption(selectedIndex, event) {
  const question = questions[currentQuestionIndex];
  // protect against edges
  if (!question || selectedAnswers[currentQuestionIndex] !== null) return;

  // mark answer
  selectedAnswers[currentQuestionIndex] = selectedIndex;

  // update score (only first time)
  if (selectedIndex === question.answer) {
    score++;
  }

  // visual feedback: disable all buttons & color correct / wrong
  const buttons = optionsContainer.querySelectorAll("button");
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === question.answer) {
      b.classList.add("bg-green-200", "border", "border-green-400");
    }
    if (i === selectedIndex && selectedIndex !== question.answer) {
      b.classList.add("bg-red-200", "border", "border-red-400");
    }
  });

  clearInterval(timer);
  // small delay so user sees feedback
  setTimeout(goToNextQuestion, 900);
}

/* -------------------------
   Navigation
   ------------------------- */
function goToNextQuestion() {
  clearInterval(timer);
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    showResults();
  }
}

nextButton.addEventListener("click", goToNextQuestion);

prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});

/* -------------------------
   Results + restart
   ------------------------- */
function showResults() {
  clearInterval(timer);
  showScreen([quizScreen], resultScreen);
  const displayName = username || (usernameInput ? usernameInput.value : "Player");
  scoreText.textContent = `${displayName}, you scored ${score} out of ${questions.length}!`;

  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  }
}

restartButton.addEventListener("click", () => {
  clearInterval(timer);
  // show the login (auth) card and reset state
  showScreen([resultScreen], loginScreen);

  currentQuestionIndex = 0;
  score = 0;
  selectedCategory = "";
  questions = [];
  username = "";
  selectedAnswers = [];

  // clear form fields if present
  if (usernameInput) usernameInput.value = "";
  if (passwordInput) passwordInput.value = "";
  if (newNameInput) newNameInput.value = "";
  if (newEmailInput) newEmailInput.value = "";

  // ensure sign-in tab visible
  if (loginForm && signupForm) {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  }
});
