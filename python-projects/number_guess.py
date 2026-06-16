'''Number Guessing Game - guess the secret number'''

import random


def play_round(min_num=1, max_num=100, max_attempts=7):
    secret = random.randint(min_num, max_num)
    print(f'\nI\'m thinking of a number between {min_num} and {max_num}.')
    print(f'You have {max_attempts} attempts. Good luck!\n')

    for attempt in range(1, max_attempts + 1):
        try:
            guess = int(input(f'Attempt {attempt}/{max_attempts}: '))
        except ValueError:
            print('Please enter a valid number.')
            continue

        if guess < secret:
            print('Too low! \u2191')
        elif guess > secret:
            print('Too high! \u2193')
        else:
            print(f'\nCorrect! You got it in {attempt} attempt(s)! \u2728')
            return True

    print(f'\nOut of attempts! The number was {secret}. \uD83D\uDE22')
    return False


def main():
    print('=' * 40)
    print('      NUMBER GUESSING GAME')
    print('=' * 40)

    score = 0
    rounds = 0
    play = True

    while play:
        rounds += 1
        print(f'\n--- Round {rounds} ---')
        if play_round(1, 100, 7):
            score += 1

        choice = input('\nPlay again? (y/n): ').lower()
        if choice != 'y':
            play = False

    print(f'\n{"=" * 40}')
    print(f'  Final score: {score}/{rounds}')
    print(f'{"=" * 40}')
    input('\nPress Enter to exit...')


if __name__ == '__main__':
    main()
