'''Dice Roll Simulator - roll dice and see the results'''

import random

def roll_dice(sides=6, count=1):
    return [random.randint(1, sides) for _ in range(count)]

def histogram(results, sides):
    print(f'\nResults (d{sides}):')
    for i in range(1, sides + 1):
        count = results.count(i)
        bar = '#' * count
        print(f'{i:2}: {bar} ({count})')

def main():
    print('=== Dice Roll Simulator ===')

    while True:
        print('\nOptions:')
        print('1. Roll a single d6')
        print('2. Roll two d6')
        print('3. Roll a custom die')
        print('4. Roll multiple custom dice with histogram')
        print('5. Quit')

        choice = input('Choose (1-5): ')

        if choice == '1':
            result = roll_dice(6, 1)
            print(f'You rolled: {result[0]}')
        elif choice == '2':
            result = roll_dice(6, 2)
            print(f'You rolled: {result[0]} and {result[1]} (total: {sum(result)})')
        elif choice == '3':
            try:
                sides = int(input('Number of sides: '))
                result = roll_dice(sides, 1)
                print(f'You rolled: {result[0]}')
            except ValueError:
                print('Invalid number.')
        elif choice == '4':
            try:
                sides = int(input('Number of sides: '))
                count = int(input('Number of dice: '))
                rolls = int(input('Number of rolls: '))
                all_results = []
                for _ in range(rolls):
                    all_results.extend(roll_dice(sides, count))
                histogram(all_results, sides)
            except ValueError:
                print('Invalid number.')
        elif choice == '5':
            break
        else:
            print('Invalid choice.')

if __name__ == '__main__':
    main()
