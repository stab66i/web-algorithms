function sigmoid(x) {
  let matrix = [];
  for (let el of x) {
    matrix.push([1 / (1 + Math.exp(-el[0]))]);
  }
  console.log(matrix);
  return matrix;
}

function softmax(arr) {
  const max = Math.max(...arr);
  const exps = arr.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(x => x / sum);
}

function dot(v1, v2) {
  let res = [];
  for (let i = 0; i < v1.length; i++) {
      res[i] = [];
      for (let j = 0; j < v2[0].length; j++) {
          let sum = 0;
          for (let k = 0; k < v1[0].length; k++) {
              sum += v1[i][k] * v2[k][j];
          }
          res[i][j] = sum;
      }
  }
  return res;
}

function sum(v1, v2) {
  let result = [];
  for (let i = 0; i < v1.length; i++) {
      let row = [];
      for (let j = 0; j < v1[i].length; j++) {
          row.push(v1[i][j] + v2[i][j]);
      }
      result.push(row);
  }
  return result;
}

class NeuralNetwork {
  constructor() {
    this.weights_input_hidden1 = null;
    this.bias_hidden1 = null;
    this.weights_hidden_hidden2 = null;
    this.bias_hidden2 = null;
    this.weights_hidden_output = null;
    this.bias_output = null;
  }

  async loadWeights(filePath) {
    const response = await fetch(filePath);
    const weights = await response.json();
        
    this.weights_input_hidden1 = weights.weights_input_hidden1;
    this.bias_hidden1 = weights.bias_hidden1;
    this.weights_hidden_hidden2 = weights.weights_hidden_hidden2;
    this.bias_hidden2 = weights.bias_hidden2; 
    this.weights_hidden_output = weights.weights_hidden_output;
    this.bias_output = weights.bias_output;
  }

  feedforward(x) {
    let h1 = sigmoid(sum(dot(this.weights_input_hidden1, x), this.bias_hidden1));
    let h2 = sigmoid(sum(dot(this.weights_hidden_hidden2, h1), this.bias_hidden2));
    let output = softmax(sum(dot(this.weights_hidden_output, h2), this.bias_output));

    return output;
  }
}

const nn = new NeuralNetwork();

export async function start(pixels) {
  if (!nn.weights_input_hidden1) {
    await nn.loadWeights("weights.json");
  }
  return nn.feedforward(pixels);
}