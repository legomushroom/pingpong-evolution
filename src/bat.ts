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
  speed: number;
  front: number;
  fitness: number;
  distance: number;
  hits: number;
}

export interface IBatClass {
  createAccessor: (mutationRate: number) => Bat;
  getFitness: () => number;
}

export class Bat extends ClassProto implements IBatClass{
  public nn: NeuralNetwork;
  
  public declareDefaults() {
    const defaults: IBatProps = {
      side: SideType.Left,
      top: 105,
      height: 100,
      speed: 5,
      canvas: null,
      ball: null,
      parameters: [],
      front: 4,
      fitness: 0,
      distance: 0,
      hits: 0
    };

    this.defaults = defaults;
  }

  public init() {
    const { parameters, side, canvas } = this.props;
    this.nn = new NeuralNetwork({ parameters });

    this.props.front = (side === SideType.Left) ? BAT_WIDTH : canvas.width - BAT_WIDTH;
  }

  public blame() {
    this.props.hits - 2;
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

    const currentTop = top;

    const newTop = (activation === NeuralNetworkActivationType.Top)
      ? Math.max(0, top - speed)
      : Math.min(canvas.height, top + height + speed) - height;

    this.props.top = newTop;
    this.props.distance += Math.abs(currentTop - newTop);

    this.render();
  }

  public hit() {
    this.props.hits++;
  }

  private getFeatures = (ball: Ball) => {
    let feature1 = ball.props.angle / 180;
    
    // invert angle by x value for right bat to keep angle the same for both sides
    if (this.props.side === SideType.Right) {
      feature1 = -feature1;
    }

    const feature2 = this.props.top / this.props.canvas.height;

    const dX = this.props.front - ball.props.x;
    const dY = (this.props.top + (this.props.height / 2)) - ball.props.y;
    const maxNorm = Math.sqrt((this.props.canvas.height ** 2) + (this.props.canvas.width ** 2));
    const feature3 = Math.sqrt((dX ** 2) + (dY ** 2)) / maxNorm;

    const feature4 = this.props.canvas.height / (this.props.ball.y - (this.props.top + (this.props.height / 2)));

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

  public getFitness() { return (this.props.distance / 200) + this.props.hits; }
  public getParameters() { return this.nn.getParameters(); }

  public mate (bat: Bat, mutationRate: number) {
    const newParameters = this.nn.mate(bat.nn, mutationRate, this.getFitness(), bat.getFitness());

    return new Bat({
      canvas: this.props.canvas,
      parameters: newParameters
    });
  }

  public createAccessor(mutationRate) {
    return new Bat({
      ...this.props,
      parameters: this.nn.createSuccessor(mutationRate)
    });
  }

  public clone() {
    return new Bat({
      canvas: this.props.canvas,
      parameters: this.props.parameters
    });
  }

  private cteateChildParameters(params) {
    // code to mutate params
  }

  public constructor(o: Partial<IBatProps> = {}) { super(o); }
}