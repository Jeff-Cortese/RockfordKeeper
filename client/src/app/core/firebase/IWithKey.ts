export interface IWithKey {
  $key?: string;
  $value?: () => any;
  $exists?: () => boolean;
}
