// Broadcast Channel based Event Bridge

import { v4 as uuid } from "uuid";
import type { CommunicationManager, Listener } from "../interface";

class BroadcastChannelBasedMediator implements CommunicationManager {
  broadcastChannelId: string;
  broadcastChannel: BroadcastChannel;

  constructor(name: string) {
    this.broadcastChannelId = name || uuid();
    this.broadcastChannel = new BroadcastChannel(this.broadcastChannelId);
  }

  sendMessage(message: unknown) {
    this.broadcastChannel.postMessage(message);
  }

  onMessage(listener: Listener) {
    this.broadcastChannel.addEventListener("message", listener);
  }

  removeListener(listener: Listener) {
    this.broadcastChannel.removeEventListener("message", listener);
  }

  close() {
    this.broadcastChannel.close();
  }
}

export default BroadcastChannelBasedMediator;
