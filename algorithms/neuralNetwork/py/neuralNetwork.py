import json
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle
import numpy as np


def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def deriv_sigmoid(x):
    return x * (1 - x)

def softmax(x):
    exp_x = np.exp(x - np.max(x))
    return exp_x / np.sum(exp_x, axis=0, keepdims=True)

def save_weights_to_json(nn):
    weights = {
        'weights_input_hidden1': nn.weights_input_hidden1.tolist(),
        'bias_hidden1': nn.bias_hidden1.tolist(),

        'weights_hidden_hidden2': nn.weights_hidden_hidden2.tolist(),
        'bias_hidden2': nn.bias_hidden2.tolist(),

        'weights_hidden_output': nn.weights_hidden_output.tolist(),
        'bias_output': nn.bias_output.tolist()
    }

    with open('weights.json', 'w') as f:
        json.dump(weights, f)

class NeuralNetwork:
    def __init__(self, input_size, hidden_size1, hidden_size2, output_size):
        self.weights_input_hidden1 = np.random.randn(hidden_size1, input_size) * 0.1
        self.bias_hidden1 = np.zeros((hidden_size1, 1))

        self.weights_hidden_hidden2 = np.random.randn(hidden_size2, hidden_size1) * 0.1
        self.bias_hidden2 = np.zeros((hidden_size2, 1))

        self.weights_hidden_output = np.random.randn(output_size, hidden_size2) * 0.1
        self.bias_output = np.zeros((output_size, 1))

    def feedforward(self, x):
        h1 = sigmoid(np.dot(self.weights_input_hidden1, x) + self.bias_hidden1)

        h2 = sigmoid(np.dot(self.weights_hidden_hidden2, h1) + self.bias_hidden2)

        output = softmax(np.dot(self.weights_hidden_output, h2) + self.bias_output)

        return h1, h2, output

    def train(self, X_train, X_test, Y_train, Y_test, learn_rate, epochs):
        for epoch in range(epochs):
            X_train, Y_train = shuffle(X_train, Y_train)
            total_loss = 0
            for i in range(len(X_train)):
                x = X_train[i].reshape(-1, 1)
                y_true = Y_train[i].reshape(-1, 1)

                h1_out, h2_out, y_pred = self.feedforward(x)

                loss = self.compute_loss(y_pred, y_true)
                total_loss += loss

                delta_output = y_pred - y_true
                delta_hidden2 = np.dot(self.weights_hidden_output.T, delta_output) * deriv_sigmoid(h2_out)
                delta_hidden1 = np.dot(self.weights_hidden_hidden2.T, delta_hidden2) * deriv_sigmoid(h1_out)

                self.weights_hidden_output -= learn_rate * np.dot(delta_output, h2_out.T)
                self.weights_hidden_hidden2 -= learn_rate * np.dot(delta_hidden2, h1_out.T)
                self.weights_input_hidden1 -= learn_rate * np.dot(delta_hidden1, x.T)

                self.bias_output -= learn_rate * delta_output
                self.bias_hidden2 -= learn_rate * delta_hidden2
                self.bias_hidden1 -= learn_rate * delta_hidden1

            avg_loss = total_loss / len(X_train)
            test_accuracy = self.evaluate(X_test, Y_test)

            print(f"Эпоха {epoch} | Loss: {avg_loss:.4f} | Точность: {test_accuracy * 100:.2f}%")

    def evaluate(self, X_test, Y_test):
        correct = 0
        total = len(X_test)
        for i in range(total):
            x =  X_test[i].reshape(-1, 1)
            y_true = Y_test[i]

            _, _, y_pred = self.feedforward(x)
            predicted_label = np.argmax(y_pred)
            true_label = np.argmax(y_true)

            if predicted_label == true_label:
                correct += 1

        accuracy = correct / total
        print(f"Точность: {accuracy * 100:.2f}%")
        return accuracy

    def compute_loss(self, y_pred, y_true):
        return -np.sum(y_true * np.log(y_pred + 1e-8))


#кроссэнтропию добавить, перемешать данные

def load_data(file_path):
    with open(file_path, 'r') as file:
        arrays = eval(file.read())
    return np.array(arrays)

X = load_data('X_train.txt')
Y = load_data('Y_train.txt')

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

print("Размер тренировочных данных X_train:", X_train.shape)
print("Размер тестовых данных X_test:", X_test.shape)

nn = NeuralNetwork(input_size=2500, hidden_size1=128, hidden_size2=64, output_size=10)
nn.train(X_train, X_test, Y_train, Y_test, learn_rate=0.01, epochs=10000)
save_weights_to_json(nn)
