
let currentQuestions = [];
let startTime;

const params = new URLSearchParams(window.location.search);
const subject = params.get("subject");
const test = params.get("test");

if (!subject || !test) {
  document.getElementById("quiz").innerHTML = "<p>No subject or test specified.</p>";
} else {
  const filePath = `data/${subject}/${test}.json`;
  fetch(filePath)
    .then(res => res.json())
    .then(data => {
      currentQuestions = data;
      displayQuestions();
      document.getElementById("result").innerHTML = "";
    });
}

function displayQuestions() {
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = "";
  startTime = new Date();

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

  document.getElementById("submit-btn").style.display = "inline-block";
  document.getElementById("retry-btn").style.display = "none";
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

  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  document.getElementById("result").innerHTML = `
    <h3>You scored ${score} out of ${currentQuestions.length}</h3>
    <p>🕒 Time Taken: ${minutes} minute${minutes !== 1 ? "s" : ""} ${seconds} second${seconds !== 1 ? "s" : ""}</p>
  `;

  document.getElementById("submit-btn").style.display = "none";
  document.getElementById("retry-btn").style.display = "inline-block";
}

function retryQuiz() {
  window.location.reload();
}
