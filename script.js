(() => {
  let currentQuestions = [];

  function loadSubject(subject) {
    // Validate subject to prevent unwanted file paths
    if (!/^[\w\-]+$/.test(subject)) {
      document.getElementById("result").innerHTML = `<p>Invalid subject name.</p>`;
      return;
    }

    // Update the path if JSON files are stored in a subdirectory
    const filePath = `.\\data\\${subject}.json`; // Assuming JSON files are in the root directory

    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}. Please check the file path.`);
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid quiz data format.");
        }
        currentQuestions = data;
        displayQuestions();
        document.getElementById("result").innerHTML = "";
      })
      .catch(error => {
        console.error(error);
        document.getElementById("result").innerHTML = `<p>Error loading quiz. Please try again later.</p>`;
      });
  }

  function createButton(text, onClickHandler, id = "") {
    const button = document.createElement("button");
    button.textContent = text;
    button.onclick = onClickHandler;
    button.setAttribute("aria-label", text);
    if (id) button.id = id;
    return button;
  }

  function displayQuestions() {
    const quizContainer = document.getElementById("quiz");
    quizContainer.innerHTML = "";
    quizContainer.setAttribute("role", "form");

    const fragment = document.createDocumentFragment();

    currentQuestions.forEach((q, index) => {
      const qDiv = document.createElement("div");
      qDiv.classList.add("question");
      qDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;

      q.options.forEach(opt => {
        const label = document.createElement("label");
        label.classList.add("option");
        label.innerHTML = `<input type="radio" name="q${index}" value="${opt}" aria-label="${opt}"> ${opt}<br>`;
        qDiv.appendChild(label);
      });

      fragment.appendChild(qDiv);
    });

    const btnContainer = document.createElement("div");
    btnContainer.appendChild(createButton("Submit", submitQuiz, "submit-btn"));
    btnContainer.appendChild(createButton("Retry", retryQuiz, "retry-btn"));
    fragment.appendChild(btnContainer);

    quizContainer.appendChild(fragment);
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
          allOptions.forEach(opt => {
            if (opt.value === q.answer) {
              opt.parentElement.classList.add("correct");
            }
          });
        }
      } else {
        unanswered++;
        allOptions.forEach(opt => opt.parentElement.classList.add("unanswered"));
      }
    });

    const percent = Math.round((score / currentQuestions.length) * 100);
    document.getElementById("result").innerHTML = `
      <h3>You scored ${score} out of ${currentQuestions.length} (${percent}%)</h3>
      ${unanswered > 0 ? `<p>${unanswered} question(s) were unanswered.</p>` : ""}
    `;

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.disabled = true;
  }

  function retryQuiz() {
    displayQuestions();
    document.getElementById("result").innerHTML = "";
  }

  window.loadSubject = loadSubject;
})();
