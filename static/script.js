document.addEventListener('DOMContentLoaded', (event) => {
    const typingArea = document.getElementById('typingArea');
    const accuracySpan = document.getElementById('accuracy');
    const correctWordsSpan = document.getElementById('correctWords');
    const totalWordsSpan = document.getElementById('totalWords');
    const timeLeftSpan = document.getElementById('timeLeft');
    const restartButton = document.getElementById('restartButton');
    
    let timeLeft = 60; // time limit in seconds
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft -= 1;
            timeLeftSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                typingArea.disabled = true;
                displayFinalResults();
            }
        }, 1000);
    }

    function displayFinalResults() {
        fetch('/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ typed_text: typingArea.value })
        })
        .then(response => response.json())
        .then(data => {
            accuracySpan.textContent = data.accuracy.toFixed(2);
            correctWordsSpan.textContent = data.correct_words;
            totalWordsSpan.textContent = data.total_words;
        });
    }

    function restartTest() {
        clearInterval(timerInterval);
        timeLeft = 60;
        timeLeftSpan.textContent = timeLeft;
        typingArea.value = '';
        typingArea.disabled = false;
        typingArea.focus();
        accuracySpan.textContent = '0';
        correctWordsSpan.textContent = '0';
        totalWordsSpan.textContent = '0';
        timerInterval = null;
    }

    typingArea.addEventListener('focus', () => {
        if (!timerInterval) {
            startTimer();
        }
    });

    typingArea.addEventListener('input', () => {
        if (timeLeft > 0) {
            fetch('/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ typed_text: typingArea.value })
            })
            .then(response => response.json())
            .then(data => {
                accuracySpan.textContent = data.accuracy.toFixed(2);
                correctWordsSpan.textContent = data.correct_words;
                totalWordsSpan.textContent = data.total_words;
            });
        }
    });

    restartButton.addEventListener('click', restartTest);
});
