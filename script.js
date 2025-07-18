let currentQuestions = [];

window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const subject = urlParams.get("subject");

 if (!subject) {
  document.getElementById("quiz").innerHTML = `
    <div class="no-subject">
      <h2>📚 No Subject Chosen Yet</h2>
      <p>Please go back to the <a href="index.html">Home Page</a> and select a subject to begin your quiz.</p>
    </div>
  `;
  return;
}


  const filePath = `data/${subject}.json`;

  fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error("File not found");
      return response.json();
    })
    .then((data) => {
      currentQuestions = data;
      displayQuestions();
    })
    .catch((error) => {
      document.getElementById("quiz").innerHTML = `<p style="color:red;">⚠️ Error: ${error.message}</p>`;
    });
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

    if (selected && selected.value === q.answer) {
      selected.parentElement.classList.add("correct");
      score++;
    } else {
      if (selected) selected.parentElement.classList.add("wrong");
      allOptions.forEach((opt) => {
        if (opt.value === q.answer) {
          opt.parentElement.classList.add("correct");
        }
      });
    }
  });

  const percent = Math.round((score / currentQuestions.length) * 100);
  document.getElementById("result").innerHTML = `<h3>You scored ${score} out of ${currentQuestions.length} (${percent}%)</h3>`;
}

function retryQuiz() {
  displayQuestions();
  document.getElementById("result").innerHTML = "";
}
