import numpy as np


def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def deriv_sigmoid(x):
    return x * (1 - x)

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

    def train(self):
        learn_rate = 0.1
        epochs = 100000
        for epoch in range(epochs):
            total_loss = 0
            for i in range(len(X_train)):
                x = X_train[i]
                y_true = Y_train[i]

                h1_out, h2_out, y_pred = self.feedforward(x)

                delta_output = (y_pred - y_true) * deriv_sigmoid(y_pred)
                delta_hidden2 = np.dot(self.weights_hidden_output, delta_output) * deriv_sigmoid(h2_out)
                delta_hidden1 = np.dot(self.weights_hidden_hidden2, delta_hidden2) * deriv_sigmoid(h1_out)

                self.weights_hidden_output -= learn_rate * np.dot(delta_output, h2_out)
                self.weights_hidden_hidden2 -= learn_rate * np.dot(delta_hidden2, h1_out)
                self.weights_input_hidden1 -= learn_rate * np.dot(delta_hidden1, x)

                self.bias_output -= learn_rate * delta_output
                self.bias_hidden2 -= learn_rate * delta_hidden2
                self.bias_hidden1 -= learn_rate * delta_hidden1

                total_loss += ((y_pred - y_true) ** 2).mean()

            total_loss /= len(X_train)

            if epoch % 100 == 0:
                print(f"Эпоха {epoch}, Ошибка: {total_loss}")





X_train = np.array([
    [],
    [],
])


Y_train = np.array([
    [1, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0],
    [],
])