## Development

### Setup

Tools are managed by [mise](https://mise.jdx.dev) (see [`mise.toml`](/mise.toml)).

```sh
mise install
pnpm install
hk install # git hooks (oxfmt, oxlint, pnpm audit)
git config --local blame.ignoreRevsFile .git-blame-ignore-revs
```

> pnpm is configured with a 7-day `minimumReleaseAge` cooldown (see [`pnpm-workspace.yaml`](/pnpm-workspace.yaml)).

Recommended VS Code extension: [oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)

### Run locally

```sh
pnpm dev   # watch build (popup, options, background)
pnpm build # full build incl. content script
```

Go to `chrome://extensions`, select `Load unpacked` and select `./dist` folder. Reload manually when updated.

### Check

```sh
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test     # unit (vitest)

# E2E: loads built extension into Chromium (playwright)
pnpm exec playwright install chromium # once
pnpm build && pnpm test:e2e
```

### GitHub Actions

Actions are pinned by commit SHA with [pinact](https://github.com/suzuki-shunsuke/pinact).

```sh
pinact run     # pin
pinact run -u  # update
zizmor .github # audit
```

### Release

Run the [release workflow](/.github/workflows/release.yaml) with a version (ex. `1.2.3`) on `main`.
It bumps versions, pushes a `v` tag, and creates a draft GitHub Release with the build zip.

### Icon

Source: [`assets/icon.svg`](/assets/icon.svg)

```sh
for s in 16 32 48 128; do rsvg-convert -w $s -h $s assets/icon.svg -o public/icon-$s.png; done
```

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
- chrome extension 개발기: https://80000coding.oopy.io/34a2083b-c159-4524-b5f2-750d3ab4fbba
