'''Air Canvas - draw in the air using hand tracking'''

import cv2
import numpy as np
import mediapipe as mp
from collections import deque


COLORS = [
    (0, 0, 255),    # Red
    (0, 255, 0),    # Green
    (255, 0, 0),    # Blue
    (0, 255, 255),  # Yellow
    (255, 0, 255),  # Magenta
    (255, 255, 255),# White (eraser)
]

COLOR_NAMES = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Eraser']

BRUSH_SIZES = [5, 10, 15, 20]


def draw_toolbar(frame, selected_color, brush_size):
    h, w, _ = frame.shape
    toolbar_h = 80
    color_w = w // len(COLORS)

    cv2.rectangle(frame, (0, 0), (w, toolbar_h), (30, 30, 30), -1)

    for i, color in enumerate(COLORS):
        x1 = i * color_w + 10
        y1 = 10
        x2 = (i + 1) * color_w - 10
        y2 = toolbar_h - 10

        if color != (255, 255, 255):
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, -1)
        else:
            cv2.rectangle(frame, (x1, y1), (x2, y2), (60, 60, 60), -1)
            cv2.putText(frame, 'ERASE', (x1 + 8, y1 + 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)

        cv2.putText(frame, COLOR_NAMES[i], (x1 + 8, y2 - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (200, 200, 200), 1)

        if i == selected_color:
            cv2.rectangle(frame, (x1 - 2, y1 - 2), (x2 + 2, y2 + 2), (255, 255, 255), 2)

    cv2.putText(frame, f'Brush: {brush_size}', (w - 140, toolbar_h - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

    cv2.putText(frame, 'Pinch thumb+index to click  |  Press Q to quit',
                (10, toolbar_h + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (150, 150, 150), 1)


def get_toolbar_selection(x, y, w):
    if y > 80:
        return None
    color_w = w // len(COLORS)
    idx = x // color_w
    if 0 <= idx < len(COLORS):
        return idx
    return None


def is_pinching(hand_landmarks, h, w):
    thumb_tip = hand_landmarks.landmark[4]
    index_tip = hand_landmarks.landmark[8]
    tx, ty = int(thumb_tip.x * w), int(thumb_tip.y * h)
    ix, iy = int(index_tip.x * w), int(index_tip.y * h)
    dist = np.sqrt((tx - ix) ** 2 + (ty - iy) ** 2)
    return dist < 40, (tx, ty), (ix, iy)


def main():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print('Error: Could not open webcam.')
        return

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(
        static_image_mode=False,
        max_num_hands=1,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.6,
    )
    mp_draw = mp.solutions.drawing_utils

    canvas = None
    selected_color = 0
    brush_size = 10
    prev_x, prev_y = None, None
    drawing_points = deque(maxlen=2)

    print('Air Canvas started!')
    print('  - Move your index finger to draw')
    print('  - Pinch thumb + index to click toolbar buttons')
    print('  - Point at a color to select it')
    print('  - Press Q to quit')
    print('  - Press C to clear canvas')
    print('  - Press +/- to adjust brush size')

    while True:
        ret, frame = cap.read()
        if not ret:
            print('Failed to grab frame.')
            break

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape

        if canvas is None:
            canvas = np.zeros((h, w, 3), dtype=np.uint8)

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb)

        draw_toolbar(frame, selected_color, brush_size)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_draw.draw_landmarks(
                    frame, hand_landmarks, mp_hands.HAND_CONNECTIONS,
                    mp_draw.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=2),
                    mp_draw.DrawingSpec(color=(255, 255, 255), thickness=1),
                )

                index_tip = hand_landmarks.landmark[8]
                ix, iy = int(index_tip.x * w), int(index_tip.y * h)

                pinching, thumb_pos, index_pos = is_pinching(hand_landmarks, h, w)

                if iy < 80:
                    selection = get_toolbar_selection(ix, iy, w)
                    if selection is not None and pinching:
                        selected_color = selection
                        prev_x, prev_y = None, None
                        cv2.circle(frame, (ix, iy), 10, (255, 255, 255), 2)
                else:
                    if not pinching:
                        color = COLORS[selected_color]
                        size = brush_size

                        if selected_color == 5:
                            cv2.circle(frame, (ix, iy), size, (255, 255, 255), -1)
                            cv2.circle(canvas, (ix, iy), size, (0, 0, 0), -1)
                        else:
                            cv2.circle(frame, (ix, iy), size, color, -1)
                            cv2.circle(canvas, (ix, iy), size, color, -1)

                        if prev_x is not None and prev_y is not None:
                            if selected_color == 5:
                                cv2.line(frame, (prev_x, prev_y), (ix, iy), (255, 255, 255), size)
                                cv2.line(canvas, (prev_x, prev_y), (ix, iy), (0, 0, 0), size)
                            else:
                                cv2.line(frame, (prev_x, prev_y), (ix, iy), color, size)
                                cv2.line(canvas, (prev_x, prev_y), (ix, iy), color, size)

                        prev_x, prev_y = ix, iy
                    else:
                        prev_x, prev_y = None, None

                    if pinching:
                        cv2.circle(frame, (ix, iy), 8, (0, 255, 255), 2)
        else:
            prev_x, prev_y = None, None

        gray_canvas = cv2.cvtColor(canvas, cv2.COLOR_BGR2GRAY)
        _, mask = cv2.threshold(gray_canvas, 1, 255, cv2.THRESH_BINARY)
        mask_inv = cv2.bitwise_not(mask)
        frame_bg = cv2.bitwise_and(frame, frame, mask=mask_inv)
        canvas_fg = cv2.bitwise_and(canvas, canvas, mask=mask)
        output = cv2.add(frame_bg, canvas_fg)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('c'):
            canvas = np.zeros((h, w, 3), dtype=np.uint8)
        elif key == ord('+') or key == ord('='):
            brush_size = min(brush_size + 2, 30)
        elif key == ord('-') or key == ord('_'):
            brush_size = max(brush_size - 2, 2)

        cv2.imshow('Air Canvas', output)

    cap.release()
    cv2.destroyAllWindows()
    print('Air Canvas closed.')


if __name__ == '__main__':
    main()
