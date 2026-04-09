// Simple unique ID generator that works in React Native without crypto polyfills
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  const randomPart2 = Math.random().toString(36).substring(2, 6);
  return `${timestamp}-${randomPart}-${randomPart2}`;
};
