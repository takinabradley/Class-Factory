const hiddenMethods = new WeakMap()
const hiddenProps = new WeakMap()

/* Methods to grab hidden stuff */
const initHidden = (obj) => {
  hiddenMethods.set(obj, {})
  hiddenProps.set(obj, {})
}
const setHiddenMethod = (obj, name, func) => {
  if(typeof func !== 'function') return
  return hiddenMethods.get(obj)[name] = func
}
const setHiddenProp = (obj, name, value) => {
  if(typeof value === 'function') return
  return hiddenProps.get(obj)[name] = value
}
const getHiddenProp = (obj, name) => {
  return hiddenProps.get(obj)[name]
}
const getHiddenMethod = (obj, name) => {
  return hiddenMethods.get(obj)[name]
}
const useHiddenMethod = (obj, name, ...args) => {
  return hiddenMethods.get(obj)[name].call(obj, ...args)
}

export {
  initHidden,
  setHiddenMethod,
  setHiddenProp,
  getHiddenMethod,
  getHiddenProp,
  useHiddenMethod
}