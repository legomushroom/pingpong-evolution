import { ClassProto } from './class-proto';

export interface ICanvasClass {
  ctx;
  width: number;
  height: number;
};

export interface ICanvasProps {
  width: number;
  height: number;
  parent;
}

export class Canvas extends ClassProto implements ICanvasClass {
  public ctx;
  public width: number;
  public height: number;

  public declareDefaults() {
    this.defaults = {
      width: 1000,
      height: 500,
      parent: document.body
    };
  }

  public init () {
    const { width, height, parent } = this.props;

    this.width = width;
    this.height = height;

    const canvas = document.createElement('canvas');
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.border = `1px solid #777`;

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    parent.appendChild(canvas);

    this.ctx = canvas.getContext('2d');
  }
}