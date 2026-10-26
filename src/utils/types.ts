export type EmptyProps = Record<string, never>;

export type ExcludeType = 'domain' | 'regex' | 'glob';

export interface ExcludeSetting {
  revision: number;
  excludePatterns: string[];
  excludeType: ExcludeType;
  autoReplaceEnabled: boolean;
}

export const DEFAULT_SETTING: ExcludeSetting = {
  revision: 0,
  excludePatterns: [],
  excludeType: 'domain',
  autoReplaceEnabled: false,
};
