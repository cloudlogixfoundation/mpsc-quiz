let currentQuestions = [];

function loadSubject(subject) {
  fetch(subject + ".json")
    .then(response => response.json())
    .then(data => {
      currentQuestions = data;
      displayQuestions();
      document.getElementById("result").innerHTML = "";
    });
}

function displayQuestions() {
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = "";

  currentQuestions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");
    qDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;

    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.classList.add("option");
      label.innerHTML = `<input type="radio" name="q${index}" value="${opt}"> ${opt}<br>`;
      qDiv.appendChild(label);
    });

    quizContainer.appendChild(qDiv);
  });

  // Add Submit and Retry buttons
  const btnContainer = document.createElement("div");
  btnContainer.innerHTML = `
    <button onclick="submitQuiz()">Submit</button>
    <button onclick="retryQuiz()">Retry</button>
  `;
  quizContainer.appendChild(btnContainer);
}

function submitQuiz() {
  let score = 0;
  let unanswered = 0;

  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const allOptions = document.getElementsByName(`q${i}`);

    if (selected) {
      if (selected.value === q.answer) {
        selected.parentElement.classList.add("correct");
        score++;
      } else {
        selected.parentElement.classList.add("wrong");
        // Highlight correct answer
        allOptions.forEach(opt => {
          if (opt.value === q.answer) {
            opt.parentElement.classList.add("correct");
          }
        });
      }
    } else {
      unanswered++;
      allOptions.forEach(opt => opt.parentElement.classList.add("wrong"));
    }
  });

  const percent = Math.round((score / currentQuestions.length) * 100);
  document.getElementById("result").innerHTML = `
    <h3>You scored ${score} out of ${currentQuestions.length} (${percent}%)</h3>
    ${unanswered > 0 ? `<p>${unanswered} question(s) were unanswered.</p>` : ""}
  `;
}

function retryQuiz() {
  displayQuestions();
  document.getElementById("result").innerHTML = "";
}
