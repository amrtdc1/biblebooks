// Bible books data
const bibleBooks = [
// Old Testament
'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
'1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations',
'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
// New Testament
'Matthew', 'Mark', 'Luke', 'John', 'Acts',
'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
'2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
'1 Peter', '2 Peter', '1 John', '2 John', '3 John',
'Jude', 'Revelation'
];

const bookGroups = [
{ name: 'Torah/Pentateuch', start: 0, count: 5 },
{ name: 'Historical Books 1', start: 5, count: 10 },
{ name: 'Historical Books 2', start: 15, count: 5 },
{ name: 'Wisdom Books', start: 20, count: 5 },
{ name: 'Major Prophets', start: 25, count: 5 },
{ name: 'Minor Prophets 1', start: 30, count: 9 },
{ name: 'Gospels & Acts', start: 39, count: 5 },
{ name: "Paul's Letters 1", start: 44, count: 10 },
{ name: "Paul's Letters 2", start: 54, count: 4 },
{ name: 'General Epistles', start: 58, count: 7 },
{ name: 'Revelation', start: 65, count: 1 }
];

let currentGroup = 0;
let currentBooks = [];
let orderedBooks = [];
let inputMethod = 'tap';
let draggedElement = null;

// Initialize the app
function init() {
console.log('Setting up group selector…');
try {
setupGroupSelector();
loadGroup(0);
updateProgress();
setupDragDropListeners();
console.log('App initialized successfully');
} catch (error) {
console.error('Error initializing app:', error);
}
}

function setupGroupSelector() {
const selector = document.getElementById('groupSelector');
if (!selector) {
console.error('Group selector element not found');
return;
}

// Clear any existing content
selector.innerHTML = '';

bookGroups.forEach((group, index) => {
    const btn = document.createElement('button');
    btn.className = 'group-btn';
    btn.textContent = group.name;
    btn.onclick = () => loadGroup(index);
    selector.appendChild(btn);
    console.log(`Added group button: ${group.name}`);
});

if (selector.children.length > 0) {
    selector.children[0].classList.add('active');
}

}

function loadGroup(groupIndex) {
currentGroup = groupIndex;
const group = bookGroups[groupIndex];
currentBooks = bibleBooks.slice(group.start, group.start + group.count);
orderedBooks = [];


// Update active group button
document.querySelectorAll('.group-btn').forEach((btn, index) => {
    btn.classList.toggle('active', index === groupIndex);
});

document.getElementById('currentGroupTitle').textContent = group.name;
document.getElementById('gameArea').style.display = 'block';
document.getElementById('completionMessage').style.display = 'none';

renderBooks();
updateProgress();

}

function renderBooks() {
const availableContainer = document.getElementById('availableBooks');
const orderedContainer = document.getElementById('orderedBooks');


// Clear containers
availableContainer.innerHTML = '<div style="width: 100%; text-align: center; color: var(--text-color); margin-bottom: 10px; opacity: 0.7;">Available Books (click to add)</div>';
orderedContainer.innerHTML = '';

// Create shuffled array of available books
const availableBooks = [...currentBooks].filter(book => !orderedBooks.includes(book));
shuffleArray(availableBooks);

// Render available books
availableBooks.forEach(book => {
    const bookElement = createBookElement(book, 'available');
    availableContainer.appendChild(bookElement);
});

// Render ordered books
orderedBooks.forEach((book, index) => {
    const bookElement = createBookElement(book, 'ordered', index);
    orderedContainer.appendChild(bookElement);
});

}

function createBookElement(book, type, index = -1) {
const element = document.createElement('div');
element.className = 'book-item';
element.textContent = book;
element.dataset.book = book;

if (inputMethod === 'drag') {
    element.draggable = true;
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
}

if (type === 'available') {
    element.addEventListener('click', () => addBookToOrder(book));
} else if (type === 'ordered') {
    element.addEventListener('click', () => removeBookFromOrder(index));
}

return element;

}

// Tap-to-order methods
function addBookToOrder(book) {
if (inputMethod === 'tap' && !orderedBooks.includes(book)) {
orderedBooks.push(book);
renderBooks();
}
}

function removeBookFromOrder(index) {
if (inputMethod === 'tap') {
orderedBooks.splice(index, 1);
renderBooks();
}
}

// Drag and drop methods
function handleDragStart(e) {
draggedElement = e.target;
e.target.classList.add('dragging');
e.dataTransfer.effectAllowed = 'move';
e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
e.target.classList.remove('dragging');
draggedElement = null;
}

// Setup drop zone
function setupDragDropListeners() {
const orderedList = document.getElementById('orderedList');
if (orderedList) {
orderedList.addEventListener('dragover', handleDragOver);
orderedList.addEventListener('drop', handleDrop);
orderedList.addEventListener('dragenter', handleDragEnter);
orderedList.addEventListener('dragleave', handleDragLeave);
}
}

// Remove the old event listener setup
// document.addEventListener(‘DOMContentLoaded’, () => {
//     const orderedList = document.getElementById(‘orderedList’);
//     orderedList.addEventListener(‘dragover’, handleDragOver);
//     orderedList.addEventListener(‘drop’, handleDrop);
//     orderedList.addEventListener(‘dragenter’, handleDragEnter);
//     orderedList.addEventListener(‘dragleave’, handleDragLeave);
// });

function handleDragOver(e) {
e.preventDefault();
e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
e.preventDefault();
e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
if (!e.currentTarget.contains(e.relatedTarget)) {
e.currentTarget.classList.remove('drag-over');
}
}

function handleDrop(e) {
e.preventDefault();
e.currentTarget.classList.remove('drag-over');

if (draggedElement && inputMethod === 'drag') {
    const book = draggedElement.dataset.book;
    if (!orderedBooks.includes(book)) {
        orderedBooks.push(book);
        renderBooks();
    }
}

}

function setInputMethod(method) {
inputMethod = method;
document.querySelectorAll('.method-btn').forEach(btn => {
btn.classList.toggle('active', btn.textContent.toLowerCase().includes(method));
});
renderBooks();
}

function checkOrder() {
const group = bookGroups[currentGroup];
const correctOrder = bibleBooks.slice(group.start, group.start + group.count);

// Clear previous styles
document.querySelectorAll('.book-item').forEach(item => {
    item.classList.remove('correct', 'incorrect');
});

let allCorrect = true;

// Check each position
orderedBooks.forEach((book, index) => {
    const bookElement = document.querySelector(`#orderedBooks .book-item[data-book="${book}"]`);
    if (bookElement) {
        if (index < correctOrder.length && book === correctOrder[index]) {
            bookElement.classList.add('correct');
        } else {
            bookElement.classList.add('incorrect');
            allCorrect = false;
        }
    }
});

// Check if all books are placed and in correct order
if (allCorrect && orderedBooks.length === correctOrder.length) {
    showCompletion();
}

}

function showCompletion() {
const message = document.getElementById('completionMessage');
const group = bookGroups[currentGroup];
message.innerHTML = `<div>🎉 Excellent! You've mastered ${group.name}!</div> <div style="margin-top: 10px; font-size: 16px;"> ${currentGroup < bookGroups.length - 1 ?  '<button class="btn" onclick="loadGroup(' + (currentGroup + 1) + ')" style="margin-top: 15px;">Next Group →</button>' :  'You\'ve completed all groups! 🏆' } </div>`;
message.style.display = 'block';
}

function resetGroup() {
orderedBooks = [];
renderBooks();
document.getElementById('completionMessage').style.display = 'none';
}

function showAnswers() {
const group = bookGroups[currentGroup];
const correctOrder = bibleBooks.slice(group.start, group.start + group.count);
orderedBooks = [...correctOrder];
renderBooks();

// Highlight all as correct
setTimeout(() => {
    document.querySelectorAll('#orderedBooks .book-item').forEach(item => {
        item.classList.add('correct');
    });
}, 100);

}

function updateProgress() {
const progress = document.getElementById('progress');
progress.textContent = `Group ${currentGroup + 1} of ${bookGroups.length}: ${bookGroups[currentGroup].name}`;
}

function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[array[i], array[j]] = [array[j], array[i]];
}
}

function toggleTheme() {
console.log('Toggling theme…');
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');

if (!body || !themeToggle) {
    console.error('Theme elements not found');
    return;
}

if (body.dataset.theme === 'light') {
    body.dataset.theme = 'dark';
    themeToggle.textContent = '☀️';
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('theme', 'dark');
    }
} else {
    body.dataset.theme = 'light';
    themeToggle.textContent = '🌙';
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem('theme', 'light');
    }
}
console.log('Theme changed to:', body.dataset.theme);

}

// Load saved theme
function loadTheme() {
let savedTheme = 'light'; // default

if (typeof(Storage) !== "undefined") {
    savedTheme = localStorage.getItem('theme') || 'light';
}

const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');

if (body) {
    body.dataset.theme = savedTheme;
}

if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

console.log('Theme loaded:', savedTheme);

}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('./sw.js');
}

// Initialize app - multiple ways to ensure it loads
function initializeApp() {
console.log('Initializing app…');
loadTheme();
init();
}

// Try multiple initialization methods
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('load', initializeApp);

// Fallback initialization after a short delay
setTimeout(() => {
if (!document.getElementById('groupSelector').hasChildNodes()) {
console.log('Fallback initialization…');
initializeApp();
}
}, 1000);