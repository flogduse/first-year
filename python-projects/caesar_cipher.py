'''Caesar Cipher - encode and decode secret messages'''

def caesar(text, shift, mode):
    result = ''
    shift = shift if mode == 'encode' else -shift

    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base + shift) % 26 + base)
        else:
            result += char

    return result

def main():
    print('=== Caesar Cipher ===')
    print('Encode or decode messages with a shift.\n')

    while True:
        mode = input('Enter "encode", "decode", or "q" to quit: ').lower()
        if mode == 'q':
            break
        if mode not in ('encode', 'decode'):
            print('Invalid choice.')
            continue

        message = input('Enter your message: ')
        try:
            shift = int(input('Enter shift number (1-25): '))
            if shift < 1 or shift > 25:
                print('Shift must be between 1 and 25.')
                continue
        except ValueError:
            print('Invalid number.')
            continue

        result = caesar(message, shift, mode)
        print(f'Result: {result}\n')

if __name__ == '__main__':
    main()
