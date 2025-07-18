let currentQuestions = [];

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");

  if (subject) {
    const filePath = `data/${subject}.json`; // ✅ must use forward slashes
    fetch(filePath)
      .then((response) => response.json())
      .then((data) => {
        currentQuestions = data;
        displayQuestions();
        document.getElementById("result").innerHTML = "";
      })
      .catch((error) => {
        console.error("Error loading quiz data:", error);
        document.getElementById("quiz").innerHTML = "<p>Failed to load questions.</p>";
      });
  } else {
    document.getElementById("quiz").innerHTML = "<p>No subject specified.</p>";
  }
};

function displayQuestions() {
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = "";

  currentQuestions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");
    qDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;

    q.options.forEach((opt) => {
      const label = document.createElement("label");
      label.classList.add("option");
      label.innerHTML = `<input type="radio" name="q${index}" value="${opt}"> ${opt}`;
      qDiv.appendChild(label);
    });

    quizContainer.appendChild(qDiv);
  });

  // ✅ Add Submit and Retry buttons
  const btnContainer = document.createElement("div");
  btnContainer.innerHTML = `
    <button onclick="submitQuiz()">Submit</button>
    <button onclick="retryQuiz()">Retry</button>
  `;
  quizContainer.appendChild(btnContainer);
}

function submitQuiz() {
  let score = 0;
  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const allOptions = document.getElementsByName(`q${i}`);

    if (selected) {
      if (selected.value === q.answer) {
        selected.parentElement.classList.add("correct");
        score++;
      } else {
        selected.parentElement.classList.add("wrong");
        allOptions.forEach((opt) => {
          if (opt.value === q.answer) {
            opt.parentElement.classList.add("correct");
          }
        });
      }
    } else {
      allOptions.forEach((opt) => {
        if (opt.value === q.answer) {
          opt.parentElement.classList.add("correct");
        }
      });
    }
  });

  const result = document.getElementById("result");
  const percent = Math.round((score / currentQuestions.length) * 100);
  result.innerHTML = `<h3>You scored ${score} out of ${currentQuestions.length} (${percent}%)</h3>`;
}

function retryQuiz() {
  displayQuestions();
  document.getElementById("result").innerHTML = "";
}
