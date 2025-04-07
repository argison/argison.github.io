const quizData = [
    {
        question: "На каком расстоянии Луна находится от Земли?",
        type: "number",
        correct: "384400"
    },
    {
        question: "Как образовалась Луна?",
        type: "radio",
        options: [
            "В результате взрыва звезды",
            "Она всегда была рядом с Землей",
            "В результате столкновения Земли с крупным объектом"
        ],
        correct: "В результате столкновения Земли с крупным объектом"
    },
    {
        question: "Что такое лунные моря? (в ответе нужно написать ДВА слова с МАЛЕНЬКОЙ буквы)",
        type: "text",
        correct: "застывшая лава"
    },
    {
        question: "Когда человек впервые ступил на Луну?",
        type: "date",
        correct: "20.07.1969"
    },
    {
        question: "Какие явления на Земле вызывает Луна?",
        type: "checkbox",
        options: ["Приливы", "Ураганы", "Землетрясения", "Отливы"],
        correct: ["Приливы", "Отливы"]
    },
    {
        question: "Соотнесите понятия с их описаниями",
        type: "match",
        matches: [
            {
                item: "Лунные моря",
                options: [
                    "Результат ударов метеоритов",
                    "Застывшие равнины лавы",
                    "Горы на поверхности Луны"
                ],
                correct: "Застывшие равнины лавы"
            },
	    {
                item: "Лунные кратеры",
                options: [
                    "Результат ударов метеоритов",
                    "Застывшие равнины лавы",
                    "Горы на поверхности Луны"
                ],
                correct: "Результат ударов метеоритов"
            },
            {
                item: "Лунные горы",
                options: [
                    "Результат ударов метеоритов",
                    "Застывшие равнины лавы",
                    "Горы на поверхности Луны"
                ],
                correct: "Горы на поверхности Луны"
            }
        ]
    },
    {
        question: "Какой диаметр у Луны?",
        type: "number",
        correct: "3474"
    },
    {
        question: "Какая миссия первой доставила человека на Луну?",
        type: "radio",
        options: ["Apollo 11", "Apollo 13", "Sputnik 1"],
        correct: "Apollo 11"
    },
    {
        question: "Какую роль Луна играет для Земли?",
        type: "checkbox",
        options: [
            "Стабилизирует ось",
            "Защищает от астероидов",
            "Вызывает приливы",
            "Создает магнитное поле"
        ],
        correct: ["Стабилизирует ось", "Вызывает приливы"]
    },
    {
        question: "Какой возраст Луны?",
        type: "radio",
        options: ["2 миллиарда лет", "4,5 миллиарда лет", "1 миллиард лет"],
        correct: "4,5 миллиарда лет"
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
        // Убираем отображение правильного/неправильного ответа
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

    updateFeedback();

    checkButton.style.display = 'none';
    if (currentQuestion < quizData.length - 1) {
        nextButton.style.display = 'inline';
    } else {
        setTimeout(showResults, 1000);
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
