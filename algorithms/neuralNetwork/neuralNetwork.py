import numpy as np


def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def deriv_sigmoid(x):
    fx = sigmoid(x)
    return fx * (1 - fx)

def mse_loss(y_true, y_pred):
    return ((y_true - y_pred) ** 2).mean() # L = 1/n * сумма (от к = 1 до n) (y_t - y_p) ** 2

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

        return output

    # def train(self, data, all_y_trues):
    #     learn_rate = 0.1
    #     epochs = 1000
    #     for epoch in range(epochs):
    #
