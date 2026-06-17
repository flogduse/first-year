'''Quiz Game - answer trivia questions'''

QUESTIONS = [
    {
        'question': 'What is the capital of France?',
        'options': ['A) London', 'B) Paris', 'C) Berlin', 'D) Madrid'],
        'answer': 'B'
    },
    {
        'question': 'What is 5 + 7?',
        'options': ['A) 10', 'B) 11', 'C) 12', 'D) 13'],
        'answer': 'C'
    },
    {
        'question': 'Which planet is known as the Red Planet?',
        'options': ['A) Venus', 'B) Jupiter', 'C) Saturn', 'D) Mars'],
        'answer': 'D'
    },
    {
        'question': 'What is the largest ocean on Earth?',
        'options': ['A) Atlantic', 'B) Indian', 'C) Pacific', 'D) Arctic'],
        'answer': 'C'
    },
    {
        'question': 'What year did World War II end?',
        'options': ['A) 1943', 'B) 1944', 'C) 1945', 'D) 1946'],
        'answer': 'C'
    },
    {
        'question': 'Which element has the chemical symbol "O"?',
        'options': ['A) Gold', 'B) Oxygen', 'C) Osmium', 'D) Oganesson'],
        'answer': 'B'
    },
    {
        'question': 'How many continents are there?',
        'options': ['A) 5', 'B) 6', 'C) 7', 'D) 8'],
        'answer': 'C'
    },
    {
        'question': 'Who wrote "Romeo and Juliet"?',
        'options': ['A) Charles Dickens', 'B) William Shakespeare', 'C) Mark Twain', 'D) Jane Austen'],
        'answer': 'B'
    },
    {
        'question': 'What is the speed of light approximately?',
        'options': ['A) 300,000 km/s', 'B) 150,000 km/s', 'C) 500,000 km/s', 'D) 100,000 km/s'],
        'answer': 'A'
    },
    {
        'question': 'Which programming language is this quiz written in?',
        'options': ['A) Java', 'B) C++', 'C) Python', 'D) JavaScript'],
        'answer': 'C'
    },
]

def main():
    score = 0
    print('=== Quiz Game ===')
    print('Answer 10 questions. Enter A, B, C, or D.\n')

    for i, q in enumerate(QUESTIONS, 1):
        print(f'Q{i}: {q["question"]}')
        for opt in q['options']:
            print(f'   {opt}')

        answer = input('Your answer: ').strip().upper()
        if answer == q['answer']:
            print('  Correct!\n')
            score += 1
        else:
            print(f'  Wrong! The answer was {q["answer"]}\n')

    print(f'Final Score: {score}/{len(QUESTIONS)}')
    if score == len(QUESTIONS):
        print('Perfect score!')
    elif score >= len(QUESTIONS) * 0.7:
        print('Great job!')
    elif score >= len(QUESTIONS) * 0.5:
        print('Not bad!')
    else:
        print('Keep practicing!')

if __name__ == '__main__':
    main()
