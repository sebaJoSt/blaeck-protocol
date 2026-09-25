<picture>
  <source media="(prefers-color-scheme: dark)" srcset="static/img/blaeckProtocol-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="static/img/blaeckProtocol-light.svg">
  <img src="static/img/blaeckProtocol-light.svg" alt="Blaeck Protocol" height="75">
</picture>

---

Binary protocol specification for the Blaeck ecosystem — [blaeck](https://github.com/sebaJoSt/blaeck) (from 7.0.0; it unifies [BlaeckSerial](https://github.com/sebaJoSt/BlaeckSerial) and [BlaeckTCP](https://github.com/sebaJoSt/BlaeckTCP), which end at 6.0.0), and [blaecktcpy](https://github.com/sebaJoSt/blaecktcpy).

**Live site:** https://sebajost.github.io/blaeck-protocol/

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
