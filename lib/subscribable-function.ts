// TODO - Test Class this can be deleted
// export function createSubscribable<MessageType>() {
//   const subscribers: Set<(msg: MessageType) => void> = new Set();
//   return {
//     subscribe(cb: (msg: MessageType) => void): () => void {
//       subscribers.add(cb);
//       return () => {
//         subscribers.delete(cb);
//       };
//     },
//     publish(msg: MessageType): void {
//       subscribers.forEach((cb) => cb(msg));
//     },
//   };
// }

export function createPubSub<
  T extends Record<string, (...args: any[]) => void>
>() {
  const eventMap = {} as Record<keyof T, Set<(...args: any[]) => void>>;

  return {
    emit: <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => {
      (eventMap[event] ?? []).forEach((cb) => cb(...args));
      console.log("Emit", event);
    },

    on: <K extends keyof T>(event: K, callback: T[K]) => {
      if (!eventMap[event]) {
        eventMap[event] = new Set();
      }
      console.log(event);

      eventMap[event].add(callback);
    },

    off: <K extends keyof T>(event: K, callback: T[K]) => {
      if (!eventMap[event]) {
        return;
      }

      eventMap[event].delete(callback);
    },
    showEvents() {
      console.log(eventMap);
    },
  };
}
