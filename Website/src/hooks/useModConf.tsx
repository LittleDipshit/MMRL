import React, { createContext, useContext } from "react";
import { defaultComposer } from "default-composer";
import { useNativeStorage } from "./useNativeStorage";
import { SetStateAction } from "./useStateCallback";

export interface ModConf {
  //cli
  MSUCLI: string;
  MSUBSU: string;
  MSURSP: string;
  KSUCLI: string;
  KSUBSU: string;
  KSURSP: string;
  ASUCLI: string;
  ASUBSU: string;
  ASURSP: string;

  // default paths
  ADB: string;
  MODULES: string;
  MODULECWD: string;
  PROPS: string;
  SYSTEM: string;
  SEPOLICY: string;
  CONFIG: string;

  // service paths
  LATESERVICE: string;
  POSTSERVICE: string;
  POSTMOUNT: string;
  BOOTCOMP: string;

  // status paths
  SKIPMOUNT: string;
  DISABLE: string;
  REMOVE: string;
  UPDATE: string;

  // others
  MMRLINI: string;
  CONFCWD: string;
  CONFINDEX: string;
}

export const INITIAL_MOD_CONF: ModConf = {
  //cli
  MSUCLI: "/system/bin/magisk",
  MSUBSU: "<ADB>/magisk/busybox",
  MSURSP: "/system/bin/resetprop",
  KSUCLI: "<ADB>/ksu/bin/ksud",
  KSUBSU: "<ADB>/ksu/bin/busybox",
  KSURSP: "<ADB>/ksu/bin/resetprop",
  ASUCLI: "<ADB>/ap/bin/apd",
  ASUBSU: "<ADB>/ap/bin/busybox",
  ASURSP: "<ADB>/ap/bin/resetprop",

  // default paths
  ADB: "/data/adb",
  MODULES: "<ADB>/modules",
  MODULECWD: "<MODULES>/<MODID>",
  PROPS: "<MODULECWD>/module.prop",
  SYSTEM: "<MODULECWD>/system.prop",
  SEPOLICY: "<MODULECWD>/sepolicy.rule",
  CONFIG: `<MODULECWD>/system/usr/share/mmrl/config/<MODID>.mdx`,

  // service paths
  LATESERVICE: "<MODULECWD>/service.sh",
  POSTSERVICE: "<MODULECWD>/post-fs-data.sh",
  POSTMOUNT: "<MODULECWD>/post-mount.sh",
  BOOTCOMP: "<MODULECWD>/boot-completed.sh",

  // status paths
  SKIPMOUNT: "<MODULECWD>/skip_mount",
  DISABLE: "<MODULECWD>/disable",
  REMOVE: "<MODULECWD>/remove",
  UPDATE: "<MODULECWD>/update",

  // others
  MMRLINI: "<MODULES>/mmrl_install_tools",
  CONFCWD: "<MODULECWD>/system/usr/share/mmrl/config/<MODID>",
  CONFINDEX: "<CONFCWD>/index.jsx",
};

export interface ModConfContext {
  _modConf: ModConf;
  __modConf: ModConf;
  modConf<K extends keyof ModConf>(key: K, adds?: Record<string, any>): ModConf[K];
  setModConf<K extends keyof ModConf>(key: K, state: SetStateAction<ModConf[K]>, callback?: (state: ModConf[K]) => void): void;
}

export const ModConfContext = createContext<ModConfContext>({
  _modConf: INITIAL_MOD_CONF,
  __modConf: INITIAL_MOD_CONF,
  modConf<K extends keyof ModConf>(key: K, adds?: Record<string, any>) {
    return key;
  },
  setModConf<K extends keyof ModConf>(key: K, state: SetStateAction<ModConf[K]>, callback?: (state: ModConf[K]) => void) {},
});

export const useModConf = () => {
  return useContext(ModConfContext);
};

export function formatString(template: string, object: object): string {
  return template.replace(/\<(\w+(\.\w+)*)\>/gi, (match, key) => {
    const keys = key.split(".");
    let value = object;
    for (const k of keys) {
      if (k in value) {
        value = value[k];
      } else {
        return match;
      }
    }
    return formatString(String(value), object);
  });
}

export function formatObjectEntries<O extends object = object>(object: O): O {
  const formatValue = (value: any): any => {
    if (typeof value === "string") {
      return value.replace(/\<(\w+(\.\w+)*)\>/gi, (match, key) => {
        const keys = key.split(".");
        let tempValue = object;
        for (const k of keys) {
          if (k in tempValue) {
            tempValue = tempValue[k];
          } else {
            return match;
          }
        }
        return formatValue(tempValue);
      });
    } else if (Array.isArray(value)) {
      return value.map((item: any) => formatValue(item));
    } else if (typeof value === "object" && value !== null) {
      const formattedObject: any = {};
      for (const prop in value) {
        formattedObject[prop] = formatValue(value[prop]);
      }
      return formattedObject;
    }
    return value;
  };

  const formattedObject: any = {};
  for (const key in object) {
    const formattedValue = formatValue(object[key]);
    formattedObject[key] = formattedValue;
  }
  return formattedObject;
}

export const ModConfProvider = (props: React.PropsWithChildren) => {
  const [modConf, setModConf] = useNativeStorage("modconf_v4", INITIAL_MOD_CONF);

  // Test purposes
  // React.useEffect(() => {
  //   for (const k in modConf) {
  //     console.info(
  //       formatString(defaultComposer(INITIAL_MOD_CONF, modConf)[k], {
  //         ...modConf,
  //         ...{
  //           MODID: "node_on_android",
  //           ZIPFILE: "/sdard/xh.zip",
  //         },
  //       })
  //     );
  //   }
  // }, [modConf]);

  const contextValue = React.useMemo(
    () => ({
      _modConf: defaultComposer(INITIAL_MOD_CONF, modConf),
      __modConf: formatObjectEntries<ModConf>(defaultComposer(INITIAL_MOD_CONF, modConf)),
      modConf: (key, adds) => {
        return formatString(defaultComposer(INITIAL_MOD_CONF, modConf)[key], { ...modConf, ...adds });
      },
      setModConf: (name, state, callback) => {
        setModConf(
          (prev) => {
            const newValue = state instanceof Function ? state(prev[name]) : state;
            return {
              ...prev,
              [name]: newValue,
            };
          },
          (state) => callback && callback(state[name])
        );
      },
    }),
    [modConf]
  );

  return <ModConfContext.Provider value={contextValue} children={props.children} />;
};
