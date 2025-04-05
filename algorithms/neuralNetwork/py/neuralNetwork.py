import json

import numpy as np


def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def deriv_sigmoid(x):
    return x * (1 - x)


def save_weights_to_json(nn, file_prefix):
    weights = {
        'weights_input_hidden1': nn.weights_input_hidden1.tolist(),
        'bias_hidden1': nn.bias_hidden1.tolist(),

        'weights_hidden_hidden2': nn.weights_hidden_hidden2.tolist(),
        'bias_hidden2': nn.bias_hidden2.tolist(),

        'weights_hidden_output': nn.weights_hidden_output.tolist(),
        'bias_output': nn.bias_output.tolist()
    }

    with open(f'{file_prefix}_weights.json', 'w') as f:
        json.dump(weights, f)


# def mse_loss(y_true, y_pred):
#     return ((y_true - y_pred) ** 2).mean() # L = 1/n * сумма (от к = 1 до n) (y_t - y_p) ** 2

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

        output = sigmoid(np.dot(self.weights_hidden_output, h2) + self.bias_output)

        return h1, h2, output

    def train(self, X_train, Y_train):
        learn_rate = 0.1
        epochs = 100000
        for epoch in range(epochs):
            total_loss = 0
            for i in range(len(X_train)):
                x = X_train[i].reshape(-1, 1)
                y_true = Y_train[i].reshape(-1, 1)

                h1_out, h2_out, y_pred = self.feedforward(x)

                delta_output = (y_pred - y_true) * deriv_sigmoid(y_pred)
                delta_hidden2 = np.dot(self.weights_hidden_output.T, delta_output) * deriv_sigmoid(h2_out)
                delta_hidden1 = np.dot(self.weights_hidden_hidden2.T, delta_hidden2) * deriv_sigmoid(h1_out)

                self.weights_hidden_output -= learn_rate * np.dot(delta_output, h2_out.T)
                self.weights_hidden_hidden2 -= learn_rate * np.dot(delta_hidden2, h1_out.T)
                self.weights_input_hidden1 -= learn_rate * np.dot(delta_hidden1, x.T)

                self.bias_output -= learn_rate * delta_output
                self.bias_hidden2 -= learn_rate * delta_hidden2
                self.bias_hidden1 -= learn_rate * delta_hidden1

                total_loss += ((y_pred - y_true) ** 2).mean()

            total_loss /= len(X_train)

            if epoch % 100 == 0:
                print(f"Эпоха {epoch}, Ошибка: {total_loss}")


def load_data(file_path):
    with open(file_path, 'r') as file:
        arrays = eval(file.read())
    return np.array(arrays)

X_train = load_data('../X_train.txt')
Y_train = load_data('../Y_train.txt')

print(X_train.shape)
print(Y_train.shape)

nn = NeuralNetwork(input_size=X_train.shape[1], hidden_size1=5, hidden_size2=5, output_size=Y_train.shape[1])
nn.train(X_train, Y_train)
save_weights_to_json(nn, 'weights')
