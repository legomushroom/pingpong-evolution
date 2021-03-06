import { ClassProto } from './class-proto';
import { IFeatures } from './common-interfaces';

export enum NeuralNetworkActivationType {
  Top,
  Bottom
};

interface INeuralNetworkProps {
  parameters;
}

export interface INeuralNetworkClass {
  createSuccessor: (mutationRate) => void;
  getActivations: (features: IFeatures) => NeuralNetworkActivationType;
}

const arrayCopy = (array = []) => {
  if (!(array instanceof Array)) { return array; }
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result[i]= arrayCopy(array[i]);
  }

  return result;
};

export class NeuralNetwork extends ClassProto implements INeuralNetworkClass {
  public declareDefaults() {
    const defaults: INeuralNetworkProps = {
      parameters: []
    };
    this.defaults = defaults;
  }

  public getActivations(features: IFeatures) {
    const { parameters } = this.props;

    const params1 = parameters[0];
    const biasParams1 = new Array(params1[0].length).fill(1);
    let a1 = sigmoidAll(multiply(features, [ biasParams1, ...params1 ]));

    const params2 = parameters[1];
    const biasParams2 = new Array(params2[0].length).fill(1);
    const biasA1 = [[ 1, ...a1[0] ]];
    const a2 = multiply(biasA1, [ biasParams2, ...params2 ]);
    const result = a2[0];

    // calculate activation units and return the max value
    return result[0] > result[1] ? NeuralNetworkActivationType.Top : NeuralNetworkActivationType.Bottom;
  }

  public createSuccessor(mutationRate) {}

  public getParameters() {
    return this.props.parameters;
  }

  public mate(nn: NeuralNetwork, mutationRate: number, fitness1: number, fitness2: number) {
    const params1 = this.props.parameters;
    const params2 = nn.getParameters();
    const resultParams = arrayCopy(params1);

    const rate = fitness1 / (fitness1 + fitness2);
    // console.log(`fitness1: ${fitness1}, fitness2: ${fitness2}, probability of 2: ${1 - rate}`);

    for (let k = 0; k < params2.length; k++) {
      const layer = params2[k];
      for (let i = 0; i < layer.length; i++) {
        const row = layer[i];
        for (let j = 0; j < row.length; j++) {
          if (Math.random() > rate) {
            resultParams[k][i][j] = row[j];
          }
          if (Math.random() <= mutationRate) {
            // console.log(`> mutation occurred`);
            resultParams[k][i][j] = (6 * Math.random()) - 3;
          }
        }
      }
    }

    return resultParams;
  }

  public constructor(o: Partial<INeuralNetworkProps> = {}) { super(o); }
}

const sigmoidSingle = (z) => {
  return 1 / (1 + Math.exp(-z));
};

const sigmoidAll = (m) => {
  for (let i = 0; i < m.length; i++) {
    const item = m[i];
    if (item instanceof Array) {
       m[i] = sigmoidAll(item);
    } else {
       m[i] = sigmoidSingle(item);
    }
  }

  return m;
}

const multiply = (m1, m2) => {
  const m1_size1 = m1.length;
  const m1_size2 = m1[0].length;
  
  const m2_size1 = m2.length;
  const m2_size2 = m2[0].length;

  const resultRow = new Array(m2_size2).fill(0);
  const result = new Array(m1_size1).fill(resultRow);
  
  for (let i = 0; i < result[0].length; i++) {
    result[0][i] = vecMatrixMul(m1[0], m2, i);
  }

  return result;
};

const vecMatrixMul = (vec, matrix, index) => {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * matrix[i][index];
  }

  return sum;
};

const randomMatrix = (m, n) => {
  const matrix = [];
  for (let i = 0; i < m; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      matrix[i][j] = (6 * Math.random()) - 3;
    }
  }

  return matrix;
}

export const randomParameters = (layers) => {
  const parameters = [];

  for (let i = 1; i < layers.length; i++) {
    const layer = layers[i];
    const prevLayer = layers[i-1];
    parameters.push(randomMatrix(prevLayer, layer));
  }

  return parameters;
};
