import { Plugin } from "webpack";

declare type FirefoxPreferences = Record<string, boolean | string | number>;

declare interface RunParams {
  artifactsDir: string;
  browserConsole: boolean;
  pref?: FirefoxPreferences;
  firefox: string;
  firefoxProfile?: string;
  ignoreFiles?: string[];
  keepProfileChanges: boolean;
  preInstall: boolean;
  sourceDir: string;
  watchFile?: string;
  startUrl?: string[];
  target?: string | string[];
  args?: string[];

  // Android CLI options.
  adbBin?: string;
  adbHost?: string;
  adbPort?: string;
  adbDevice?: string;
  adbDiscoveryTimeout?: number;
  firefoxApk?: string;
  firefoxApkComponent?: string;

  // Chromium Desktop CLI options.
  chromiumBinary?: string;
  chromiumProfile?: string;

  noReload: never;
  noInput: never;
}

declare interface RunOptions {
  buildExtension: any;
  desktopNotifications: any;
  firefoxApp: any;
  firefoxClient: any;
  reloadStrategy: any;
  MultiExtensionRunner?: any;
  getValidatedManifest?: any;

  shouldExitProgram: never;
}

declare interface PluginOptions {
  verbose: boolean;
  timeout: number;
}

declare class WebExtWebpackPlugin extends Plugin {
  public constructor(
    CmdRunParams?: Partial<RunParams>,
    CmdRunOptions?: Partial<RunOptions>,
    PluginOptions?: Partial<PluginOptions>
  );
}

export = WebExtWebpackPlugin;
