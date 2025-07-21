let currentQuestions = [];
let startTime;

const params = new URLSearchParams(window.location.search);
const subject = params.get("subject");
const test = params.get("test");

const quizContainer = document.getElementById("quiz");
const submitBtn = document.getElementById("submit-btn");
const retryBtn = document.getElementById("retry-btn");
const resultBox = document.getElementById("result");
const progressBar = document.getElementById("progress-bar");

if (!subject || !test) {
  quizContainer.innerHTML = `
    <div class="alert alert-warning">
      <h4>⚠️ No Quiz Selected</h4>
      <p>Please select a subject and test from the homepage.</p>
      <a href="index.html" class="btn btn-primary">Go to Home</a>
    </div>`;
  submitBtn.classList.add("d-none");
  retryBtn.classList.add("d-none");
} else {
  const filePath = `data/${subject}/${test}.json`;
  fetch(filePath)
    .then(res => {
      if (!res.ok) throw new Error("Test file not found.");
      return res.json();
    })
    .then(data => {
      currentQuestions = data;
      displayQuestions();
      submitBtn.addEventListener("click", submitQuiz);
      retryBtn.addEventListener("click", retryQuiz);
    })
    .catch(err => {
      quizContainer.innerHTML = `
        <div class="alert alert-danger">
          <h4>🚫 Error</h4>
          <p>${err.message}</p>
          <a href="tests.html?subject=${subject}" class="btn btn-secondary">Back to Tests</a>
        </div>`;
      submitBtn.classList.add("d-none");
      retryBtn.classList.add("d-none");
    });
}

function displayQuestions() {
  quizContainer.innerHTML = "";
  startTime = new Date();

  currentQuestions.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("mb-3");
    qDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;

    q.options.forEach(opt => {
      const label = document.createElement("label");
      label.classList.add("form-check-label", "d-block");
      label.innerHTML = `
        <input class="form-check-input me-2" type="radio" name="q${index}" value="${opt}"> ${opt}
      `;
      qDiv.appendChild(label);
    });

    quizContainer.appendChild(qDiv);
  });

  progressBar.style.width = "0%";
  submitBtn.classList.remove("d-none");
  retryBtn.classList.add("d-none");
  resultBox.innerHTML = "";
}

function submitQuiz() {
  let score = 0;

  currentQuestions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const allOptions = document.getElementsByName(`q${i}`);

    if (selected && selected.value === q.answer) {
      selected.parentElement.classList.add("text-success");
      selected.parentElement.innerHTML += " ✅ Correct!";
      score++;
    } else {
      if (selected) {
        selected.parentElement.classList.add("text-danger");
        selected.parentElement.innerHTML += " ❌ Wrong!";
      }
      allOptions.forEach(opt => {
        if (opt.value === q.answer) {
          opt.parentElement.classList.add("text-success");
          opt.parentElement.innerHTML += " ✅ Correct!";
        }
      });
    }
  });

  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const percent = Math.round((score / currentQuestions.length) * 100);
  progressBar.style.width = percent + "%";

  let badge = "";
  if (percent >= 90) badge = "🥇 Gold";
  else if (percent >= 70) badge = "🥈 Silver";
  else if (percent >= 50) badge = "🥉 Bronze";
  else badge = "📘 Keep Practicing";

  resultBox.innerHTML = `
    <h3>🎉 You scored ${score} / ${currentQuestions.length}</h3>
    <p>⏱ Time: ${minutes} min ${seconds} sec</p>
    <p>🏅 Rank: <strong>${badge}</strong></p>
  `;

  submitBtn.classList.add("d-none");
  retryBtn.classList.remove("d-none");
}

function retryQuiz() {
  location.reload();
}
