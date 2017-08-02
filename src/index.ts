import { Canvas, ICanvasClass } from './canvas';
import { Ball } from './ball';
import { Bat, IBatClass, SideType as BatSideType } from './bat';
import { randomParameters } from './nn';

const SEPARATOR = '-=-=-=-=-=-=-=-=-=-=-';
const SMALL_SEPARATOR = '---------------------';
const NN_LAYERS = [3, 9, 2];

interface IEvolutionClass {};

class Evolution implements IEvolutionClass {
  private canvas: ICanvasClass;
  private leftBat: Bat;
  private rightBat: Bat;
  private roundActive;
  // FIFO queue
  private batsPool: Bat[];
  private isPlaying: boolean = false;
  private animationFrame;

  private roundNumber: number;
  private roundScore: number;
  private roundScores: number[];

  private championshipNumber: number = 0;
  private championshipScores: number[];

  public constructor() {
    this.canvas = new Canvas();
    this.createInitialRound();
  }

  private createInitialRound () {
    const batOptions = { canvas: this.canvas };

    this.batsPool = [];
    for (let i = 0; i < 10; i++) {
      const leftBat = new Bat({
        ...batOptions,
        side: BatSideType.Left,
        parameters: randomParameters(NN_LAYERS)
      });
      const rightBat = new Bat({
        ...batOptions,
        side: BatSideType.Right,
        parameters: randomParameters(NN_LAYERS)
      });
      this.batsPool.push(leftBat, rightBat);
    }
    this.runBatsQueue();
  }

  private async runBatsQueue() {

    console.log(SEPARATOR);
    console.log('');
    console.log(`> Starting championship # ${this.championshipNumber}`);

    this.roundNumber = 0;
    const winners = [];
    while (this.batsPool.length >= 2) {
      const winner = await this.evaluateRound(this.batsPool[0], this.batsPool[1], performance.now());
      // remove the bats that were playing in bat
      this.batsPool.shift();
      this.batsPool.shift();
      // add the winner bat at the end
      this.batsPool.push(winner);
      console.log(`> Round ${this.roundNumber++} ended - winner with score of ${winner.getScore()}`);
    }

    const winner = this.batsPool.shift();
    
    console.log(`> Champonship # ${this.championshipNumber} ended, score: ${winner.getScore()}, by winner `, winner);

    console.log('');
    console.log(SMALL_SEPARATOR);

    this.batsPool.push(winner, ...this.createNewGemone(winner));
    // this.runBatsQueue();
    console.log(SEPARATOR);
  }

  private createNewGemone (winner: Bat): Bat[] {
    const result = [];
    const MUTATION_RATE = 0.02;
    const ITEMS = 10;

    console.log(`- Creating the new Genome with ${ITEMS} children and mutation rate of ${MUTATION_RATE}`);

    for (let i = 0; i < ITEMS; i++) {
      result.push(winner.createAccessor(MUTATION_RATE));
    }

    return result;
  }

  private evaluateRound(leftBat, rightBat, startTime: number): Promise<Bat> {
    return new Promise((resolve) => {
      const ball = new Ball({
        canvas: this.canvas,
        leftBat,
        rightBat,
        startTime,
        onFail: (side: BatSideType) => {
          this.stop();
          resolve((side === BatSideType.Left) ? this.batsPool[0] : this.batsPool[1]);
        }
      });
      leftBat.set({
        ball,
        startTime,
        side: BatSideType.Left
      });
      rightBat.set({
        ball,
        startTime,
        side: BatSideType.Right
      });

      this.stop();
      this.play(ball, leftBat, rightBat);
    });
  }

  private play = (ball, leftBat, rightBat) => {
    if (this.isPlaying === false) {
      this.isPlaying = true;
      if (ball) {
        this.roundActive = [ball, leftBat, rightBat]
      }
      this.loop();
    }
  }

  private stop() {
    this.isPlaying = false;
    clearTimeout(this.animationFrame);
  }

  private loop = () => {
    if (this.isPlaying === false) { return; }
    this.canvas.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.roundActive.length; i++) {
      this.roundActive[i].tick(performance.now());
    }
    this.animationFrame = setTimeout(this.loop, 1000/20);
  }
}

new Evolution();

