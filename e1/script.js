const quizData = [
    {
        question: "Сколько планет в Солнечной системе?",
        type: "number",
        correct: "8"
    },
    {
        question: "Какая планета находится ближе всего к Солнцу?",
        type: "radio",
        options: ["Меркурий", "Земля", "Венера"],
        correct: "Меркурий" // Правильный ответ в начале
    },
    {
        question: "Где расположен пояс астероидов?",
        type: "radio",
        options: [
            "Между Землей и Марсом",
            "За орбитой Нептуна",
            "Между Марсом и Юпитером"
        ],
        correct: "Между Марсом и Юпитером" // Правильный ответ в конце
    },
    {
        question: "Что такое метеоритный дождь? (в ответе нужно написать ДВА слова с МАЛЕНЬКОЙ буквы)",
        type: "text",
        correct: "светящиеся следы"
    },
    {
        question: "Какие объекты можно найти в поясе астероидов? (Выберите все верные варианты)",
        type: "checkbox",
        options: ["Астероиды", "Кометы", "Планеты"],
        correct: ["Астероиды", "Кометы"]
    },
    {
        question: "Соотнесите понятия с их описаниями",
        type: "match",
        matches: [
            {
                item: "Солнце",
                options: [
                    "Пояс между Марсом и Юпитером",
                    "Звезда в центре Солнечной системы",
                    "Самая большая планета"
                ],
                correct: "Звезда в центре Солнечной системы"
            },
            {
                item: "Юпитер",
                options: [
                    "Самая большая планета",
                    "Пояс между Марсом и Юпитером",
                    "Звезда в центре Солнечной системы"
                ],
                correct: "Самая большая планета"
            },
            {
                item: "Пояс астероидов",
                options: [
                    "Звезда в центре Солнечной системы",
                    "Пояс между Марсом и Юпитером",
                    "Самая большая планета"
                ],
                correct: "Пояс между Марсом и Юпитером"
            }
        ]
    },
    {
        question: "Как часто происходят метеоритные дожди на Земле?",
        type: "radio",
        options: ["Каждый месяц", "Несколько раз в год", "Раз в год"],
        correct: "Несколько раз в год" // Правильный ответ в середине
    }
];

const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const introContainer = document.getElementById('intro');
const navigationContainer = document.querySelector('.navigation');
const prevButton = document.getElementById('prev');
const checkButton = document.getElementById('check');
const nextButton = document.getElementById('next');
const startButton = document.getElementById('start-quiz');
let currentQuestion = 0;
let answers = {};

// Создание викторины
function buildQuiz() {
    const output = [];
    quizData.forEach((item, index) => {
        let content = '';
        if (item.type === "radio") {
            content = item.options.map(option => `
                <label class="match-option">
                    <input type="radio" name="question${index}" value="${option}">
                    ${option}
                </label>
            `).join('');
        } else if (item.type === "text") {
            content = `
                <input type="text" id="text-answer${index}" placeholder="Введите ответ">
            `;
        } else if (item.type === "checkbox") {
            content = item.options.map(option => `
                <label>
                    <input type="checkbox" name="question${index}" value="${option}">
                    ${option}
                </label><br>
            `).join('');
        } else if (item.type === "number") {
            content = `
                <input type="number" id="number-answer${index}" placeholder="Введите число">
            `;
        } else if (item.type === "date") {
            content = `
                <input type="text" id="date-answer${index}" placeholder="Введите дату (например, 04.10.1957)">
            `;
        } else if (item.type === "match") {
            content = item.matches.map((match, subIndex) => `
                <div class="match-subquestion">
                    <p>${match.item}</p>
                    <select name="match${index}-${subIndex}">
                        <option value="">Выберите описание...</option>
                        ${match.options.map(option => `
                            <option value="${option}">${option}</option>
                        `).join('')}
                    </select>
                </div>
            `).join('');
        }
        output.push(`
            <div class="question ${index === 0 ? 'active' : ''}" data-number="${index}">
                <p>${index + 1}. ${item.question}</p>
                <div class="options">${content}</div>
                <div class="feedback" id="feedback${index}"></div>
            </div>
        `);
    });
    quizContainer.innerHTML = output.join('');
}

// Показать вопрос
function showQuestion(index) {
    const questions = document.querySelectorAll('.question');
    questions[currentQuestion].classList.remove('active');
    questions[index].classList.add('active');
    currentQuestion = index;

    prevButton.style.display = currentQuestion === 0 ? 'none' : 'inline';
    checkButton.style.display = answers[currentQuestion] ? 'none' : 'inline';
    nextButton.style.display = answers[currentQuestion] && currentQuestion < quizData.length - 1 ? 'inline' : 'none';

    updateFeedback();
}

// Обновить обратную связь
function updateFeedback() {
    const currentQ = document.querySelector(`.question[data-number="${currentQuestion}"]`);
    const feedback = currentQ.querySelector('.feedback');
    if (answers[currentQuestion]) {
        feedback.className = 'feedback';
        feedback.innerHTML = ''; // Ничего не показываем
    } else {
        feedback.className = 'feedback';
        feedback.innerHTML = '';
    }
}

// Проверка ответа
function checkAnswer() {
    const currentQ = document.querySelector(`.question[data-number="${currentQuestion}"]`);
    let selected;

    if (quizData[currentQuestion].type === "radio") {
        selected = currentQ.querySelector(`input[name="question${currentQuestion}"]:checked`);
        if (!selected) {
            alert('Пожалуйста, выберите ответ!');
            return;
        }
        answers[currentQuestion] = selected.value;
    } else if (quizData[currentQuestion].type === "text") {
        selected = currentQ.querySelector(`#text-answer${currentQuestion}`).value.trim();
        if (!selected) {
            alert('Пожалуйста, введите ответ!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "checkbox") {
        selected = Array.from(currentQ.querySelectorAll(`input[name="question${currentQuestion}"]:checked`))
            .map(input => input.value);
        if (selected.length === 0) {
            alert('Пожалуйста, выберите хотя бы один вариант!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "number") {
        selected = currentQ.querySelector(`#number-answer${currentQuestion}`).value.trim();
        if (!selected) {
            alert('Пожалуйста, введите число!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "date") {
        selected = currentQ.querySelector(`#date-answer${currentQuestion}`).value.trim();
        if (!selected) {
            alert('Пожалуйста, введите дату!');
            return;
        }
        answers[currentQuestion] = selected;
    } else if (quizData[currentQuestion].type === "match") {
        selected = [];
        for (let subIndex = 0; subIndex < quizData[currentQuestion].matches.length; subIndex++) {
            const match = quizData[currentQuestion].matches[subIndex];
            const selectedOption = currentQ.querySelector(`select[name="match${currentQuestion}-${subIndex}"]`).value;
            if (!selectedOption) {
                alert(`Пожалуйста, выберите описание для "${match.item}"!`);
                return;
            }
            selected.push(selectedOption);
        }
        answers[currentQuestion] = selected;
    }

    // Убираем вызов updateFeedback, так как обратная связь не отображается
    checkButton.style.display = 'none';

    // Автоматический переход на следующий вопрос
    if (currentQuestion < quizData.length - 1) {
        showQuestion(currentQuestion + 1);
    } else {
        showResults();
    }
}

// Генерация кода с учетом баллов (одна цифра)
function generateCode(score) {
    const baseCode = Math.floor(100000 + Math.random() * 900000); // 6-значный код
    return `${baseCode}${score}`; // Код + одна цифра баллов
}

// Показать результаты
function showResults() {
    let score = 0;
    quizData.forEach((question, index) => {
        if (question.type === "radio" || question.type === "text" || question.type === "number") {
            if (answers[index] === question.correct) score++;
        } else if (question.type === "date") {
            const normalizedAnswer = answers[index]?.replace(/\s/g, '').toLowerCase();
            const normalizedCorrect = question.correct.replace(/\s/g, '').toLowerCase();
            if (normalizedAnswer === normalizedCorrect) score++;
        } else if (question.type === "checkbox") {
            if (JSON.stringify(answers[index]?.sort()) === JSON.stringify(question.correct.sort())) score++;
        } else if (question.type === "match") {
            const correctAnswers = question.matches.map(m => m.correct);
            if (JSON.stringify(answers[index]) === JSON.stringify(correctAnswers)) score++;
        }
    });

    const uniqueCode = generateCode(score);

    quizContainer.style.display = 'none';
    navigationContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    resultContainer.innerHTML = `
        Викторина завершена! Вы набрали ${score} из ${quizData.length} баллов! Пожалуйста введите код в форму.
        <br><br>
        Ваш уникальный код: <strong id="unique-code">${uniqueCode}</strong>
        <button id="copy-code">Скопировать код</button>
        <br><br>
        <div id="yandex-form-container">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc46otjgrk50k1CsN0_IX1nXHKPcuPpA7w6T_4BSjxjzTJJ5g/viewform?embedded=true" width="640" height="720" frameborder="0" marginheight="0" marginwidth="0">Загрузка…</iframe>
        </div>
    `;

    // Добавляем обработчик для кнопки копирования
    document.getElementById('copy-code').addEventListener('click', () => {
        const code = document.getElementById('unique-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            alert('Код скопирован в буфер обмена!');
        }).catch(err => {
            alert('Ошибка при копировании: ' + err);
        });
    });

    const script = document.createElement('script');
    script.src = 'https://forms.yandex.ru/_static/embed.js';
    document.body.appendChild(script);
}

// Инициализация
buildQuiz();

// События
startButton.addEventListener('click', () => {
    introContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    navigationContainer.style.display = 'block';
    showQuestion(0);
});

prevButton.addEventListener('click', () => showQuestion(currentQuestion - 1));
checkButton.addEventListener('click', () => {
    checkAnswer();
});
nextButton.addEventListener('click', () => showQuestion(currentQuestion + 1));
