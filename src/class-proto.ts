
export class ClassProto {
  public props;
  public defaults;

  public declareDefaults() {
    this.defaults = {};
  }

  private extendDefaults(o = {}) {
    this.props = {
      ...this.defaults,
      ...o
    }
  }

  public init() {

  }

  constructor(o = {}) {
    this.declareDefaults();
    this.extendDefaults(o);
    this.init();
  }

  public set(o = {}) {
    this.props = {
      ...this.props,
      ...o
    };
  }
}