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
> Bugs on v1.1 (to-be fixed)
>
> - Badges are not working correctly (only displaying incorrectly).
> To be precise, all open Chrome windows are sharing a single badge.
> - In chrome tabs, extension is not working well (ex. `chrome://extensions`, ...)
> - In general, the code is messy 😞. I'm trying to learn JS

## How to use

(TBD)

## Development

### Pre-requisite

Use vscode and install extensions below (see [`/.vscode/extensions.json`](/.vscode/extensions.json))

- [zipfs](https://marketplace.visualstudio.com/items?itemName=arcanis.vscode-zipfs)
- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Install

```sh
brew install yarn
```
1. install yarn (with brew or npm)

```sh
yarn install
```
(You don't have to do this, because this project is using yarn berry zero-install)

```sh
yarn dlx @yarnpkg/sdks vscode
```
(check this: https://yarnpkg.com/getting-started/editor-sdks)

2. Generate editor SDK for vscode.

And configure editor sdk
- (1) Open command palette with <kbd>⌘ cmd</kbd> + <kbd>⇧ shift</kbd> + <kbd>p</kbd> (Windows: <kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>p</kbd>)
- (2) `Select Typescript Version`
- (3) `Use Workspace Version (.yarn/sdks/typescript/lib)`

```sh
yarn plugin import typescript
```
3. Install [yarn typescript plugin](https://github.com/yarnpkg/berry/tree/master/packages/plugin-typescript)

#### Additional setup
```sh
git config --local blame.ignoreRevsFile .git-blame-ignore-revs
```
Set git blame ignore revs file

```
blame.ignorerevsfile=.git-blame-ignore-revs
```
You can check `blame.ignoreRevsFile` config with `git config --list --local`

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
- [ ] add menlo -> normal page context menu
- [ ] add test
- [ ] multi browser support (-> how to do it automatically?)
  - firefox
  - safari
- [ ] build workflows
- [ ] change dev icon / name
- [ ] neatly print log..

### references
#### chrome api docs
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
