const words = window.words;

const selectAtLeast120chars = (initialWords) => {
    const iw = words.slice(0, initialWords);
    const letters = [...new Set(iw.join(''))];
    const reg = new RegExp(`^[${letters.join('')}]+` + '$');
    const availableWords = words.filter(x => x.match(reg));
    const max_rand = availableWords.length
    const next = [];
    let more = 120;
    while (more > 0) {
        let word = availableWords[
            Math.floor(Math.random() * (max_rand - 1))
        ];
        next.push(word);
        more -= word.length;
    }
    return next;
}

const keypositions = {
    q: {
        left: 63,
        top: 58
    },
    w: {
        left: 99,
        top: 51
    },
    e: {
        left: 133,
        top: 45
    },
    r: {
        left: 167,
        top: 49
    },
    t: {
        left: 202,
        top: 53
    },
    a: {
        left: 63,
        top: 92
    },
    s: {
        left: 99,
        top: 84
    },
    d: {
        left: 133,
        top: 79
    },
    f: {
        left: 167,
        top: 84
    },
    g: {
        left: 202,
        top: 87
    },
    z: {
        left: 63,
        top: 127
    },
    x: {
        left: 99,
        top: 118,
    },
    c: {
        left: 133,
        top: 113
    },
    v: {
        left: 167,
        top: 118
    },
    b: {
        left: 202,
        top: 122
    },
    y: {
        left: 392,
        top: 53
    },
    h: {
        left: 392,
        top: 87
    },
    n: {
        left: 392,
        top: 122
    },
    u: {
        left: 426,
        top: 49
    },
    j: {
        left: 426,
        top: 84
    },
    m: {
        left: 426,
        top: 118
    },
    i: {
        left: 461,
        top: 45
    },
    k: {
        left: 461,
        top: 79
    },

    o: {
        left: 495,
        top: 51
    },
    l: {
        left: 495,
        top: 84
    },
    p: {
        left: 530,
        top: 58
    },
    ' ': {
        left: 236,
        top: 156
    }
}
const fillKeyboardDivs = () => {

    document.getElementById('keyboard').innerHTML = ' abcdefghijklmnopqrstuvwxyz'.split('').map(key => {
        return `<div id="key-${key}" class="key"></div>`
    }).join('');

    Object.keys(keypositions).forEach(key => {
        const keyBtn = document.getElementById(`key-${key}`);
        keyBtn.style.left = `${keypositions[key].left}px`;
        keyBtn.style.top = `${keypositions[key].top}px`;
        if (key === ' ') {
            keyBtn.style.transform = 'translate(-2px,2px) rotatez(30deg) scaley(1.7)';
        }
    })

};

const showFinger = key => {
    let next = 0;
    switch (key) {
        case 'q':
        case 'a':
        case 'z':
            next = 34; break;
        case 'w':
        case 's':
        case 'x':
            next = 56; break;
        case 'e':
        case 'd':
        case 'c':
            next = 77; break;
        case 'r':
        case 'f':
        case 'v':
        case 't':
        case 'g':
        case 'b':
            next = 102; break;
        case ' ':
            next = 155; break;
        case 'y':
        case 'h':
        case 'n':
        case 'u':
        case 'j':
        case 'm':
            next = 566; break;
        case 'i':
        case 'k':
            next = 593; break;
        case 'o':
        case 'l':
            next = 614; break;
        case 'p':
            next = 635;
    }
    document.getElementById('dito').style.left = next;
}
const prepare = next => {
    fillKeyboardDivs();
    const round = document.getElementById('round');
    round.innerHTML = `${
        next.join(' ').split('').map((char, index) => {
            return `<span class="none" data-idx="${index}">${char}</span>`
        }).join('')
        }`
    round.firstChild.classList.add('current');
    document.getElementById('key-' + round.firstChild.innerText).classList.add('selected');
    showFinger(round.firstChild.innerText);
}

const init = () => {
    let wordsUnlocked = 5;
    if (localStorage.getItem('wordsUnlocked')) {
        wordsUnlocked = localStorage.getItem('wordsUnlocked') - 0;
    } else {
        localStorage.setItem('wordsUnlocked', wordsUnlocked);
    }

    const nextRound = () => {
        document.getElementById('progress').innerHTML = `${wordsUnlocked} of ${words.length}`;

        let next = selectAtLeast120chars(wordsUnlocked);
        prepare(next);
        document.addEventListener('keyup', handleKeyUp)
    }
    const endRound = () => {
        document.removeEventListener('keyup', handleKeyUp);
        let errors = document.querySelectorAll('.wrong').length;
        let correct = document.querySelectorAll('.correct').length;
        const perCentErrors = errors * 100 / (errors + correct);

        if (perCentErrors < 5) {
            wordsUnlocked += 1;
        }
        if (perCentErrors < 3) {
            wordsUnlocked += 1;
        }
        if (perCentErrors < 1) {
            wordsUnlocked += 1;
        }
        if (perCentErrors === 0) {
            wordsUnlocked += 2;
        }

        localStorage.setItem('wordsUnlocked', wordsUnlocked);
        nextRound();
    }
    const handleKeyUp = evt => {
        const currentElement = document.querySelector('.current');
        if (!currentElement) return;
        currentElement.classList.remove('current');
        if (evt.key === currentElement.innerText) {
            currentElement.classList.add('correct');
        } else {
            currentElement.classList.add('wrong');
            // TODO animate wrong key
            const maybeKey = document.getElementById('key-' + evt.key);
            if (maybeKey) {
                maybeKey.classList.add('bad');
                setTimeout(key => {
                    key.classList.remove('bad')
                }, 60, maybeKey);
            }
        }
        if (currentElement.nextSibling) {
            currentElement.nextSibling.classList.add('current');
            let nextLetter = currentElement.nextSibling.innerText;
            if (currentElement.innerText != nextLetter) {
                document.getElementById('key-' + currentElement.innerText).classList.remove('selected');
                document.getElementById('key-' + nextLetter).classList.add('selected');
                showFinger(nextLetter);
            }

        } else {
            endRound();
        }
    };


    let currentPercentage = 0;
    nextRound(wordsUnlocked);
};
document.addEventListener('DOMContentLoaded', init);
