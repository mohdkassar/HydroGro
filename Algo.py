import sys
import cv2
import numpy as np
#import matplotlib.pyplot as plt

# green color rangle
lower_green = np.array([60 - 22, 100, 100])
upper_green = np.array([60 + 22, 255, 255])

#img = cv2.imread("/home/ubuntu/HydroGrow/uploads/" + sys.argv[1])

req = urllib.request.urlopen(sys.argv[1])
arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
img = cv2.imdecode(arr, -1)

hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

(h, w, c) = img.shape

parts = []
step_x = 2
step_y = 3
eqs = []
eq_img = np.zeros_like(hsv)
a = []

for x in range(step_x):
    for y in range(step_y):
        xratio1 = x / step_x
        xratio2 = (x + 1) / step_x
        yratio1 = y / step_y
        yratio2 = (y + 1) / step_y
        part = hsv[int(yratio1 * h):int(yratio2 * h),
                   int(xratio1 * w):int(xratio2 * w)].copy()
        parts.append(part)

        mask = cv2.inRange(part, lower_green, upper_green)
        result = cv2.bitwise_and(part, part, mask=mask)

        green = cv2.countNonZero(mask)
        a.append(green)
print(*a)
sys.stdout.flush()

