import {
  initHidden, 
  setHiddenMethod, 
  setHiddenProp, 
  getHiddenProp, 
  getHiddenMethod,
  useHiddenMethod
} from "./hiddenFuncs.mjs"

const MyClass = (() => {

  /* static hidden stuff could go here */

  function publicMethod(name, value) {
    //prettier way to create class methods
    myClass.prototype[name] = value
  }

  function myClass(value) {
    /* Hidden instance stuff needs to be defined in the constructor */
    initHidden(this)
    setHiddenProp(this, '_hiddenProp', "I'm hidden!")
    setHiddenMethod(this, '_hiddenFunc', function() {
      return getHiddenProp(this, '_hiddenProp')
    })

    this.value = value
  }
  
  publicMethod('usesHidden', function() {
    return useHiddenMethod(this, '_hiddenFunc')
  })

  return myClass
})()

const myClass = new MyClass(5)
console.log(myClass)
console.log(myClass.usesHidden())

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function ClassMaker(constructor, publicProps = {}, hiddenStaticProps = {}) {
  if (
    typeof constructor !== 'function' || 
    typeof publicProps !== 'object' || 
    typeof hiddenStaticProps !== 'object'
  ) return

  for(const name in publicProps) {
    constructor.prototype[name] = publicProps[name]
  }

  for(const name in hiddenStaticProps) {
    initHidden(constructor)
    if(typeof hiddenStaticProps[name] === 'function') {
      setHiddenMethod(constructor, name, hiddenStaticProps[name])
    } else {
      setHiddenProp(constructor, name, hiddenStaticProps[name])
    }
  }

  return constructor
}

const MyClass2 = ClassMaker(
  // create a constructor that utilizes hidden instance stuff
  function constructor(name) {
    initHidden(this)
    setHiddenProp(this, '_message', "Created by ClassMaker!")
    setHiddenMethod(this, '_getMessage', function() {
      return getHiddenProp(this, '_message')
    })
    this.name = name
  },

  // add public methods/properties
  {
    getMessage() {
      return useHiddenMethod(this, '_getMessage')
    },
    showHiddenStaticProp() {return getHiddenProp(this.constructor, '_hiddenStaticProperty')},
    setHiddenStaticProp(value) {return setHiddenProp(this.constructor, '_hiddenStaticProperty', value)}
  },

  // add hidden static methods/properties. 
  {
    _hiddenStaticProperty: "wahoo!"
  }
  
)

const myClass2Instance = new MyClass2("My Class2 Instance")
console.log(myClass2Instance.name)
console.log(myClass2Instance.getMessage())
console.log(myClass2Instance.showHiddenStaticProp())
myClass2Instance.setHiddenStaticProp('New value!')

const myClass2Instance2 = new MyClass2("weee")
console.log(myClass2Instance2.showHiddenStaticProp())
console.log(Object.getPrototypeOf(Object.getPrototypeOf(myClass2Instance2)))


