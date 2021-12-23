export type AssignFn<T extends Record<string, unknown>> = <K extends keyof T>(
  key: K,
  value: T[K] | undefined,
) => void;

export type DefaultProxy<T extends Record<string, unknown>> = {
  value: Readonly<Required<T>>;
  reset: () => void;
  assign: AssignFn<T>;
};

const inTarget = <T extends Record<string, unknown>>(
  // deno-lint-ignore no-explicit-any
  prop: any,
  obj: T,
): prop is keyof T => prop in obj;

/**
 * Creates a wrapper proxy around an object. For each property of the object, you
 * need to provide a default value (you can assign new values later on). The proxy
 * will return the new value if one exists, or the default value otherwise. This
 * lets you create an instance of a type where every property is guaranteed to have
 * a value.
 */
export default function defaultProxy<T extends Record<string, unknown>>(
  defaults: Required<T>,
): DefaultProxy<T> {
  const getWithFallback: ProxyHandler<Partial<T>>["get"] = (target, prop) => {
    if (!inTarget(prop, defaultValue)) {
      return undefined;
    } else if (target[prop] === undefined) {
      return defaultValue[prop];
    } else {
      return target[prop];
    }
  };

  const defaultValue = { ...defaults };
  const value = new Proxy<Partial<T>>({ ...defaults }, {
    get: getWithFallback,
  });

  const assign: AssignFn<T> = (prop, newValue): void => {
    value[prop] = newValue;
  };

  const reset = () =>
    Object.keys(value)
      .forEach((key: keyof T) => assign(key, defaults[key]));

  // We use Partial<T> for the correct typings inside the proxy get handler
  // (where properties of T might be missing), but we know that the handler
  // effectively turns the Partial<T> into a Required<T>, so we need to tell
  // TypeScript too
  return { value: value as Readonly<Required<T>>, reset, assign };
}
