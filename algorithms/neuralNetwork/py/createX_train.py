import os


arrays = []
folder_path = 'dataset/нули'
for filename in os.listdir(folder_path):
    file_path = os.path.join(folder_path, filename)

    if os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            array = eval(file.read())
            arrays.append(array)
folder_path = 'dataset/единицы'
for filename in os.listdir(folder_path):
    file_path = os.path.join(folder_path, filename)

    if os.path.isfile(file_path):
        with open(file_path, 'r') as file:
            array = eval(file.read())
            arrays.append(array)

with open('X_train.txt', 'w') as f:
    f.write(f"{arrays}")