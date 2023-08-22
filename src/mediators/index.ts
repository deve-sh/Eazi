import BroadcastChannelBasedMediator from "./broadcast-channel";

class Mediator {
  mediator: BroadcastChannelBasedMediator;

  constructor(name: string) {
    this.mediator = new BroadcastChannelBasedMediator(name);
  }
}

export default Mediator;
