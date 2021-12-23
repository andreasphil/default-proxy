const inTarget = (prop, obj)=>prop in obj
;
function defaultProxy(defaults) {
    const getWithFallback = (target, prop)=>{
        if (!inTarget(prop, defaultValue)) {
            return undefined;
        } else if (target[prop] === undefined) {
            return defaultValue[prop];
        } else {
            return target[prop];
        }
    };
    const defaultValue = {
        ...defaults
    };
    const value = new Proxy({
        ...defaults
    }, {
        get: getWithFallback
    });
    const assign = (prop, newValue)=>{
        value[prop] = newValue;
    };
    const reset = ()=>Object.keys(value).forEach((key)=>assign(key, defaults[key])
        )
    ;
    return {
        value: value,
        reset,
        assign
    };
}
export { defaultProxy as default };
