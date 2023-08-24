# Eazi

An efficient and lightweight messaging library for your front-end.

### Introduction

Ever wanted to have a way to keep all your tab's states in sync with minimal effort? (Or) Wanted a lightweight option to communicate between frontend components kept way apart from each other in the application architecture without using a bulky state-management solution?

Well, you can do both so with Eazi.

### Some other advantages

- Lightweight (4 Kb minified)
- Uses the `BroadcastChannel` API by default. Falls back to automatically select browser storage events vs `BroadcastChannel` if not available.
- Fully Typed and has a clean interface.

### Installing

```bash
npm i --save eazi
```

### An Example

Let's see how you can simplify something like logging a user out from all tabs when they sign out from one tab.

Simply create channels:

```js
import { Channel } from "eazi";

const channelInOneTab = new Channel("auth-state");

const channelInAllOtherTabs = new Channel("auth-state");
```

```js
channelInAllOtherTabs.addMessageListener((eventData) => {
	if (eventData.action === "logout") logoutUserFromThisTabToo();
});

// Dispatch an event from first tab to all other tabs
channelInOneTab.sendMessage({ action: "logout" });
```

Note: **Messages sent from a channel do not invoke the listeners for the instance that sent the message**

### Storage based events channel

Simple use the second argument of the `Channel` constructor to pass a `strategy` option and set it to `storage`.

Note: **Events passed via storage events should be serializable. I.E: Functions and circular references wouldn't work.**

```js
const storageBasedEventChannel = new Channel("user-info-updates", {
	strategy: "storage",
});
```

### Simple Channel

Use this for when you don't need cross-tab/cross-window events but rather communication in the same tab.

```js
const noCrossTabCommChannel = new Channel("same-tab-pings", {
	strategy: "simple",
});
```

### Usage with React

If you're using React, you don't have to worry about the lifecycle, we have the `useChannel` hook for that.

The hook takes care of unmounting message listeners and closing connections to open channels on unmounting.

It supports the same `strategy` options as its second argument as the regular `Channel` constructor.

```jsx
import { useChannel } from 'eazi/react';

const Component = () => {
	const channel = useChannel("app-wide-events");

	useEffect(() => {
		channel.addMessageListener(eventData => {
			...
		})
	}, []);

	...
}
```