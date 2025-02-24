import { Native } from "./Native";
import { Shell } from "./Shell";

interface IProperties {
  get(key: string, def: string): string;
  set(key: string, val: string): void;
}

class PropertiesClass extends Native<IProperties> {
  public constructor() {
    super(window.__properties__);
  }

  public get(key: string, def: string): string {
    if (this.isAndroid) {
      return this.interface.get(key, def);
    } else {
      return window.localStorage.getItem(key) || def;
    }
  }

  public set(key: string, value: string): void {
    if (this.isAndroid) {
      Shell.cmd(`setprop "${key}" "${value}"`).exec();
    } else {
      return window.localStorage.setItem(key, value);
    }
  }
}

export const Properties = new PropertiesClass();
