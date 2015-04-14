/**
 * Created by Paul on 4/14/2015.
 */

jBone.fn.jquery = jBone.prototype.jquery = "99.99.99";
jBone.fn.split = jBone.prototype.split = "".split;

var class2type = function() {
  // [[Class]] -> type pairs
  return {};
};

jBone.extend(jBone, {
  isFunction: function( obj ) {
    return jBone.type(obj) === "function";
  },

  isArray: Array.isArray,

  isWindow: function( obj ) {
    return obj != null && obj === obj.window;
  },

  isNumeric: function( obj ) {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat (#15100)
    return !jBone.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
  },

  isPlainObject: function( obj ) {
    // Not plain objects:
    // - Any object or value whose internal [[Class]] property is not "[object Object]"
    // - DOM nodes
    // - window
    if ( jBone.type( obj ) !== "object" || obj.nodeType || jBone.isWindow( obj ) ) {
      return false;
    }

    if ( obj.constructor &&
      !hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
      return false;
    }

    // If the function hasn't returned already, we're confident that
    // |obj| is a plain object, created by {} or constructed with new Object
    return true;
  },

  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },
  type: function( obj ) {
    if ( obj == null ) {
      return obj + "";
    }
    // Support: Android<4.0 (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ?
    class2type[ toString.call(obj) ] || "object" :
      typeof obj;
  }
});