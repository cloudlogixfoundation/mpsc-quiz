const questions = [
 {
        "question": "Consider the following statements regarding the human digestive system:\n1. The duodenum is the first part of the small intestine and receives bile and pancreatic juice.\n2. The colon plays a crucial role in absorbing nutrients from digested food.\n3. Salivary glands initiate digestion of carbohydrates.\nWhich of the statements are correct?",
        "options": [
            "1 and 2 only",
            "1 and 3 only",
            "2 and 3 only",
            "All of the above"
        ],
        "answer": "1 and 3 only"
    },
    {
        "question": "Match the following components of the digestive system with their respective functions:\nA. Liver - 1. Secretes enzymes to digest proteins\nB. Stomach - 2. Secretes bile\nC. Small Intestine - 3. Major site for nutrient absorption\nD. Pancreas - 4. Secretes insulin and digestive enzymes\nSelect the correct code:",
        "options": [
            "A-2, B-1, C-3, D-4",
            "A-3, B-2, C-1, D-4",
            "A-1, B-4, C-3, D-2",
            "A-2, B-4, C-1, D-3"
        ],
        "answer": "A-2, B-1, C-3, D-4"
    },
    {
        "question": "Which of the following statements are incorrect regarding the alimentary canal?\n1. The ileum is a part of the large intestine.\n2. Rectum stores undigested food temporarily before elimination.\n3. Epiglottis prevents food from entering the windpipe during swallowing.",
        "options": [
            "1 only",
            "1 and 3 only",
            "2 and 3 only",
            "1 and 2 only"
        ],
        "answer": "1 only"
    }
    {
        "question": "With reference to digestion, which of the following enzyme-function pairs is incorrect?",
        "options": [
            "Amylase \u2013 Breaks down starch",
            "Pepsin \u2013 Acts on fats in stomach",
            "Lipase \u2013 Acts on lipids",
            "Trypsin \u2013 Acts on proteins"
        ],
        "answer": "Pepsin \u2013 Acts on fats in stomach"
    },
    {
        "question": "In the human digestive system, which organ is not directly involved in digestion but contributes to the process through secretions?",
        "options": [
            "Liver",
            "Stomach",
            "Pancreas",
            "Pharynx"
        ],
        "answer": "Liver"
    },
    {
        "question": "Identify the correct physiological function of the rectum in the digestive system:",
        "options": [
            "Absorption of water and minerals",
            "Digestion of proteins",
            "Temporary storage of feces",
            "Neutralization of stomach acid"
        ],
        "answer": "Temporary storage of feces"
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
