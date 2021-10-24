export const isBrowserEnv = () => !window.invokeNative;

export const mockNuiMessage = (data) =>
  window.dispatchEvent(
    new MessageEvent("message", {
      data,
    })
  );
