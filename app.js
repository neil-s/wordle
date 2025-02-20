class WordMaster {
    constructor() {
        this.WORD_LENGTH = 5;
        this.ATTEMPTS = 6;
        this.currentAttempt = 0;
        this.currentPosition = 0;
        this.gameBoard = document.getElementById('game-board');
        this.keyboard = document.getElementById('keyboard');
        this.targetWord = 'MARRY';
        this.validWords = null; // Initialize as null
        
        // Load the wordlist
        fetch('wordlist.txt')
            .then(response => response.text())
            .then(text => {
                this.validWords = new Set(
                    text.split('\n')
                        .map(word => word.trim().toUpperCase())
                        .filter(word => word.length === 5)
                );
                console.log('Wordlist loaded:', this.validWords.size, 'words');
            })
            .catch(error => {
                console.error('Error loading wordlist:', error);
                // Fallback to a small set of words if loading fails
                this.validWords = new Set(['MARRY', 'HAPPY', 'HEART', 'SMILE', 'DREAM']);
            });
        
        this.initializeGame();
        this.setupKeyboardListeners();
    }

    initializeGame() {
        // Create game board
        for (let i = 0; i < this.ATTEMPTS; i++) {
            const row = document.createElement('div');
            row.className = 'game-row';
            
            for (let j = 0; j < this.WORD_LENGTH; j++) {
                const tile = document.createElement('div');
                tile.className = 'game-tile';
                row.appendChild(tile);
            }
            
            this.gameBoard.appendChild(row);
        }

        // Create keyboard
        const layout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
        ];

        layout.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(key => {
                const button = document.createElement('button');
                button.className = 'key';
                button.textContent = key;
                button.setAttribute('data-key', key);
                keyboardRow.appendChild(button);
            });
            
            this.keyboard.appendChild(keyboardRow);
        });
    }

    setupKeyboardListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.key')) {
                this.handleKeyPress(e.target.getAttribute('data-key'));
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key.match(/^[a-zA-Z]$/)) {
                this.handleKeyPress(e.key.toUpperCase());
            } else if (e.key === 'Enter') {
                this.handleKeyPress('ENTER');
            } else if (e.key === 'Backspace') {
                this.handleKeyPress('⌫');
            }
        });
    }

    handleKeyPress(key) {
        if (this.currentAttempt >= this.ATTEMPTS) return;

        if (key === '⌫') {
            if (this.currentPosition > 0) {
                this.currentPosition--;
                const tile = this.getCurrentTile();
                tile.textContent = '';
                tile.classList.remove('filled');
            }
            return;
        }

        if (key === 'ENTER') {
            if (this.currentPosition === this.WORD_LENGTH) {
                const tiles = this.getCurrentRow().querySelectorAll('.game-tile');
                const guess = Array.from(tiles)
                    .map(tile => tile.textContent)
                    .join('');

                // Check if wordlist is loaded and word is valid
                if (!this.validWords) {
                    this.showError('Loading word list...');
                    return;
                }

                if (!this.validWords.has(guess)) {
                    this.showError('Not in word list');
                    return;
                }

                if (guess === this.targetWord) {
                    this.showSuccess();
                } else {
                    this.checkGuess();
                    this.currentAttempt++;
                    this.currentPosition = 0;
                }
            }
            return;
        }

        if (this.currentPosition < this.WORD_LENGTH) {
            const tile = this.getCurrentTile();
            tile.textContent = key;
            tile.classList.add('filled');
            this.currentPosition++;
        }
    }

    getCurrentRow() {
        return this.gameBoard.children[this.currentAttempt];
    }

    getCurrentTile() {
        return this.getCurrentRow().children[this.currentPosition];
    }

    checkGuess() {
        const row = this.getCurrentRow();
        const tiles = row.querySelectorAll('.game-tile');
        const guess = Array.from(tiles).map(tile => tile.textContent);

        tiles.forEach((tile, index) => {
            const letter = guess[index];
            
            if (letter === this.targetWord[index]) {
                tile.style.backgroundColor = 'var(--correct-color)';
                tile.style.borderColor = 'var(--correct-color)';
            } else if (this.targetWord.includes(letter)) {
                tile.style.backgroundColor = 'var(--wrong-position-color)';
                tile.style.borderColor = 'var(--wrong-position-color)';
            } else {
                tile.style.backgroundColor = 'var(--incorrect-color)';
                tile.style.borderColor = 'var(--incorrect-color)';
            }
            tile.style.color = 'white';
        });
    }

    showSuccess() {
        // Animate the tiles
        const tiles = this.getCurrentRow().querySelectorAll('.game-tile');
        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.style.backgroundColor = 'var(--correct-color)';
                tile.style.borderColor = 'var(--correct-color)';
                tile.style.color = 'white';
                tile.style.transform = 'scale(1.1)';
            }, index * 100);
        });

        // Show the proposal message
        setTimeout(() => {
            // Add hearts background
            const heartsBg = document.createElement('div');
            heartsBg.className = 'hearts-bg';
            document.body.appendChild(heartsBg);

            // Create floating hearts
            for (let i = 0; i < 50; i++) {
                const heart = document.createElement('div');
                heart.innerHTML = '❤️';
                heart.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    bottom: -20px;
                    font-size: ${Math.random() * 20 + 10}px;
                    animation: floatHeart ${Math.random() * 3 + 2}s linear infinite;
                    opacity: ${Math.random() * 0.7 + 0.3};
                `;
                heartsBg.appendChild(heart);
            }

            // Show proposal message
            const message = document.createElement('div');
            message.className = 'proposal-message';
            message.innerHTML = `
                <h2>Will You Marry Me? 💝</h2>
                <p>You're the missing piece to my puzzle.</p>
                <p>I want to spend the rest of my life with you.</p>
                <p style="font-size: 2rem; margin-top: 1rem;">💍</p>
            `;
            document.querySelector('.container').appendChild(message);

            // Play celebration sound (optional)
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
            audio.play().catch(() => {}); // Catch in case autoplay is blocked
        }, 1500);
    }

    showError(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.querySelector('.container').appendChild(errorDiv);

        // Shake the current row
        const currentRow = this.getCurrentRow();
        currentRow.classList.add('shake');
        setTimeout(() => {
            currentRow.classList.remove('shake');
        }, 500);

        setTimeout(() => {
            errorDiv.remove();
        }, 1000);
    }
}

// Initialize the game
new WordMaster(); 