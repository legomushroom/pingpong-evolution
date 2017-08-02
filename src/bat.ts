import { ClassProto } from './class-proto';
import { ICanvasClass } from './canvas';
import { IBallClass, Ball } from './ball';
import { INeuralNetworkClass, NeuralNetwork, NeuralNetworkActivationType } from './nn';

export enum SideType {
  Left,
  Right
}

const BAT_WIDTH = 4;
const BAT_COLOR = '#333';

interface IBatProps {
  side: SideType;
  top: number;
  height: number;
  canvas: ICanvasClass;
  ball: IBallClass;
  parameters;
  score: number;
  speed: number;
  front: number;
}

export interface IBatClass {
  createAccessor: (mutationRate: number) => Bat;
  getScore: () => number;
}

export class Bat extends ClassProto implements IBatClass{
  private nn: NeuralNetwork;
  
  public declareDefaults() {
    const defaults: IBatProps = {
      side: SideType.Left,
      top: 105,
      height: 50,
      speed: 5,
      canvas: null,
      ball: null,
      parameters: [],
      score: 0,
      front: 4
    };

    this.defaults = defaults;
  }

  public init() {
    const { parameters, side, canvas } = this.props;
    this.nn = new NeuralNetwork({ parameters });

    this.props.front = (side === SideType.Left) ? BAT_WIDTH : canvas.width - BAT_WIDTH;
  }

  public set(o) {
    super.set(o);
    const { side, canvas } = this.props;

    this.props.front = (side === SideType.Left) ? BAT_WIDTH : canvas.width - BAT_WIDTH;
  }

  public tick() {
    const { top, canvas, height, speed } = this.props;

    const features = this.getFeatures(this.props.ball);
    const activation = this.nn.getActivations(features);

    if (activation === NeuralNetworkActivationType.Top) {
      this.props.top = Math.max(0, top - speed);
    } else {
      this.props.top = Math.min(canvas.height, top + height + speed) - height;
    }

    this.render();
  }

  private getFeatures = (ball: Ball) => {
    const feature1 = ball.props.angle / 180;
    const feature2 = this.props.top / this.props.canvas.height;

    const dX = this.props.front - ball.props.x;
    const dY = (this.props.top + (this.props.height / 2)) - ball.props.y;
    const maxNorm = Math.sqrt((this.props.canvas.height ** 2) + (this.props.canvas.width ** 2));
    const feature3 = Math.sqrt((dX ** 2) + (dY ** 2)) / maxNorm;

    return [[1, feature1, feature2, feature3]];
  }

  private render() {
    const { side, canvas, top, height } = this.props;

    canvas.ctx.fillStyle = BAT_COLOR;
    if (side === SideType.Left) {
      canvas.ctx.fillRect(0, top, BAT_WIDTH, height);
    } else {
      canvas.ctx.fillRect(canvas.width - BAT_WIDTH, top, canvas.width, height);
    }
  }

  public getScore() { return this.props.score; }

  public createAccessor(mutationRate) {
    return new Bat({
      ...this.props,
      parameters: this.nn.createSuccessor(mutationRate)
    });
  }

  private cteateChildParameters(params) {
    // code to mutate params
  }

  public constructor(o: Partial<IBatProps> = {}) { super(o); }
}