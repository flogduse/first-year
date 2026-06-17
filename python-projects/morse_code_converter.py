'''Morse Code Converter - convert text to/from Morse code'''

MORSE_CODE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
    '@': '.--.-.', ' ': '/'
}

REVERSE_MORSE = {v: k for k, v in MORSE_CODE.items()}

def text_to_morse(text):
    result = []
    for char in text.upper():
        if char in MORSE_CODE:
            result.append(MORSE_CODE[char])
        else:
            result.append('?')
    return ' '.join(result)

def morse_to_text(morse):
    result = []
    for code in morse.split(' '):
        if code in REVERSE_MORSE:
            result.append(REVERSE_MORSE[code])
        elif code == '':
            continue
        else:
            result.append('?')
    return ''.join(result)

def main():
    print('=== Morse Code Converter ===')

    while True:
        print('\n1. Text to Morse Code')
        print('2. Morse Code to Text')
        print('3. Quit')
        choice = input('Choose (1-3): ')

        if choice == '1':
            text = input('Enter text: ')
            print(f'Morse: {text_to_morse(text)}')
        elif choice == '2':
            morse = input('Enter Morse (use spaces between letters): ')
            print(f'Text: {morse_to_text(morse)}')
        elif choice == '3':
            break
        else:
            print('Invalid choice.')

if __name__ == '__main__':
    main()
