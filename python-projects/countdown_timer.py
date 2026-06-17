'''Countdown Timer - set a timer that counts down'''

import time
import math

def format_time(seconds):
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    if h > 0:
        return f'{h}h {m}m {s}s'
    elif m > 0:
        return f'{m}m {s}s'
    else:
        return f'{s}s'

def main():
    print('=== Countdown Timer ===')

    try:
        total = int(input('Enter time in seconds: '))
        if total <= 0:
            print('Must be a positive number.')
            return
    except ValueError:
        print('Invalid number.')
        return

    print(f'\nTimer set for {format_time(total)}')
    input('Press Enter to start...')

    try:
        for remaining in range(total, 0, -1):
            mins = remaining // 60
            secs = remaining % 60
            bar_length = 30
            filled = int((remaining / total) * bar_length)
            bar = '█' * filled + '░' * (bar_length - filled)
            print(f'\r{bar} {mins:02d}:{secs:02d} ', end='', flush=True)
            time.sleep(1)
    except KeyboardInterrupt:
        print('\n\nTimer cancelled.')

    print('\n\nTime\'s up!')

if __name__ == '__main__':
    main()
