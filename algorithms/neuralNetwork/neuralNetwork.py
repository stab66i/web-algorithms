import numpy as np

class NeuralNetwork:
    def __init__(self, input_size, hidden_size1, hidden_size2, output_size):
        self.weights_input_hidden1 = np.random.randn(hidden_size1, input_size) * 0.1
        self.bias_hidden1 = np.zeros((hidden_size1, 1))

        self.weights_hidden_hidden2 = np.random.randn(hidden_size2, hidden_size1) * 0.1
        self.bias_hidden2 = np.zeros((hidden_size2, 1))

        self.weights_hidden_output = np.random.randn(output_size, hidden_size2) * 0.1
        self.bias_output = np.zeros((output_size, 1))

    def forward_pass(self, x):
        h1 = self.sigmoid(np.dot(self.weights_input_hidden1, x) + self.bias_hidden1)

        h2 = self.sigmoid(np.dot(self.weights_hidden_hidden2, h1) + self.bias_hidden2)

        output = self.sigmoid(np.dot(self.weights_hidden_output, h2) + self.bias_output)

        return h1, h2, output

    def predict(self, x):
        _, _, output = self.forward_pass(x)
        return output


