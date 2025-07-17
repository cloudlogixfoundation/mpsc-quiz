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
}

function submitQuiz() {
  let score = 0;
  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected && selected.value === q.answer) {
      selected.parentElement.classList.add("correct");
      score++;
    } else {
      if (selected) selected.parentElement.classList.add("wrong");
      const allOptions = document.getElementsByName(`q${i}`);
      allOptions.forEach(opt => {
        if (opt.value === q.answer) {
          opt.parentElement.classList.add("correct");
        }
      });
    }
  });

  document.getElementById("result").innerHTML = `<h3>You scored ${score} out of ${currentQuestions.length}</h3>`;
}
