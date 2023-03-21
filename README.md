# open-via-menlo

[![Chrome Web Store Release Version](https://img.shields.io/chrome-web-store/v/noipifnjlcnmakealjopkndknloofcka)](https://chrome.google.com/webstore/detail/open-via-menlo/noipifnjlcnmakealjopkndknloofcka)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/sh-cho/open-via-menlo)
[![Chrome Web Store Ratings](https://img.shields.io/chrome-web-store/rating/noipifnjlcnmakealjopkndknloofcka)](https://chrome.google.com/webstore/detail/open-via-menlo/noipifnjlcnmakealjopkndknloofcka)
[![Chrome Web Store Downloads](https://img.shields.io/chrome-web-store/users/noipifnjlcnmakealjopkndknloofcka)](https://chrome.google.com/webstore/detail/open-via-menlo/noipifnjlcnmakealjopkndknloofcka)

---

[![image](https://user-images.githubusercontent.com/11611397/216783062-5f9b5b39-e3d7-48d7-b191-ac1ddc0a325c.png)](https://chrome.google.com/webstore/detail/open-via-menlo/noipifnjlcnmakealjopkndknloofcka)

---

Open links via [Menlo Security](https://safe.menlosecurity.com/).

(Only supports chrome, for now)

> **Note**
>
> Bugs (to-be fixed)
>
> - Badges are not working correctly (only displaying incorrectly).
> To be precise, all open Chrome windows are sharing a single badge.
> - In chrome tabs, extension is not working well (ex. `chrome://extensions`, ...)
> - In general, the code is messy 😞. I'm trying to learn JS

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

And configure editor sdk (<kbd>cmd</kbd>+<kbd>shift</kbd>+<kbd>p</kbd> -> `Select Typescript Version` -> `Use Workspace Version (.yarn/sdks/typescript/lib)`)

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
- [x] opt-out URLs (just like no-proxy)
- [ ] add menlo -> normal page context menu
- [ ] add test
- [ ] multi browser support (-> how to do it automatically?)
  - firefox
  - safari
- [ ] build workflows
- [ ] change dev icon / name
- [ ] neatly print log..

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
