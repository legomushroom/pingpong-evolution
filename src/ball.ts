import { ClassProto } from './class-proto';
import { ICanvasClass } from './canvas';
import { getRadialPoint } from './helpers/get-radial-point';
import { IBatClass, SideType as BatSideType } from './bat';
import { getIntersection } from './helpers/get-lines-intersection';

export interface IBallClass {};

export interface IBallProps {
  angle: number;
  speed: number;
  radius: number;
  x: number;
  y: number;
  canvas: ICanvasClass;
  onFail: () => void;
  leftBat: IBatClass;
  rightBat: IBatClass;
};

export class Ball extends ClassProto implements IBallClass {
  public declareDefaults() {
    this.defaults = {
      angle: 0,
      speed: 6,
      radius: 3,
      x: 0,
      y: 0,
      canvas: null,
      onFail() {},
      leftBat: null,
      rightBat: null
    };
  }

  public init() {
    const { canvas } = this.props;

    this.props.x = canvas.width / 2;
    this.props.y = canvas.height / 2;
    const coef = Math.random() <= .5 ? 1 : -1;
    this.props.angle = coef * parseInt(`${(90 * Math.random()) + 45}`, 10);
  }

  public tick() {
    const { x, y, speed, angle, radius } = this.props;
    const newPoint = getRadialPoint(x, y, speed, angle);
    let isVerticalBound = false;
    let isBat = false;

    const topBoundIntersection = this.checkVerticalBound(newPoint, 'top');
    if (topBoundIntersection != void 0) {
      this.props.x = topBoundIntersection.x;
      this.props.y = topBoundIntersection.y;
      this.props.angle = topBoundIntersection.angle || 1;
      newPoint.x = this.props.x;
      newPoint.y = this.props.y;
      isVerticalBound = true;
    }

    const bottomBoundIntersection = this.checkVerticalBound(newPoint, 'bottom');
    if (bottomBoundIntersection != void 0 && !isVerticalBound) {
      this.props.x = bottomBoundIntersection.x;
      this.props.y = bottomBoundIntersection.y;
      this.props.angle = bottomBoundIntersection.angle || 1;
      newPoint.x = this.props.x;
      newPoint.y = this.props.y;
      isVerticalBound = true;
    }

    const leftBatIntersection = this.checkBat(newPoint, 'left');
    if (leftBatIntersection != void 0) {
      this.props.x = leftBatIntersection.x;
      this.props.y = leftBatIntersection.y;
      this.props.angle = leftBatIntersection.angle + (10 * Math.random() - 5);
      this.props.leftBat.hit();
      isBat = true;
    }

    const rightBatIntersection = this.checkBat(newPoint, 'right');
    if (rightBatIntersection != void 0 && !isBat) {
      this.props.x = rightBatIntersection.x;
      this.props.y = rightBatIntersection.y;
      this.props.angle = rightBatIntersection.angle + (10 * Math.random() - 5);
      this.props.rightBat.hit();
      isBat = true;
    }

    const isLeftBound = this.checkLeftBound(newPoint);
    const isRightBound = this.checkRightBound(newPoint);
    if (!isLeftBound && !isRightBound && !isVerticalBound && !isBat) {
      this.props.x = newPoint.x;
      this.props.y = newPoint.y;
    }

    this.render();
  }

  private checkVerticalBound(newPoint, side) {
    const { canvas, radius, angle, x, y, speed } = this.props;

    const isIntersects = (side === 'top')
      ? newPoint.y <= 0
      : newPoint.y >= canvas.height;

    const boundLine = (side === 'top')
      ? [0, 0, canvas.width, 0]
      : [0, canvas.height, canvas.width, canvas.height];

    if (isIntersects) {
      const result = getIntersection(
        boundLine[0], boundLine[1], boundLine[2], boundLine[3],
        x, y, newPoint.x, newPoint.y
      );

      if (result) {
        const newRadius = Math.sqrt(Math.pow(x - result.x, 2) + Math.pow(y - result.y, 2) );
        const newPoint = getRadialPoint(x, y, newRadius, angle);

        const newAngle = (angle > 0) ? 180 - angle : -180 - angle;

        return {
          ...getRadialPoint(
            newPoint.x,
            newPoint.y,
            Math.min(Math.abs(speed - newRadius), radius),
            newAngle
          ),
          angle: newAngle
        };
      }
    }
  }

  private checkBat(point, side) {
    const { leftBat, rightBat, radius, angle, x, y, speed } = this.props;

    const bat = (side === 'left') ? leftBat : rightBat;
    const isIntersects = (side === 'left') ? point.x <= bat.props.front : point.x >= bat.props.front;

    const isBatTop = (point.y - radius) >= bat.props.top;
    const isBatBottom = (point.y + radius) <= bat.props.top + bat.props.height;
    if (isBatTop && isBatBottom) {
      if (isIntersects) {
        const result = getIntersection(
          x, y, point.x, point.y,
          bat.props.front, bat.props.top, bat.props.front, bat.props.top + bat.props.height,
        );

        if (result !== false) {
          const newRadius = Math.sqrt(Math.pow(x - result.x, 2) + Math.pow(y - result.y, 2));
          const newPoint = getRadialPoint(x, y, newRadius, angle);
          const newAngle = -angle;

          return {
            ...getRadialPoint(
              newPoint.x,
              newPoint.y,
              Math.min(Math.abs(speed - newRadius), radius),
              newAngle
            ),
            angle: newAngle
          };
        }
      }
    }
  }

  private checkLeftBound(newPoint) {
    const { radius, leftBat } = this.props;

    if (newPoint.x <= 0) {
      leftBat.blame();
      this.props.onFail(BatSideType.Left);
      return true;
    }
  }

  private checkRightBound(newPoint) {
    const { canvas, rightBat } = this.props;
    if (newPoint.x >= canvas.width) {
      rightBat.blame();
      this.props.onFail(BatSideType.Right);
      return true;
    }
  }

  private render() {
    const { canvas, x, y, radius, angle } = this.props;

    // console.log(angle, -angle);

    canvas.ctx.beginPath();
    canvas.ctx.arc(x, y, radius, 0, 2 * Math.PI, true); 
    canvas.ctx.closePath();
    canvas.ctx.fillStyle = 'cyan';
    canvas.ctx.fill();
  }
}