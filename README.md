# open-via-menlo

[![image](https://user-images.githubusercontent.com/11611397/216783062-5f9b5b39-e3d7-48d7-b191-ac1ddc0a325c.png)](https://chrome.google.com/webstore/detail/open-via-menlo/noipifnjlcnmakealjopkndknloofcka)

Open links via [Menlo Security](https://safe.menlosecurity.com/).

(Only supports chrome, for now)

## Development
### Install

```sh
brew install yarn
```
install yarn (with brew or npm)

```sh
yarn install
```
Setup

```sh
yarn dlx @yarnpkg/sdks vscode
```
Install [zipfs](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs) vscode extension

And configure editor sdk (<kbd>cmd</kbd>+<kbd>shift</kbd>+<kbd>p</kbd> -> `Use Workspace Version (.yarn/sdks/typescript/lib)`)

```sh
yarn plugin import typescript
```
Install [yarn typescript plugin](https://github.com/yarnpkg/berry/tree/master/packages/plugin-typescript)

### Run locally
```
yarn start
```
run locally.

Go to `chrome://extensions`, select `Load unpacked` and select `./dist` folder.

Refresh manually when updated.

### Build prod
```
yarn build
```

TODO: build workflow

## Todo
- [x] use [chrome-types](https://www.npmjs.com/package/chrome-types)
- [x] auto-redirect all links
- [x] change icons based on on/off setting
- [ ] opt-out URLs (just like no-proxy)
- [ ] add menlo -> normal page context menu
- [ ] add test
- [ ] multi browser support
  - firefox
  - safari
- [ ] build workflows
- [ ] change dev icon / name

### references
#### api docs
- MV3: https://developer.chrome.com/docs/extensions/mv3/
  - Message passing: https://developer.chrome.com/docs/extensions/mv3/messaging/
- API Reference: https://developer.chrome.com/docs/extensions/reference/
  - chrome.storage: https://developer.chrome.com/docs/extensions/reference/storage/
  - chrome.action: https://developer.chrome.com/docs/extensions/reference/action/

#### codes
- react chrome-extension boilerplate: https://github.com/JasonXian/react-chrome-extension-boilerplate
- bitwarden browser extensions: https://github.com/bitwarden/clients/tree/master/apps/browser

#### 참고자료
- yarn setup: https://haranglog.tistory.com/28
- chrome extension 개발기: https://80000coding.oopy.io/34a2083b-c159-4524-b5f2-750d3ab4fbba
