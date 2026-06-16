'''Hangman - guess the word before the man is hanged'''

import random


WORDS = [
    'python', 'developer', 'computer', 'algorithm', 'variable',
    'function', 'keyboard', 'monitor', 'network', 'program',
    'garden', 'planet', 'rocket', 'tiger', 'castle',
    'puzzle', 'ocean', 'forest', 'bridge', 'winter',
]


def display_hangman(attempts):
    stages = [
        '''
           -----
           |   |
           O   |
          /|\\  |
          / \\  |
               |
        =========''',
        '''
           -----
           |   |
           O   |
          /|\\  |
          /    |
               |
        =========''',
        '''
           -----
           |   |
           O   |
          /|\\  |
               |
               |
        =========''',
        '''
           -----
           |   |
           O   |
          /|   |
               |
               |
        =========''',
        '''
           -----
           |   |
           O   |
           |   |
               |
               |
        =========''',
        '''
           -----
           |   |
           O   |
               |
               |
               |
        =========''',
        '''
           -----
           |   |
               |
               |
               |
               |
        =========''',
    ]
    return stages[attempts]


def play_round():
    word = random.choice(WORDS).upper()
    guessed_letters = set()
    attempts = 6
    display = ['_'] * len(word)

    print('\n' + '=' * 40)
    print('       HANGMAN')
    print('=' * 40)

    while attempts > 0:
        print(display_hangman(attempts))
        print('\nWord: ' + ' '.join(display))
        print(f'Guessed: {", ".join(sorted(guessed_letters)) if guessed_letters else "none"}')
        print(f'Attempts left: {attempts}')

        guess = input('\nGuess a letter: ').upper().strip()

        if len(guess) != 1 or not guess.isalpha():
            print('Please enter a single letter.')
            continue

        if guess in guessed_letters:
            print('You already guessed that letter!')
            continue

        guessed_letters.add(guess)

        if guess in word:
            print(f'\nGood! {guess} is in the word.')
            for i, letter in enumerate(word):
                if letter == guess:
                    display[i] = guess
        else:
            print(f'\nWrong! {guess} is not in the word.')
            attempts -= 1

        if '_' not in display:
            print('\n' + ' '.join(display))
            print(f'\nCongratulations! You guessed it: {word} \u2728')
            return True

    print(display_hangman(attempts))
    print(f'\nGame over! The word was: {word} \uD83D\uDE22')
    return False


def main():
    score = 0
    rounds = 0
    play = True

    while play:
        rounds += 1
        print(f'\n--- Round {rounds} ---')
        if play_round():
            score += 1

        choice = input('\nPlay again? (y/n): ').lower()
        if choice != 'y':
            play = False

    print(f'\n{"=" * 40}')
    print(f'  Final score: {score}/{rounds}')
    print(f'{"=" * 40}')
    input('Press Enter to exit...')


if __name__ == '__main__':
    main()
