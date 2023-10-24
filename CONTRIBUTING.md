## Development

### Pre-requisite

Use vscode and install extensions below (see [`/.vscode/extensions.json`](/.vscode/extensions.json))

- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Install

> **Note**
>
> on Mac

```sh
nvm install
nvm use
```
1. install node (ex. with [nvm](https://github.com/nvm-sh/nvm)(Node Version Manager))

```sh
corepack enable pnpm
```
2. Install(or enable) pnpm (ex. with [Corepack](https://nodejs.org/api/corepack.html))

#### Additional setup
```sh
git config --local blame.ignoreRevsFile .git-blame-ignore-revs
```
Set git blame ignore revs file

```ini
blame.ignorerevsfile=.git-blame-ignore-revs
```
You can check `blame.ignoreRevsFile` config with `git config --list --local`

### Run locally
```sh
pnpm dev
```
run locally.

Go to `chrome://extensions`, select `Load unpacked` and select `./dist` folder.

Refresh manually when updated.

### Build
```sh
pnpm build
```

### Test
```sh
# Unit test with jest
pnpm test
```

### Release

Push a tag with `v` prefix to build (ex. `v1.2.3`)

Build artifact is attached to GitHub Release.

See [release workflow](/.github/workflows/release.yaml)

## references
### chrome api docs
- MV3: https://developer.chrome.com/docs/extensions/mv3/
  - Message passing: https://developer.chrome.com/docs/extensions/mv3/messaging/
- API Reference: https://developer.chrome.com/docs/extensions/reference/
  - chrome.storage: https://developer.chrome.com/docs/extensions/reference/storage/
  - chrome.action: https://developer.chrome.com/docs/extensions/reference/action/

### codes
- react chrome-extension boilerplate: https://github.com/JasonXian/react-chrome-extension-boilerplate
- bitwarden browser extensions: https://github.com/bitwarden/clients/tree/master/apps/browser

### 참고자료
- yarn setup: https://haranglog.tistory.com/28
- chrome extension 개발기: https://80000coding.oopy.io/34a2083b-c159-4524-b5f2-750d3ab4fbba
