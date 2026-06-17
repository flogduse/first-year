'''Rock Paper Scissors - play against the computer'''

import random

CHOICES = ['rock', 'paper', 'scissors']

def get_winner(player, computer):
    if player == computer:
        return 'tie'
    if (player == 'rock' and computer == 'scissors') or \
       (player == 'scissors' and computer == 'paper') or \
       (player == 'paper' and computer == 'rock'):
        return 'player'
    return 'computer'

def main():
    player_score = 0
    computer_score = 0
    rounds = 0

    print('=== Rock Paper Scissors ===')
    print('First to 3 wins!')

    while player_score < 3 and computer_score < 3:
        print(f'\nScore — You: {player_score}  Computer: {computer_score}')
        player = input('Enter rock, paper, or scissors (or q to quit): ').lower()

        if player == 'q':
            break
        if player not in CHOICES:
            print('Invalid choice, try again.')
            continue

        computer = random.choice(CHOICES)
        print(f'Computer chose: {computer}')

        winner = get_winner(player, computer)
        if winner == 'player':
            print('You win this round!')
            player_score += 1
        elif winner == 'computer':
            print('Computer wins this round!')
            computer_score += 1
        else:
            print("It's a tie!")

        rounds += 1

    print(f'\nFinal Score — You: {player_score}  Computer: {computer_score}')
    if player_score > computer_score:
        print('You won the game!')
    elif computer_score > player_score:
        print('Computer won the game!')
    else:
        print("It's a draw!")
    print(f'Total rounds played: {rounds}')

if __name__ == '__main__':
    main()
