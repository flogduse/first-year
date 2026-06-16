'''Password Generator - creates strong random passwords'''

import random
import string

def generate_password(length=12, use_upper=True, use_lower=True, use_digits=True, use_symbols=True):
    chars = ''
    if use_upper:    chars += string.ascii_uppercase
    if use_lower:    chars += string.ascii_lowercase
    if use_digits:   chars += string.digits
    if use_symbols:  chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if not chars:
        return 'Error: Select at least one character type.'

    password = ''.join(random.choice(chars) for _ in range(length))
    return password


def main():
    print('=' * 40)
    print('      PASSWORD GENERATOR')
    print('=' * 40)

    try:
        length = int(input('\nPassword length (default 12): ') or '12')
    except ValueError:
        length = 12

    use_upper = input('Include uppercase letters? (y/n, default y): ').lower() != 'n'
    use_lower = input('Include lowercase letters? (y/n, default y): ').lower() != 'n'
    use_digits = input('Include digits? (y/n, default y): ').lower() != 'n'
    use_symbols = input('Include symbols? (y/n, default y): ').lower() != 'n'

    count = 1
    try:
        count_input = input('\nHow many passwords to generate? (default 1): ')
        if count_input:
            count = int(count_input)
    except ValueError:
        count = 1

    print(f'\n{"=" * 40}')
    print(f'  {count} Generated Password(s):')
    print(f'{"=" * 40}\n')

    for i in range(count):
        pwd = generate_password(length, use_upper, use_lower, use_digits, use_symbols)
        print(f'  {i + 1}. {pwd}')

    print(f'\n{"=" * 40}')
    input('Press Enter to exit...')


if __name__ == '__main__':
    main()
