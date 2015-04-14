/*!
 *  v0.0.1 - 2015-04-14 - Extend jbone for use with other libs than Bb.
 *
 * https://github.com/deboned/jbone-extend
 *
 * Copyright 2015 Alexey Kupriyanenko,Paul Apostol
 * Released under the MIT license.
 */

(function (win) {

var fn = jBone.fn;

fn.click = function() {
    return this.trigger("click");
};

fn.height = function(value) {
    if (value !== undefined) {
        this.forEach(function(el) {
            el.style.height = value;
        });

        return this;
    }

    return this[0].clientHeight;
};

fn.focus = function() {
    return this.trigger("focus");
};

fn.scrollTop = function() {
    return this[0].scrollTop || this[0].scrollY || 0;
};

fn.bind = fn.on;

fn.prop = function(name, value) {
    var result;

    if (arguments.length === 1) {
        this.some(function(el) {
            if (name === "checked") {
                return result = el.checked;
            }

            return result = el.getAttribute(name);
        });

        return result;
    } else if (arguments.length === 2) {
        this.forEach(function(el) {
            el.setAttribute(name, value);
        });
    }

    return this;
};

fn.removeAttr = function(name) {
    this.forEach(function(el) {
        el.removeAttribute(name);
    });
};

fn.addClass = function(className) {
    var i = 0,
        j = 0,
        length = this.length,
        classes;

    for (; i < length; i++) {
        classes = className.trim().split(/\s+/);

        for (; j < classes.length; j++) {
            this[i].classList.add(classes[j]);
        }
    }

    return this;
};

fn.removeClass = function(className) {
    this.forEach(function(el) {
        className.split(" ").forEach(function(className) {
            el.classList.remove(className);
        });
    });

    return this;
};

fn.hasClass = function(className) {
    return this.some(function(el) {
        return el.classList.contains(className);
    });
};

fn.toggleClass = function(className) {
    this.forEach(function(el) {
        el.classList.toggle(className);
    });

    return this;
};

function isHidden(el) {
    return win.getComputedStyle(el).display === "none";
}

function showHide(elements, show) {
    var display;

    elements.forEach(function(el) {
        if (!el.style) {
            return;
        }

        display = el.style.display;
        if (show) {
            if (display === "none") {
                el.style.display = "";
            }

            if (el.style.display === "" && isHidden(el)) {
                el.style.display = "block";
            }
        } else {
            el.style.display = "none";
        }
    });

    return elements;
}

fn.show = function() {
    return showHide(this, true);
};

fn.hide = function() {
    return showHide(this);
};

fn.text = function() {
    var result = [];

    this.forEach(function(el) {
        result.push(el.textContent);
    });

    return result.join("");
};

fn.detach = function() {
    this.forEach(function(el) {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });

    return this;
};

fn.insertAfter = function(ref) {
    if (ref instanceof jBone) {
        ref = ref[0];
    }

    var parent = ref.parentNode,
        next = ref.nextSibling;

    if (next) {
        parent.insertBefore(this[0], next);
    } else {
        parent.appendChild(this[0]);
    }

    return this;
};

fn.offset = function(value) {
    if (value) {
        this.forEach(function(el) {
            el.offsetTop = value.top;
            el.offsetLeft = value.left;
        });
    } else {
        return {
            top: this[0].offsetTop,
            left: this[0].offsetLeft
        };
    }

    return this;
};

fn.replaceWith = function(сontent) {
    var replacement = сontent instanceof jBone ? сontent[0] : сontent;

    this.forEach(function(el) {
        if (el.parentNode) {
            el.parentNode.replaceChild(replacement, el);
            jBone(el).remove();
        }
    });

    return this;
};

/**
 * Created by Paul on 4/11/2015.
 */

jBone.expr = {};
var whitespace = "[\\x20\\t\\r\\n\\f]";
var characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+";
var identifier = characterEncoding.replace( "w", "w#" );
var attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
    // Operator (capture 2)
  "*([*^$|!~]?=)" + whitespace +
    // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
  "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
  "*\\]";
jBone.expr[":"] = ":(" + characterEncoding + ")(?:\\((" +
  // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
  // 1. quoted (capture 3; capture 4 or capture 5)
"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
  // 2. simple (capture 6)
"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
  // 3. anything else (capture 2)
".*" +
")\\)|)";
fn.closest = function(selector) {
    var parents, target, result;

    parents = jBone(selector);
    target = this[0];

    parents.some(function(parent) {
        return result = jBone.contains(jBone(parent), target);
    });

    return jBone(result);
};

fn.parents = function(selector) {
    var result = [], parents, target;

    if (selector) {
        parents = jBone(selector);

        parents.forEach(function(parent) {
            this.forEach(function(el) {
                if ((target = jBone.contains(jBone(parent), el)) && target.nodeType !== 9 && !~result.indexOf(target)) {
                    result.push(target);
                }
            });
        }, this);
    } else {
        this.forEach(function(el) {
            target = el;

            while ((target = target.parentNode) && target.nodeType !== 9) {
                if (!~result.indexOf(target)) {
                    result.push(target);
                }
            }
        });
    }

    return jBone(result);
};

fn.children = function() {
    var result = [];

    this.forEach(function(el) {
        [].forEach.call(el.childNodes, function(el) {
            if (el.nodeType !== 3) {
                result.push(el);
            }
        });
    });

    return jBone(result);
};

fn.not = function(condition) {
    var result = [];

    result = this.filter(function(el) {
        return el !== condition;
    });

    return jBone(result);
};

fn.siblings = function(includeSelf) {
    var result = [], parent;

    this.forEach(function(el) {
        if (parent = el.parentNode) {
            [].forEach.call(el.parentNode.childNodes, function(node) {
                if (includeSelf === undefined && node !== el && node.nodeType !== 3) {
                    result.push(node);
                } else if (includeSelf === true && node.nodeType !== 3) {
                    result.push(node);
                }
            });
        }
    });

    return jBone(result);
};

fn.next = function() {
    var result = [], next;

    this.forEach(function(el) {
        if (!~result.indexOf(next = el.nextElementSibling) && next) {
            result.push(next);
        }
    });

    return jBone(result);
};

fn.prev = function() {
    var result = [], previous;

    this.forEach(function(el) {
        if (!~result.indexOf(previous = el.previousElementSibling) && previous) {
            result.push(previous);
        }
    });

    return jBone(result);
};

fn.first = function() {
    return this.eq(0);
};

fn.last = function() {
    return this.eq(this.length - 1);
};

fn.index = function(element) {
    if (element instanceof jBone) {
        element = element[0];
    }

    if (element instanceof HTMLElement) {
        return this.indexOf(element);
    }
};

fn.is = function(match) {
    match = match.split(", ");

    return this.some(function(el) {
        return match.some(function(match) {
            // check visible
            if (match === ":visible") {
                return el.offsetWidth > 0 || el.offsetHeight > 0;
            }
            // check attribute
            else if (match[0] === ":") {
                return el.getAttribute(match.split(":")[1]) !== null;
            }
            // check class
            else if (match[0] === ".") {
                return el.classList.contains(match.split(".")[1]);
            }
            // check tagName
            else if (el.tagName.toLowerCase() === match) {
                return true;
            }
        });
    });
};

jBone.support = {};

fn.each = function(fn) {
    var length = this.length >>> 0,
        i = -1;

    while (++i < length) {
        if (i in this) {
            fn.call(this[i], i, this[i]);
        }
    }

    return this;
};

fn.map = function() {
    return jBone([].map.apply(this, arguments));
};

jBone.camelCase = function(string) {
    return string.replace(/-([\da-z])/gi, function(all, letter) {
        return letter.toUpperCase();
    });
};

jBone.proxy = function(fn, context) {
    return fn.bind(context);
};


if (typeof module === "object" && module && typeof module.exports === "object") {
    // Expose jBone as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports = jBone;
}
// Register as a AMD module
else if (typeof define === "function" && define.amd) {
    define(function() {
        return jBone;
    });
}

if (typeof win === "object" && typeof win.document === "object") {
    win.jQuery = win.jBone = win.$ = jBone;
}

}(window));
