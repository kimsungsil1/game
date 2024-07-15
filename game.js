let startTime;
let timerInterval;
let matchStartTime;
let matchTimerInterval;
let memorizeTime;
let shuffledDeck = [];
let currentCardIndex = 0;
const gameArea = document.getElementById('game-area');
const cardSelection = document.getElementById('card-selection');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const timer = document.getElementById('timer');
const matchTimer = document.createElement('div');
matchTimer.textContent = 'Match Time: 0 seconds';
document.body.appendChild(matchTimer);

// 카드 덱 생성
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value: `${value}${suit}`, suit: suit });
        }
    }
    return deck;
}

// 덱을 섞는 함수
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// 타이머 시작
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        timer.textContent = `Time: ${elapsedTime} seconds`;
    }, 1000);
}

// 타이머 정지
function stopTimer() {
    clearInterval(timerInterval);
}

// 매칭 타이머 시작
function startMatchTimer() {
    matchStartTime = Date.now();
    matchTimerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - matchStartTime) / 1000);
        matchTimer.textContent = `Match Time: ${elapsedTime} seconds`;
    }, 1000);
}

// 매칭 타이머 정지
function stopMatchTimer() {
    clearInterval(matchTimerInterval);
}

// 카드 요소 생성
function createCardElement(card, hidden = false) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = hidden ? '?' : card.value;
    cardElement.style.color = hidden ? 'black' : (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
    return cardElement;
}

// 게임 시작
function startGame() {
    // 타이머가 작동하지 않으면 타이머 정지 및 초기화
    if (timerInterval) stopTimer();
    if (matchTimerInterval) stopMatchTimer();

    shuffledDeck = shuffleDeck(createDeck());
    gameArea.innerHTML = '';
    cardSelection.innerHTML = '';
    cardSelection.style.display = 'none'; // 카드 선택 영역 숨기기
    startButton.disabled = true;
    stopButton.disabled = false;
    timer.textContent = 'Time: 0 seconds';
    matchTimer.textContent = 'Match Time: 0 seconds';
    currentCardIndex = 0;
    startTimer();

    // 앞면 카드 표시
    shuffledDeck.forEach((card, index) => {
        const cardElement = createCardElement(card);
        cardElement.dataset.index = index;
        gameArea.appendChild(cardElement);
    });
}

// 카드 선택
function selectCard(cardValue) {
    const correctCard = shuffledDeck[currentCardIndex].value;

    if (cardValue === correctCard) {
        const cardElements = gameArea.children;
        cardElements[currentCardIndex].textContent = cardValue;
        cardElements[currentCardIndex].style.color = (shuffledDeck[currentCardIndex].suit === '♥' || shuffledDeck[currentCardIndex].suit === '♦') ? 'red' : 'black';
        currentCardIndex++;

        if (currentCardIndex === shuffledDeck.length) {
            stopMatchTimer();
            const matchTime = Math.floor((Date.now() - matchStartTime) / 1000);
            alert(`축하합니다! 모든 카드를 맞췄습니다.\n외우는 시간: ${memorizeTime}초\n맞추는 시간: ${matchTime}초`);
        }
    }
}

// 게임 정지
function stopGame() {
    stopTimer();
    memorizeTime = Math.floor((Date.now() - startTime) / 1000);
    startMatchTimer();
    cardSelection.style.display = 'block'; // 카드 선택 영역 표시
    stopButton.disabled = true;

    // 카드 뒷면으로 변경
    Array.from(gameArea.children).forEach(cardElement => {
        cardElement.textContent = '?';
        cardElement.style.color = 'black';
    });

    // 카드 선택 요소 생성
    const deck = createDeck();
    cardSelection.innerHTML = ''; // 카드 선택 영역을 초기화
    deck.forEach((card, index) => {
        const cardElement = createCardElement(card);
        cardElement.addEventListener('click', () => selectCard(card.value));
        cardSelection.appendChild(cardElement);

        // 줄바꿈을 위해 13장마다 줄바꿈 추가
        if ((index + 1) % 13 === 0) {
            const breakElement = document.createElement('br');
            cardSelection.appendChild(breakElement);
        }
    });
}

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);
