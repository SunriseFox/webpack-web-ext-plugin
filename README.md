### Webpack-web-ext-plugin

This plugin is intended to serve as a plugin for webpack-based web extension developing.

Desktop: watch, auto-reload

Android: choose device, watch, reload

### Usage

`npm i` or `yarn add` `github:sunrisefox/webpack-web-ext-plugin`

Just add this to your webpack.config.js...

```javascript
const WebExtPlugin = require('webpack-web-ext-plugin')

// for firefox
config.plugins.push(new WebExtPlugin({ sourceDir: dist }))

// for firefox-android
config.plugins.push(new WebExtPlugin({ sourceDir: dist, target: 'firefox-android' }))
```

This plugin takes all CmdRunParams and CmdRunOptions from `web-ext run` (somewhere like [https://github.com/mozilla/web-ext/blob/master/src/cmd/run.js#L25](https://github.com/mozilla/web-ext/blob/master/src/cmd/run.js#L25)). You can customize it as much as your can. ...except `noReload` and `noInput` are enforced to `true` to work with webpack.

// TODO:

support web-ext build
