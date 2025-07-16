const questions = [
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    answer: "Delhi"
  },
  {
    question: "HTML stands for?",
    options: ["HyperText Machine Language", "HyperText Markup Language", "HyperText Markdown Language", "HighText Markup Language"],
    answer: "HyperText Markup Language"
  },
  {
    question: "Which one is a JavaScript framework?",
    options: ["React", "Laravel", "Django", "Flask"],
    answer: "React"
  }
];

const quizContainer = document.getElementById("quiz");

questions.forEach((q, index) => {
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

function submitQuiz() {
  let score = 0;
  questions.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const resultDiv = document.createElement("div");
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

  document.getElementById("result").innerHTML = `<h3>You scored ${score} out of ${questions.length}</h3>`;
}