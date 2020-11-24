import sys
import cv2
import numpy as np
#import matplotlib.pyplot as plt

# green color rangle
lower_green = np.array([60 - 15, 100, 100])
upper_green = np.array([60 + 15, 255, 255])

img = cv2.imread("/home/ubuntu/HydroGrow/uploads/" + sys.argv[1])

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
#        print('The number of green pixels is: ' + str(green))
        a.append(green)
#             print(str(green))
#             sys.stdout.flush()

  #      cv2.imshow("x = \{0\}, y = \{1\}".format(x,y),part)
  #      cv2.imshow("eq_img",eq_img)
  #      cv2.waitKey(0)
    #    plt.subplot(1, 6, 1)
   #     plt.imshow(mask, cmap="gray")
  #      plt.subplot(1, 6, 2)
 #       plt.imshow(part)
#        plt.show()}
print(*a)
sys.stdout.flush()
