export type EmptyProps = Record<string, never>;

export type MyState = {
  revision: number;
  autoReplace: boolean;
  excludeUrlPatterns: string[];
};

export interface ExcludeOption {
  filterType: 'domain' | 'regex' | 'glob';
}
