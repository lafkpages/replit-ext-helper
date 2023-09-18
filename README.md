# Replit extensions helper

A helper utility for browser extensions and userscripts.

Note: not for [Replit extensions](https://docs.replit.com/extensions).

## API

A global `replitExtHelper` object is exposed. It's an object with the following properties:

```ts
interface ReplitExtHelper {
  main: () => void;
  debug: boolean;
}
```
