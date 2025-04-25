import numpy as np

arrays0 = np.tile([1, 0, 0, 0, 0, 0, 0, 0, 0, 0], (100, 1))
arrays1 = np.tile([0, 1, 0, 0, 0, 0, 0, 0, 0, 0], (100, 1))

Y_train = np.vstack([arrays0, arrays1])

with open('Y_train.txt', 'w') as f:
    f.write(f"{Y_train.tolist()}")
