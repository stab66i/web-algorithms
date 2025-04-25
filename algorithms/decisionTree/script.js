// Глобальная переменная для хранения дерева
let currentTree = null;

// Счетчик для генерации уникальных ID узлов
let nodeIdCounter = 0;

// Парсинг CSV из текстового поля
function parseCSV() {
    const text = document.getElementById('inputDataset').value;
    if (!text.trim()) return null;

    const rows = text.split('\n').filter(row => row.trim() !== '');
    const data = [];

    rows.forEach((row, index) => {
        const columns = row.split(',').map(item => item.trim());
        if (columns.length > 1 && columns.some(col => col !== '')) {
            data.push(columns);
        } else {
            console.warn(`Пропущена строка ${index + 1}: некорректный формат`);
        }
    });

    if (data.length === 0) return null;
    console.log('Parsed CSV:', data);
    return data;
}

// Класс для вопросов
class Question {
    constructor(column, value) {
        this.column = column;
        this.value = value;
    }

    match(example) {
        const val = example[this.column];
        if (this.isNumeric(val)) {
            return val >= this.value;
        }
        return val === this.value;
    }

    toString() {
        const condition = this.isNumeric(this.value) ? ">=" : "==";
        return `Is ${header[this.column]} ${condition} ${this.value}?`;
    }

    isNumeric(value) {
        return typeof value === 'number' || (!isNaN(value) && value !== '');
    }
}

// Класс для листьев
class Leaf {
    constructor(rows) {
        this.predictions = this.classCounts(rows);
    }

    classCounts(rows) {
        const counts = {};
        for (const row of rows) {
            const label = row[row.length - 1];
            counts[label] = (counts[label] || 0) + 1;
        }
        return counts;
    }
}

// Класс для узлов решения
class DecisionNode {
    constructor(question, trueBranch, falseBranch) {
        this.question = question;
        this.trueBranch = trueBranch;
        this.falseBranch = falseBranch;
    }
}

// Вспомогательные функции для построения дерева
function uniqueVals(rows, col) {
    return new Set(rows.map(row => row[col]));
}

function classCounts(rows) {
    const counts = {};
    for (const row of rows) {
        const label = row[row.length - 1];
        counts[label] = (counts[label] || 0) + 1;
    }
    return counts;
}

function isNumeric(value) {
    return typeof value === 'number' || (!isNaN(value) && value !== '');
}

function partition(rows, question) {
    const trueRows = [];
    const falseRows = [];
    for (const row of rows) {
        if (question.match(row)) {
            trueRows.push(row);
        } else {
            falseRows.push(row);
        }
    }
    return [trueRows, falseRows];
}

function gini(rows) {
    const counts = classCounts(rows);
    let impurity = 1;
    for (const label in counts) {
        const prob = counts[label] / rows.length;
        impurity -= prob ** 2;
    }
    return impurity;
}

function infoGain(left, right, currentUncertainty) {
    const p = left.length / (left.length + right.length);
    return currentUncertainty - p * gini(left) - (1 - p) * gini(right);
}

function findBestSplit(rows) {
    let bestGain = 0;
    let bestQuestion = null;
    const currentUncertainty = gini(rows);
    const nFeatures = rows[0].length - 1;

    for (let col = 0; col < nFeatures; col++) {
        const values = uniqueVals(rows, col);
        for (const val of values) {
            const question = new Question(col, val);
            const [trueRows, falseRows] = partition(rows, question);

            if (trueRows.length === 0 || falseRows.length === 0) {
                continue;
            }

            const gain = infoGain(trueRows, falseRows, currentUncertainty);
            if (gain >= bestGain) {
                bestGain = gain;
                bestQuestion = question;
            }
        }
    }

    return [bestGain, bestQuestion];
}

function buildTree(rows) {
    const [gain, question] = findBestSplit(rows);

    if (gain === 0) {
        return new Leaf(rows);
    }

    const [trueRows, falseRows] = partition(rows, question);
    const trueBranch = buildTree(trueRows);
    const falseBranch = buildTree(falseRows);

    return new DecisionNode(question, trueBranch, falseBranch);
}

// Заголовки для отображения вопросов
const header = [];

// Преобразование CSV в дерево
function parseCSVToTree(inputText) {
    const data = parseCSV();
    if (!data || data.length === 0) {
        throw new Error("Нет валидных данных для построения дерева");
    }

    // Предполагаем, что первая строка — заголовки
    if (data[0].length > 1) {
        header.length = 0;
        header.push(...data[0].slice(0, -1));
        data.shift();
    }

    // Преобразуем числовые значения в числа
    const processedData = data.map(row => {
        return row.map((val, idx) => {
            if (idx < row.length - 1 && isNumeric(val)) {
                return parseFloat(val);
            }
            return val;
        });
    });

    return buildTree(processedData);
}

// Рендеринг дерева в HTML с уникальными ID
function renderTree(node, container) {
    const nodeId = `node-${nodeIdCounter++}`; // Уникальный ID для узла

    if (node instanceof Leaf) {
        const predictions = Object.entries(node.predictions)
            .map(([label, count]) => `${label}: ${count}`)
            .join(", ");
        const leafDiv = document.createElement("div");
        leafDiv.className = "leaf";
        leafDiv.id = nodeId;
        leafDiv.textContent = `Predict: ${predictions}`;
        const li = document.createElement("li");
        li.appendChild(leafDiv);
        container.appendChild(li);
        node.htmlElement = leafDiv; // Сохраняем ссылку на HTML-элемент
        return;
    }

    const questionDiv = document.createElement("div");
    questionDiv.id = nodeId;
    questionDiv.textContent = node.question.toString();
    const li = document.createElement("li");
    li.appendChild(questionDiv);

    const ul = document.createElement("ul");

    // True ветка
    const trueLi = document.createElement("li");
    const trueUl = document.createElement("ul");
    renderTree(node.trueBranch, trueUl);
    trueLi.appendChild(trueUl);
    ul.appendChild(trueLi);

    // False ветка
    const falseLi = document.createElement("li");
    const falseUl = document.createElement("ul");
    renderTree(node.falseBranch, falseUl);
    falseLi.appendChild(falseUl);
    ul.appendChild(falseLi);

    li.appendChild(ul);
    container.appendChild(li);
    node.htmlElement = questionDiv; // Сохраняем ссылку на HTML-элемент
}

// Классификация с отображением пути и сбором HTML-элементов
function classifyAndShowPath(example, node) {
    const path = [];
    const animationSteps = [];

    function classify(row, node, depth = 0) {
        // Базовый случай: достигли листа
        if (node instanceof Leaf) {
            const predictions = Object.entries(node.predictions)
                .map(([label, count]) => `${label}: ${count}`)
                .join(", ");
            path.push(`Глубина ${depth}: Predict ${predictions}`);
            animationSteps.push({ element: node.htmlElement, text: `Predict ${predictions}` });
            return node.predictions;
        }

        // Добавляем вопрос и ответ в путь
        const question = node.question;
        const answer = question.match(row) ? "True" : "False";
        path.push(`Глубина ${depth}: ${question.toString()} → ${answer}`);
        animationSteps.push({ element: node.htmlElement, text: `${question.toString()} → ${answer}` });

        // Рекурсивно классифицируем
        if (question.match(row)) {
            return classify(row, node.trueBranch, depth + 1);
        } else {
            return classify(row, node.falseBranch, depth + 1);
        }
    }

    const predictions = classify(example, node);
    return { predictions, path, animationSteps };
}

// Функция для анимации пути
function animateDecisionPath(animationSteps, callback) {
    const delay = 1000; // Задержка между шагами в миллисекундах

    function highlightStep(index) {
        if (index >= animationSteps.length) {
            callback(); // Вызываем callback после завершения анимации
            return;
        }

        const { element } = animationSteps[index];

        // Сбрасываем подсветку предыдущего узла
        if (index > 0) {
            animationSteps[index - 1].element.classList.remove("highlight");
        }

        // Подсвечиваем текущий узел
        element.classList.add("highlight");

        // Прокручиваем к элементу
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        // Переходим к следующему шагу
        setTimeout(() => highlightStep(index + 1), delay);
    }

    // Сбрасываем подсветку всех узлов перед началом
    document.querySelectorAll(".tree li div").forEach(div => div.classList.remove("highlight"));
    highlightStep(0);
}

// Обработчик кнопки Build Tree
document.getElementById('buildTree').addEventListener('click', function() {
    const treeContainer = document.getElementById('treeStart');
    treeContainer.innerHTML = '';
    nodeIdCounter = 0; // Сбрасываем счетчик ID

    const inputText = document.getElementById('inputDataset').value;

    if (!inputText.trim()) {
        document.getElementById('result').textContent = "Ошибка: Введите данные!";
        document.getElementById('decisionPath').innerHTML = '';
        return;
    }

    try {
        currentTree = parseCSVToTree(inputText);
        renderTree(currentTree, treeContainer);
        document.getElementById('result').textContent = "Дерево успешно построено!";
        document.getElementById('decisionPath').innerHTML = '';
    } catch (error) {
        document.getElementById('result').textContent = `Ошибка: ${error.message}`;
        document.getElementById('decisionPath').innerHTML = '';
    }
});

// Обработчик кнопки Clear All
document.getElementById('buttonClear').addEventListener('click', function() {
    document.getElementById('inputDataset').value = '';
    document.getElementById('inputExample').value = '';
    document.getElementById('treeStart').innerHTML = '';
    document.getElementById('result').textContent = '';
    document.getElementById('decisionPath').innerHTML = '';
    currentTree = null;
    nodeIdCounter = 0;
});

// Обработчик кнопки Show Result
document.getElementById('showResultButton').addEventListener('click', function() {
    const inputExample = document.getElementById('inputExample').value.trim();
    const resultElement = document.getElementById('result');
    const pathElement = document.getElementById('decisionPath');

    if (!currentTree) {
        resultElement.textContent = "Ошибка: Сначала постройте дерево!";
        pathElement.innerHTML = '';
        return;
    }

    if (!inputExample) {
        resultElement.textContent = "Ошибка: Введите пример для классификации!";
        pathElement.innerHTML = '';
        return;
    }

    try {
        // Парсим пример
        const example = inputExample.split(',').map(item => {
            item = item.trim();
            return isNumeric(item) ? parseFloat(item) : item;
        });

        // Проверяем корректность количества признаков
        if (example.length !== header.length) {
            throw new Error(`Ожидается ${header.length} признаков, получено ${example.length}`);
        }

        // Классифицируем и получаем путь
        const { predictions, path, animationSteps } = classifyAndShowPath(example, currentTree);

        // Форматируем предсказание
        const total = Object.values(predictions).reduce((sum, count) => sum + count, 0);
        const probs = Object.entries(predictions)
            .map(([label, count]) => `${label}: ${(count / total * 100).toFixed(0)}%`)
            .join(", ");

        // Запускаем анимацию
        resultElement.textContent = "Анимация пути...";
        pathElement.innerHTML = '';
        animateDecisionPath(animationSteps, () => {
            // После анимации отображаем результат и путь
            resultElement.textContent = `Предсказание: ${probs}`;
            pathElement.innerHTML = "<strong>Путь принятия решения:</strong><br>" +
                path.join("<br>");
        });
    } catch (error) {
        resultElement.textContent = `Ошибка: ${error.message}`;
        pathElement.innerHTML = '';
    }
});