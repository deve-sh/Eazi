# Mediator

An efficient and lightweight messaging library for your front-end. **Works magic for messages across tabs and windows**!

- Enables cross-tab and cross-window communication for a website.
- Enables decoupled message-based communication in the same tab across components that are kept several levels apart in the UI.

```bash
npm i --save mediator
```

Let's see how you can simplify something like logging a user out from all tabs when they sign out from one tab.

Simply create Mediator channels:

```js
import { Mediator } from "mediator";

const channelInOneTab = new Mediator("auth-state");

const channelInAllOtherTabs = new Mediator("auth-state");
```

```js
channelInAllOtherTabs.addMessageListener((data) => {
	if (data.action === "logout") logoutUserFromThisTabToo();
});

// Dispatch an event from first tab to all other tabs
channelInOneTab.sendMessage({ action: "logout" });
```

Note: **Messages sent from a channel do not invoke the listeners for the instance that sent the message**
