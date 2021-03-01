export interface LinkMenuItem {
    text: string;
    icon?: string;
    disabled?: boolean;
    // tslint:disable-next-line ban-types
    callback?: Function;
  }