(function() {
  "use strict";
  function normalizeComponent$1(template, style, script2, scopeId, isFunctionalTemplate, moduleIdentifier, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== "boolean") {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    }
    const options = typeof script2 === "function" ? script2.options : script2;
    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true;
      if (isFunctionalTemplate) {
        options.functional = true;
      }
    }
    if (scopeId) {
      options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
      hook = function(context) {
        context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        if (style) {
          style.call(this, createInjectorSSR(context));
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function(context) {
        style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
      } : function(context) {
        style.call(this, createInjector(context));
      };
    }
    if (hook) {
      if (options.functional) {
        const originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        const existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return script2;
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var immutabilityHelper = { exports: {} };
  (function(module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function stringifiable(obj) {
      return typeof obj === "object" && !("toString" in obj) ? Object.prototype.toString.call(obj).slice(8, -1) : obj;
    }
    var isProduction = typeof process === "object" && false;
    function invariant(condition, message) {
      if (!condition) {
        if (isProduction) {
          throw new Error("Invariant failed");
        }
        throw new Error(message());
      }
    }
    exports.invariant = invariant;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var splice = Array.prototype.splice;
    var toString = Object.prototype.toString;
    function type(obj) {
      return toString.call(obj).slice(8, -1);
    }
    var assign = Object.assign || function(target, source) {
      getAllKeys(source).forEach(function(key) {
        if (hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      });
      return target;
    };
    var getAllKeys = typeof Object.getOwnPropertySymbols === "function" ? function(obj) {
      return Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
    } : function(obj) {
      return Object.keys(obj);
    };
    function copy(object) {
      return Array.isArray(object) ? assign(object.constructor(object.length), object) : type(object) === "Map" ? new Map(object) : type(object) === "Set" ? new Set(object) : object && typeof object === "object" ? assign(Object.create(Object.getPrototypeOf(object)), object) : object;
    }
    var Context = function() {
      function Context2() {
        this.commands = assign({}, defaultCommands);
        this.update = this.update.bind(this);
        this.update.extend = this.extend = this.extend.bind(this);
        this.update.isEquals = function(x, y) {
          return x === y;
        };
        this.update.newContext = function() {
          return new Context2().update;
        };
      }
      Object.defineProperty(Context2.prototype, "isEquals", {
        get: function() {
          return this.update.isEquals;
        },
        set: function(value) {
          this.update.isEquals = value;
        },
        enumerable: true,
        configurable: true
      });
      Context2.prototype.extend = function(directive, fn) {
        this.commands[directive] = fn;
      };
      Context2.prototype.update = function(object, $spec) {
        var _this = this;
        var spec = typeof $spec === "function" ? { $apply: $spec } : $spec;
        if (!(Array.isArray(object) && Array.isArray(spec))) {
          invariant(!Array.isArray(spec), function() {
            return "update(): You provided an invalid spec to update(). The spec may not contain an array except as the value of $set, $push, $unshift, $splice or any custom command allowing an array value.";
          });
        }
        invariant(typeof spec === "object" && spec !== null, function() {
          return "update(): You provided an invalid spec to update(). The spec and every included key path must be plain objects containing one of the " + ("following commands: " + Object.keys(_this.commands).join(", ") + ".");
        });
        var nextObject = object;
        getAllKeys(spec).forEach(function(key) {
          if (hasOwnProperty.call(_this.commands, key)) {
            var objectWasNextObject = object === nextObject;
            nextObject = _this.commands[key](spec[key], nextObject, spec, object);
            if (objectWasNextObject && _this.isEquals(nextObject, object)) {
              nextObject = object;
            }
          } else {
            var nextValueForKey = type(object) === "Map" ? _this.update(object.get(key), spec[key]) : _this.update(object[key], spec[key]);
            var nextObjectValue = type(nextObject) === "Map" ? nextObject.get(key) : nextObject[key];
            if (!_this.isEquals(nextValueForKey, nextObjectValue) || typeof nextValueForKey === "undefined" && !hasOwnProperty.call(object, key)) {
              if (nextObject === object) {
                nextObject = copy(object);
              }
              if (type(nextObject) === "Map") {
                nextObject.set(key, nextValueForKey);
              } else {
                nextObject[key] = nextValueForKey;
              }
            }
          }
        });
        return nextObject;
      };
      return Context2;
    }();
    exports.Context = Context;
    var defaultCommands = {
      $push: function(value, nextObject, spec) {
        invariantPushAndUnshift(nextObject, spec, "$push");
        return value.length ? nextObject.concat(value) : nextObject;
      },
      $unshift: function(value, nextObject, spec) {
        invariantPushAndUnshift(nextObject, spec, "$unshift");
        return value.length ? value.concat(nextObject) : nextObject;
      },
      $splice: function(value, nextObject, spec, originalObject) {
        invariantSplices(nextObject, spec);
        value.forEach(function(args) {
          invariantSplice(args);
          if (nextObject === originalObject && args.length) {
            nextObject = copy(originalObject);
          }
          splice.apply(nextObject, args);
        });
        return nextObject;
      },
      $set: function(value, _nextObject, spec) {
        invariantSet(spec);
        return value;
      },
      $toggle: function(targets, nextObject) {
        invariantSpecArray(targets, "$toggle");
        var nextObjectCopy = targets.length ? copy(nextObject) : nextObject;
        targets.forEach(function(target) {
          nextObjectCopy[target] = !nextObject[target];
        });
        return nextObjectCopy;
      },
      $unset: function(value, nextObject, _spec, originalObject) {
        invariantSpecArray(value, "$unset");
        value.forEach(function(key) {
          if (Object.hasOwnProperty.call(nextObject, key)) {
            if (nextObject === originalObject) {
              nextObject = copy(originalObject);
            }
            delete nextObject[key];
          }
        });
        return nextObject;
      },
      $add: function(values, nextObject, _spec, originalObject) {
        invariantMapOrSet(nextObject, "$add");
        invariantSpecArray(values, "$add");
        if (type(nextObject) === "Map") {
          values.forEach(function(_a) {
            var key = _a[0], value = _a[1];
            if (nextObject === originalObject && nextObject.get(key) !== value) {
              nextObject = copy(originalObject);
            }
            nextObject.set(key, value);
          });
        } else {
          values.forEach(function(value) {
            if (nextObject === originalObject && !nextObject.has(value)) {
              nextObject = copy(originalObject);
            }
            nextObject.add(value);
          });
        }
        return nextObject;
      },
      $remove: function(value, nextObject, _spec, originalObject) {
        invariantMapOrSet(nextObject, "$remove");
        invariantSpecArray(value, "$remove");
        value.forEach(function(key) {
          if (nextObject === originalObject && nextObject.has(key)) {
            nextObject = copy(originalObject);
          }
          nextObject.delete(key);
        });
        return nextObject;
      },
      $merge: function(value, nextObject, _spec, originalObject) {
        invariantMerge(nextObject, value);
        getAllKeys(value).forEach(function(key) {
          if (value[key] !== nextObject[key]) {
            if (nextObject === originalObject) {
              nextObject = copy(originalObject);
            }
            nextObject[key] = value[key];
          }
        });
        return nextObject;
      },
      $apply: function(value, original) {
        invariantApply(value);
        return value(original);
      }
    };
    var defaultContext = new Context();
    exports.isEquals = defaultContext.update.isEquals;
    exports.extend = defaultContext.extend;
    exports.default = defaultContext.update;
    exports.default.default = module.exports = assign(exports.default, exports);
    function invariantPushAndUnshift(value, spec, command) {
      invariant(Array.isArray(value), function() {
        return "update(): expected target of " + stringifiable(command) + " to be an array; got " + stringifiable(value) + ".";
      });
      invariantSpecArray(spec[command], command);
    }
    function invariantSpecArray(spec, command) {
      invariant(Array.isArray(spec), function() {
        return "update(): expected spec of " + stringifiable(command) + " to be an array; got " + stringifiable(spec) + ". Did you forget to wrap your parameter in an array?";
      });
    }
    function invariantSplices(value, spec) {
      invariant(Array.isArray(value), function() {
        return "Expected $splice target to be an array; got " + stringifiable(value);
      });
      invariantSplice(spec.$splice);
    }
    function invariantSplice(value) {
      invariant(Array.isArray(value), function() {
        return "update(): expected spec of $splice to be an array of arrays; got " + stringifiable(value) + ". Did you forget to wrap your parameters in an array?";
      });
    }
    function invariantApply(fn) {
      invariant(typeof fn === "function", function() {
        return "update(): expected spec of $apply to be a function; got " + stringifiable(fn) + ".";
      });
    }
    function invariantSet(spec) {
      invariant(Object.keys(spec).length === 1, function() {
        return "Cannot have more than one key in an object with $set";
      });
    }
    function invariantMerge(target, specValue) {
      invariant(specValue && typeof specValue === "object", function() {
        return "update(): $merge expects a spec of type 'object'; got " + stringifiable(specValue);
      });
      invariant(target && typeof target === "object", function() {
        return "update(): $merge expects a target of type 'object'; got " + stringifiable(target);
      });
    }
    function invariantMapOrSet(target, command) {
      var typeOfTarget = type(target);
      invariant(typeOfTarget === "Map" || typeOfTarget === "Set", function() {
        return "update(): " + stringifiable(command) + " expects a target of type Set or Map; got " + stringifiable(typeOfTarget);
      });
    }
  })(immutabilityHelper, immutabilityHelper.exports);
  var update = /* @__PURE__ */ getDefaultExportFromCjs(immutabilityHelper.exports);
  /*!
   * vue-nestable v2.6.0
   * (c) Ralph Huwiler <ralph@huwiler.rocks>
   * Released under the MIT License.
   */
  function _typeof(obj) {
    "@babel/helpers - typeof";
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly)
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter))
      return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        var F = function() {
        };
        return {
          s: F,
          n: function() {
            if (i >= o.length)
              return {
                done: true
              };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function(e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
      s: function() {
        it = o[Symbol.iterator]();
      },
      n: function() {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function(e) {
        didErr = true;
        err = e;
      },
      f: function() {
        try {
          if (!normalCompletion && it.return != null)
            it.return();
        } finally {
          if (didErr)
            throw err;
        }
      }
    };
  }
  var store = {};
  var groupsObserver = {
    methods: {
      registerNestable: function registerNestable(nestable) {
        var storeGroup = this._getByGroup(nestable.group);
        storeGroup.onDragStartListeners.push(nestable.onDragStart);
        storeGroup.onMouseEnterListeners.push(nestable.onMouseEnter);
        storeGroup.onMouseMoveListeners.push(nestable.onMouseMove);
      },
      notifyDragStart: function notifyDragStart(group, event, item) {
        var storeGroup = this._getByGroup(group);
        var _iterator = _createForOfIteratorHelper(storeGroup.onDragStartListeners), _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done; ) {
            var listener = _step.value;
            listener(event, item);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      },
      notifyMouseEnter: function notifyMouseEnter(group, event, eventList, item) {
        var storeGroup = this._getByGroup(group);
        var _iterator2 = _createForOfIteratorHelper(storeGroup.onMouseEnterListeners), _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
            var listener = _step2.value;
            listener(event, eventList, item);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      },
      notifyMouseMove: function notifyMouseMove(group, event) {
        var storeGroup = this._getByGroup(group);
        var _iterator3 = _createForOfIteratorHelper(storeGroup.onMouseMoveListeners), _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done; ) {
            var listener = _step3.value;
            listener(event);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      },
      _getByGroup: function _getByGroup(group) {
        if (store[group]) {
          return store[group];
        }
        store[group] = {
          onDragStartListeners: [],
          onMouseEnterListeners: [],
          onMouseMoveListeners: [],
          onDragStart: [],
          dragItem: null
        };
        return store[group];
      }
    }
  };
  var script = {
    name: "NestableItem",
    mixins: [groupsObserver],
    props: {
      item: {
        type: Object,
        required: true,
        default: function _default() {
          return {};
        }
      },
      index: {
        type: Number,
        required: false,
        default: null
      },
      isChild: {
        type: Boolean,
        required: false,
        default: false
      },
      isCopy: {
        type: Boolean,
        required: false,
        default: false
      },
      options: {
        type: Object,
        required: true,
        default: function _default() {
          return {};
        }
      }
    },
    inject: ["listId", "group", "keyProp"],
    data: function data() {
      return {
        breakPoint: null,
        moveDown: false
      };
    },
    computed: {
      isDragging: function isDragging() {
        var dragItem = this.options.dragItem;
        return !this.isCopy && dragItem && dragItem[this.options.keyProp] === this.item[this.options.keyProp];
      },
      hasChildren: function hasChildren() {
        return this.item[this.options.childrenProp] && this.item[this.options.childrenProp].length > 0;
      },
      hasHandle: function hasHandle() {
        return !!this.$scopedSlots.handler;
      },
      normalizedClassProp: function normalizedClassProp() {
        var classProp = this.item[this.options.classProp];
        if (!classProp)
          return [];
        if (Array.isArray(classProp)) {
          return classProp;
        } else if ((typeof a === "undefined" ? "undefined" : _typeof(a)) === "object") {
          return [classProp];
        } else {
          return [classProp];
        }
      },
      itemClasses: function itemClasses() {
        var isDragging = this.isDragging ? ["is-dragging"] : [];
        return ["nestable-item".concat(this.isCopy ? "-copy" : ""), "nestable-item".concat(this.isCopy ? "-copy" : "", "-").concat(this.item[this.options.keyProp])].concat(isDragging, _toConsumableArray(this.normalizedClassProp));
      }
    },
    methods: {
      onMouseEnter: function onMouseEnter(event) {
        if (!this.options.dragItem)
          return;
        if (!event.movementY) {
          return this.sendNotification(event);
        }
        this.moveDown = event.movementY > 0;
        this.breakPoint = event.target.getBoundingClientRect().height / 2;
      },
      onMouseLeave: function onMouseLeave() {
        this.breakPoint = null;
      },
      onMouseMove: function onMouseMove(event) {
        if (!this.breakPoint)
          return;
        var delta = event.offsetY - this.breakPoint;
        if (this.moveDown && delta < this.breakPoint / 4)
          return;
        if (!this.moveDown && delta > -this.breakPoint / 4)
          return;
        this.sendNotification(event);
      },
      sendNotification: function sendNotification(event) {
        this.breakPoint = null;
        var item = this.item || this.$parent.item;
        this.notifyMouseEnter(this.group, event, this.listId, item);
      }
    }
  };
  var __vue_script__ = script;
  var __vue_render__ = function __vue_render__2() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("li", {
      class: _vm.itemClasses
    }, [_c("div", {
      staticClass: "nestable-item-content",
      on: {
        "mouseenter": _vm.onMouseEnter,
        "mouseleave": _vm.onMouseLeave,
        "mousemove": _vm.onMouseMove
      }
    }, [_vm._t("default", null, {
      "index": _vm.index,
      "item": _vm.item,
      "isChild": _vm.isChild
    })], 2), _vm._v(" "), _vm.hasChildren ? _c("ol", {
      staticClass: "nestable-list"
    }, [_vm._l(_vm.item[_vm.options.childrenProp], function(child, childIndex) {
      return [_c("NestableItem", {
        key: child[_vm.keyProp],
        attrs: {
          "item": child,
          "index": childIndex,
          "options": _vm.options,
          "is-copy": _vm.isCopy,
          "is-child": ""
        },
        scopedSlots: _vm._u([_vm._l(Object.keys(_vm.$scopedSlots), function(slot) {
          return {
            key: slot,
            fn: function fn(scope) {
              return [_vm._t(slot, null, null, scope)];
            }
          };
        })], null, true)
      })];
    })], 2) : _vm._e()]);
  };
  var __vue_staticRenderFns__ = [];
  var __vue_inject_styles__ = void 0;
  var __vue_scope_id__ = void 0;
  var __vue_module_identifier__ = void 0;
  var __vue_is_functional_template__ = false;
  var __vue_component__ = /* @__PURE__ */ normalizeComponent$1({
    render: __vue_render__,
    staticRenderFns: __vue_staticRenderFns__
  }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, void 0, void 0, void 0);
  var script$1 = {
    name: "Placeholder",
    mixins: [groupsObserver],
    props: {
      index: {
        type: Number,
        required: false,
        default: null
      },
      options: {
        type: Object,
        required: false,
        default: function _default() {
          return {};
        }
      }
    },
    inject: ["listId", "group"],
    computed: {
      isDragging: function isDragging() {
        var dragItem = this.options.dragItem;
        return dragItem;
      }
    },
    methods: {
      onMouseEnter: function onMouseEnter(event) {
        if (!this.options.dragItem)
          return;
        this.notifyMouseEnter(this.group, event, this.listId, null);
      }
    }
  };
  var __vue_script__$1 = script$1;
  var __vue_render__$1 = function __vue_render__2() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("li", [_c("div", {
      staticClass: "nestable-list-empty",
      on: {
        "mouseenter": _vm.onMouseEnter
      }
    }, [_vm._t("default")], 2)]);
  };
  var __vue_staticRenderFns__$1 = [];
  var __vue_inject_styles__$1 = void 0;
  var __vue_scope_id__$1 = void 0;
  var __vue_module_identifier__$1 = void 0;
  var __vue_is_functional_template__$1 = false;
  var __vue_component__$1 = /* @__PURE__ */ normalizeComponent$1({
    render: __vue_render__$1,
    staticRenderFns: __vue_staticRenderFns__$1
  }, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, void 0, void 0, void 0);
  var nestableHelpers = {
    methods: {
      getPathById: function getPathById(id) {
        var _this = this;
        var items = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value;
        var path = [];
        items.every(function(item, i) {
          if (item[_this.keyProp] === id) {
            path.push(i);
          } else if (item[_this.childrenProp]) {
            var childrenPath = _this.getPathById(id, item[_this.childrenProp]);
            if (childrenPath.length) {
              path = path.concat(i).concat(childrenPath);
            }
          }
          return path.length === 0;
        });
        return path;
      },
      getItemByPath: function getItemByPath(path) {
        var _this2 = this;
        var items = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.value;
        var item = null;
        path.forEach(function(index2) {
          var list = item && item[_this2.childrenProp] ? item[_this2.childrenProp] : items;
          item = list[index2];
        });
        return item;
      },
      getItemDepth: function getItemDepth(item) {
        var level = 1;
        if (item[this.childrenProp] && item[this.childrenProp].length > 0) {
          var childrenDepths = item[this.childrenProp].map(this.getItemDepth);
          level += Math.max.apply(Math, _toConsumableArray(childrenDepths));
        }
        return level;
      },
      getSplicePath: function getSplicePath(path) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var splicePath = {};
        var numToRemove = options.numToRemove || 0;
        var itemsToInsert = options.itemsToInsert || [];
        var lastIndex = path.length - 1;
        var currentPath = splicePath;
        path.forEach(function(index2, i) {
          if (i === lastIndex) {
            currentPath.$splice = [[index2, numToRemove].concat(_toConsumableArray(itemsToInsert))];
          } else {
            var nextPath = {};
            currentPath[index2] = _defineProperty({}, options.childrenProp, nextPath);
            currentPath = nextPath;
          }
        });
        return splicePath;
      },
      getRealNextPath: function getRealNextPath(prevPath, nextPath) {
        var ppLastIndex = prevPath.length - 1;
        var npLastIndex = nextPath.length - 1;
        if (prevPath.length < nextPath.length) {
          var wasShifted = false;
          return nextPath.map(function(nextIndex, i) {
            if (wasShifted) {
              return i === npLastIndex ? nextIndex + 1 : nextIndex;
            }
            if (typeof prevPath[i] !== "number") {
              return nextIndex;
            }
            if (nextPath[i] > prevPath[i] && i === ppLastIndex) {
              wasShifted = true;
              return nextIndex - 1;
            }
            return nextIndex;
          });
        } else if (prevPath.length === nextPath.length) {
          if (nextPath[npLastIndex] > prevPath[npLastIndex]) {
            var target = this.getItemByPath(nextPath);
            if (target[this.childrenProp] && target[this.childrenProp].length && !this.isCollapsed(target)) {
              return nextPath.slice(0, -1).concat(nextPath[npLastIndex] - 1).concat(0);
            }
          }
        }
        return nextPath;
      }
    }
  };
  var callsHooks = {
    methods: {
      hook: function hook(name, params) {
        if (!this.hooks[name])
          return true;
        var result = this.hooks[name](params);
        return result || result === void 0;
      }
    }
  };
  var closest = function closest2(target, selector) {
    return target.closest(selector);
  };
  var getOffsetRect = function getOffsetRect2(elem) {
    var box = elem.getBoundingClientRect();
    return {
      top: Math.round(box.top),
      left: Math.round(box.left)
    };
  };
  var getTransformProps = function getTransformProps2(x, y) {
    return {
      transform: "translate(" + x + "px, " + y + "px)"
    };
  };
  var listWithChildren = function listWithChildren2(list, childrenProp) {
    return list.map(function(item) {
      return _objectSpread2(_objectSpread2({}, item), {}, _defineProperty({}, childrenProp, item[childrenProp] ? listWithChildren2(item[childrenProp], childrenProp) : []));
    });
  };
  var script$2 = {
    name: "VueNestable",
    components: {
      NestableItem: __vue_component__,
      Placeholder: __vue_component__$1
    },
    mixins: [nestableHelpers, groupsObserver, callsHooks],
    props: {
      value: {
        type: Array,
        required: true,
        default: function _default() {
          return [];
        }
      },
      threshold: {
        type: Number,
        required: false,
        default: 30
      },
      maxDepth: {
        type: Number,
        required: false,
        default: 10
      },
      keyProp: {
        type: String,
        required: false,
        default: "id"
      },
      classProp: {
        type: String,
        required: false,
        default: null
      },
      group: {
        type: [String, Number],
        required: false,
        default: function _default() {
          return Math.random().toString(36).slice(2);
        }
      },
      childrenProp: {
        type: String,
        required: false,
        default: "children"
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      hooks: {
        type: Object,
        required: false,
        default: function _default() {
          return {};
        }
      },
      rtl: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    provide: function provide() {
      return {
        listId: this.listId,
        group: this.group,
        keyProp: this.keyProp,
        onDragEnd: this.onDragEnd
      };
    },
    data: function data() {
      return {
        itemsOld: null,
        dragItem: null,
        mouse: {
          last: {
            x: 0
          },
          shift: {
            x: 0
          }
        },
        el: null,
        elCopyStyles: null,
        isDirty: false,
        collapsedGroups: [],
        listId: Math.random().toString(36).slice(2)
      };
    },
    computed: {
      listIsEmpty: function listIsEmpty() {
        return this.value.length === 0;
      },
      itemOptions: function itemOptions() {
        return {
          dragItem: this.dragItem,
          keyProp: this.keyProp,
          classProp: this.classProp,
          childrenProp: this.childrenProp
        };
      },
      listStyles: function listStyles() {
        var el = document.querySelector(".nestable-" + this.group + " .nestable-item-" + this.dragItem[this.keyProp]);
        var listStyles2 = {};
        if (el) {
          listStyles2.width = "".concat(el.clientWidth, "px");
        }
        if (this.elCopyStyles) {
          listStyles2 = _objectSpread2(_objectSpread2({}, listStyles2), this.elCopyStyles);
        }
        return listStyles2;
      }
    },
    created: function created() {
      var items = listWithChildren(this.value, this.childrenProp);
      this.$emit("input", items);
      this.isDirty = false;
      this.registerNestable(this);
    },
    beforeDestroy: function beforeDestroy() {
      this.stopTrackMouse();
    },
    methods: {
      startTrackMouse: function startTrackMouse() {
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onDragEnd);
        document.addEventListener("touchend", this.onDragEnd);
        document.addEventListener("touchcancel", this.onDragEnd);
        document.addEventListener("keydown", this.onKeyDown);
      },
      stopTrackMouse: function stopTrackMouse() {
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onDragEnd);
        document.removeEventListener("touchend", this.onDragEnd);
        document.removeEventListener("touchcancel", this.onDragEnd);
        document.removeEventListener("keydown", this.onKeyDown);
        this.elCopyStyles = null;
      },
      onDragStart: function onDragStart(event, item) {
        var _this = this;
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        this.el = closest(event.target, ".nestable-item");
        this.startTrackMouse();
        this.dragItem = item;
        this.itemsOld = this.value;
        this.$nextTick(function() {
          _this.onMouseMove(event);
        });
      },
      onDragEnd: function onDragEnd(event, isCancel) {
        event && event.preventDefault();
        this.stopTrackMouse();
        this.el = null;
        isCancel ? this.dragRevert() : this.dragApply();
      },
      onKeyDown: function onKeyDown(event) {
        if (event.which === 27) {
          this.onDragEnd(null, true);
        }
      },
      getXandYFromEvent: function getXandYFromEvent(event) {
        var clientX = event.clientX, clientY = event.clientY;
        var targetTouches = event.targetTouches;
        if (targetTouches) {
          var touch = targetTouches[0];
          clientX = touch.clientX;
          clientY = touch.clientY;
          var _event = new Event("mouseenter");
          var element = document.elementFromPoint(clientX, clientY);
          var touchElement = element && (element.closest(".nestable-item-content") || element.closest(".nestable-list-empty"));
          if (touchElement)
            touchElement.dispatchEvent(_event);
        }
        return {
          clientX,
          clientY
        };
      },
      onMouseMove: function onMouseMove(event) {
        event && event.preventDefault();
        var _this$getXandYFromEve = this.getXandYFromEvent(event), clientX = _this$getXandYFromEve.clientX, clientY = _this$getXandYFromEve.clientY;
        if (this.mouse.last.x === 0) {
          this.mouse.last.x = clientX;
        }
        var transformProps = getTransformProps(clientX, clientY);
        var elDragLayer = document.querySelector(".nestable-" + this.group + " .nestable-drag-layer");
        if (!elDragLayer)
          return;
        var _elDragLayer$getBound = elDragLayer.getBoundingClientRect(), dragLayerTop = _elDragLayer$getBound.top, dragLayerLeft = _elDragLayer$getBound.left;
        var elCopy = document.querySelector(".nestable-" + this.group + " .nestable-drag-layer > .nestable-list");
        if (!this.elCopyStyles) {
          var offset = getOffsetRect(this.el);
          this.elCopyStyles = _objectSpread2({
            marginTop: "".concat(offset.top - clientY - dragLayerTop, "px"),
            marginLeft: "".concat(offset.left - clientX - dragLayerLeft, "px")
          }, transformProps);
        } else {
          this.elCopyStyles = _objectSpread2(_objectSpread2({}, this.elCopyStyles), transformProps);
          if (elCopy) {
            for (var key in transformProps) {
              if (Object.prototype.hasOwnProperty.call(transformProps, key)) {
                elCopy.style[key] = transformProps[key];
              }
            }
          }
          var diffX = this.rtl ? this.mouse.last.x - clientX : clientX - this.mouse.last.x;
          if (diffX >= 0 && this.mouse.shift.x >= 0 || diffX <= 0 && this.mouse.shift.x <= 0) {
            this.mouse.shift.x += diffX;
          } else {
            this.mouse.shift.x = 0;
          }
          this.mouse.last.x = clientX;
          if (Math.abs(this.mouse.shift.x) > this.threshold) {
            if (this.mouse.shift.x > 0) {
              this.tryIncreaseDepth(this.dragItem);
            } else {
              this.tryDecreaseDepth(this.dragItem);
            }
            this.mouse.shift.x = 0;
          }
        }
      },
      moveItem: function moveItem(_ref) {
        var dragItem = _ref.dragItem, pathFrom = _ref.pathFrom, pathTo = _ref.pathTo;
        var realPathTo = this.getRealNextPath(pathFrom, pathTo);
        var removePath = this.getSplicePath(pathFrom, {
          numToRemove: 1,
          childrenProp: this.childrenProp
        });
        var insertPath = this.getSplicePath(realPathTo, {
          numToRemove: 0,
          itemsToInsert: [dragItem],
          childrenProp: this.childrenProp
        });
        if (!this.hook("beforeMove", {
          dragItem,
          pathFrom,
          pathTo: realPathTo
        }))
          return;
        var items = this.value;
        items = update(items, removePath);
        items = update(items, insertPath);
        this.isDirty = true;
        this.pathTo = realPathTo;
        this.$emit("input", items);
      },
      tryIncreaseDepth: function tryIncreaseDepth(dragItem) {
        var pathFrom = this.getPathById(dragItem[this.keyProp]);
        var itemIndex = pathFrom[pathFrom.length - 1];
        var newDepth = pathFrom.length + this.getItemDepth(dragItem);
        if (itemIndex > 0 && newDepth <= this.maxDepth) {
          var prevSibling = this.getItemByPath(pathFrom.slice(0, -1).concat(itemIndex - 1));
          if (prevSibling[this.childrenProp] && (!prevSibling[this.childrenProp].length || !this.isCollapsed(prevSibling))) {
            var pathTo = pathFrom.slice(0, -1).concat(itemIndex - 1).concat(prevSibling[this.childrenProp].length);
            this.moveItem({
              dragItem,
              pathFrom,
              pathTo
            });
          }
        }
      },
      tryDecreaseDepth: function tryDecreaseDepth(dragItem) {
        var pathFrom = this.getPathById(dragItem[this.keyProp]);
        var itemIndex = pathFrom[pathFrom.length - 1];
        if (pathFrom.length > 1) {
          var parent = this.getItemByPath(pathFrom.slice(0, -1));
          if (itemIndex + 1 === parent[this.childrenProp].length) {
            var pathTo = pathFrom.slice(0, -1);
            pathTo[pathTo.length - 1] += 1;
            this.moveItem({
              dragItem,
              pathFrom,
              pathTo
            });
          }
        }
      },
      onMouseEnter: function onMouseEnter(event, eventList, item) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        var dragItem = this.dragItem;
        if (!dragItem)
          return;
        if (item !== null && dragItem[this.keyProp] === item[this.keyProp])
          return;
        var pathFrom = this.getPathById(dragItem[this.keyProp]);
        if (eventList !== this.listId && pathFrom.length === 0)
          return;
        var pathTo;
        if (item === null) {
          pathTo = pathFrom.length > 0 ? [] : [0];
        } else {
          pathTo = this.getPathById(item[this.keyProp]);
        }
        var newDepth = this.getRealNextPath(pathFrom, pathTo).length + (this.getItemDepth(dragItem) - 1);
        if (newDepth > this.maxDepth) {
          return;
        }
        var collapseProps = {};
        if (this.collapsed && pathFrom.length > 1) {
          var parent = this.getItemByPath(pathFrom.slice(0, -1));
          if (parent[this.childrenProp].length === 1) {
            collapseProps = this.onToggleCollapse(parent, true);
          }
        }
        this.moveItem({
          dragItem,
          pathFrom,
          pathTo
        }, collapseProps);
      },
      isCollapsed: function isCollapsed(item) {
        return !!(this.collapsedGroups.indexOf(item[this.keyProp]) > -1 ^ this.collapsed);
      },
      dragApply: function dragApply() {
        this.$emit("change", this.dragItem, {
          items: this.value,
          pathTo: this.pathTo
        });
        this.pathTo = null;
        this.itemsOld = null;
        this.dragItem = null;
        this.isDirty = false;
      },
      dragRevert: function dragRevert() {
        this.$emit("input", this.itemsOld);
        this.pathTo = null;
        this.itemsOld = null;
        this.dragItem = null;
        this.isDirty = false;
      }
    }
  };
  var __vue_script__$2 = script$2;
  var __vue_render__$2 = function __vue_render__2() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", {
      class: ["nestable", "nestable-" + _vm.group, _vm.rtl ? "nestable-rtl" : ""]
    }, [_c("ol", {
      staticClass: "nestable-list nestable-group"
    }, [_vm.listIsEmpty ? _c("Placeholder", {
      attrs: {
        "options": _vm.itemOptions
      }
    }, [_vm._t("placeholder", [_vm._v("\n        No content\n      ")])], 2) : _vm._e(), _vm._v(" "), _vm._l(_vm.value, function(item, index2) {
      return [_c("NestableItem", {
        key: item[_vm.keyProp],
        attrs: {
          "index": index2,
          "item": item,
          "options": _vm.itemOptions
        },
        scopedSlots: _vm._u([_vm._l(Object.keys(_vm.$scopedSlots), function(slot) {
          return {
            key: slot,
            fn: function fn(scope) {
              return [_vm._t(slot, null, null, scope)];
            }
          };
        })], null, true)
      })];
    })], 2), _vm._v(" "), _vm.dragItem ? [_c("div", {
      staticClass: "nestable-drag-layer"
    }, [_c("ol", {
      staticClass: "nestable-list",
      style: _vm.listStyles
    }, [_c("NestableItem", {
      attrs: {
        "item": _vm.dragItem,
        "options": _vm.itemOptions,
        "is-copy": true
      },
      scopedSlots: _vm._u([_vm._l(Object.keys(_vm.$scopedSlots), function(slot) {
        return {
          key: slot,
          fn: function fn(scope) {
            return [_vm._t(slot, null, null, scope)];
          }
        };
      })], null, true)
    })], 1)])] : _vm._e()], 2);
  };
  var __vue_staticRenderFns__$2 = [];
  var __vue_inject_styles__$2 = void 0;
  var __vue_scope_id__$2 = void 0;
  var __vue_module_identifier__$2 = void 0;
  var __vue_is_functional_template__$2 = false;
  var __vue_component__$2 = /* @__PURE__ */ normalizeComponent$1({
    render: __vue_render__$2,
    staticRenderFns: __vue_staticRenderFns__$2
  }, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2, __vue_module_identifier__$2, false, void 0, void 0, void 0);
  var script$3 = {
    name: "VueNestableHandle",
    mixins: [groupsObserver],
    props: {
      item: {
        type: Object,
        required: false,
        default: function _default() {
          return {};
        }
      }
    },
    inject: ["group", "onDragEnd"],
    methods: {
      dragstart: function dragstart(event) {
        var item = this.item || this.$parent.item;
        this.notifyDragStart(this.group, event, item);
      },
      touchend: function touchend(event) {
        this.onDragEnd(event);
      },
      touchmove: function touchmove(event) {
        this.notifyMouseMove(this.group, event);
      }
    }
  };
  var __vue_script__$3 = script$3;
  var __vue_render__$3 = function __vue_render__2() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", {
      staticClass: "nestable-handle",
      attrs: {
        "draggable": ""
      },
      on: {
        "dragstart": _vm.dragstart,
        "touchstart": _vm.dragstart,
        "touchend": _vm.touchend,
        "touchmove": _vm.touchmove
      }
    }, [_vm._t("default")], 2);
  };
  var __vue_staticRenderFns__$3 = [];
  var __vue_inject_styles__$3 = void 0;
  var __vue_scope_id__$3 = void 0;
  var __vue_module_identifier__$3 = void 0;
  var __vue_is_functional_template__$3 = false;
  var __vue_component__$3 = /* @__PURE__ */ normalizeComponent$1({
    render: __vue_render__$3,
    staticRenderFns: __vue_staticRenderFns__$3
  }, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3, __vue_module_identifier__$3, false, void 0, void 0, void 0);
  var index = {
    install: function install(Vue, options) {
      Vue.component("VueNestable", __vue_component__$2);
      Vue.component("VueNestableHandle", __vue_component__$3);
    }
  };
  var render$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { staticClass: "k-tiller-item" }, [_c("div", { staticClass: "k-item-cardlet" }, [_c("div", { staticClass: "k-item-handle" }, [_c("vue-nestable-handle", { attrs: { "item": _vm.item } }, [_c("svg", { staticClass: "k-handle-icon", attrs: { "viewBox": "0 0 256 512", "xmlns": "http://www.w3.org/2000/svg" } }, [_c("path", { attrs: { "d": "M32 96C32 78.33 46.33 64 64 64C81.67 64 96 78.33 96 96C96 113.7 81.67 128 64 128C46.33 128 32 113.7 32 96zM32 256C32 238.3 46.33 224 64 224C81.67 224 96 238.3 96 256C96 273.7 81.67 288 64 288C46.33 288 32 273.7 32 256zM96 416C96 433.7 81.67 448 64 448C46.33 448 32 433.7 32 416C32 398.3 46.33 384 64 384C81.67 384 96 398.3 96 416zM160 96C160 78.33 174.3 64 192 64C209.7 64 224 78.33 224 96C224 113.7 209.7 128 192 128C174.3 128 160 113.7 160 96zM224 256C224 273.7 209.7 288 192 288C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224C209.7 224 224 238.3 224 256zM160 416C160 398.3 174.3 384 192 384C209.7 384 224 398.3 224 416C224 433.7 209.7 448 192 448C174.3 448 160 433.7 160 416z" } })])])], 1), _c("div", { staticClass: "k-item-content" }, [_c("div", { staticClass: "k-content-display", on: { "click": _vm.action_edit } }, [_vm.item.image ? _c("k-item-image", { attrs: { "width": "38px", "image": Object.assign(
      {},
      _vm.item.image,
      {
        cover: true,
        ratio: "2/2"
      }
    ) } }) : _vm._e()], 1), _c("div", { staticClass: "k-content-meta", on: { "click": _vm.action_edit } }, [_c("div", { staticClass: "k-meta-title" }, [_vm._v(" " + _vm._s(_vm.item.title) + " "), _vm.item.children.length > 0 ? _c("span", { staticClass: "k-title-suffix" }, [_vm._v(" (" + _vm._s(_vm.item.children.length) + " " + _vm._s(_vm.item.children.length > 1 ? "subpages" : "subpage") + ") ")]) : _vm._e()])]), _c("div", { staticClass: "k-content-action" }, [_c("k-dropdown", { staticClass: "k-item-menu" }, [_c("k-button", { attrs: { "icon": "dots" }, on: { "click": _vm.action_tiller } }), _c("k-dropdown-content", { ref: "dialog_tiller", attrs: { "align": "right" } }, [_c("k-dropdown-item", { on: { "click": function($event) {
      return _vm.action_pages(_vm.item);
    } } }, [_c("div", { staticClass: "k-menu-title" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "page" } }), _c("span", [_vm._v(" Add Pages ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Add pages from the kirby file system as a child to " + _vm._s(_vm.item.title) + " ")])]), _c("k-dropdown-item", { on: { "click": function($event) {
      return _vm.action_files(_vm.item);
    } } }, [_c("div", { staticClass: "k-menu-title" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "file" } }), _c("span", [_vm._v(" Add Files ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Add files from the kirby file system as a child to " + _vm._s(_vm.item.title) + " ")])]), _c("k-dropdown-item", { on: { "click": function($event) {
      return _vm.action_pages(_vm.item);
    } } }, [_c("div", { staticClass: "k-menu-title" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "bolt" } }), _c("span", [_vm._v(" Add Custom ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Add a custom link not from the kirby file system as a child to " + _vm._s(_vm.item.title) + " ")])]), _c("k-dropdown-item", [_c("div", { staticClass: "k-menu-divider" })]), _c("k-dropdown-item", { on: { "click": _vm.action_edit } }, [_c("div", { staticClass: "k-menu-title" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "edit" } }), _c("span", [_vm._v(" Edit Item ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Edit custom fields for this menu item ")])]), _c("k-dropdown-item", { on: { "click": _vm.action_dialog } }, [_c("div", { staticClass: "k-menu-title k-menu-negative" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "trash" } }), _c("span", [_vm._v(" Remove Item ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Remove this item from the menu ")])])], 1)], 1)], 1)])]), _c("k-drawer", { ref: "drawer_edit", attrs: { "icon": "bolt", "title": "Edit " + _vm.item.title } }, [_c("k-form", { attrs: { "fields": Object.assign({}, this.fieldsets) }, model: { value: _vm.item.fields, callback: function($$v) {
      _vm.$set(_vm.item, "fields", $$v);
    }, expression: "item.fields" } })], 1), _c("k-pages-dialog", { ref: "dialog_pages", on: { "submit": _vm.action_kirby } }), _c("k-files-dialog", { ref: "dialog_files", on: { "submit": _vm.action_kirby } }), _c("k-dialog", { ref: "dialog_remove", attrs: { "icon": "trash", "theme": "negative", "submitButton": "Remove" }, on: { "submit": _vm.action_remove } }, [_c("k-text", [_vm._v(" Do you really want to remove "), _c("strong", [_vm._v(_vm._s(_vm.item.title))]), _vm._v("? "), _vm.item.children.length ? _c("div", [_vm._v(" It has the following child menu items: "), _c("br"), _c("br"), _vm._l(_vm.action_flattened(_vm.item.children), function(children, index2) {
      return _c("span", [_vm._v(" " + _vm._s(children.title)), _c("br")]);
    })], 2) : _vm._e()])], 1)], 1);
  };
  var staticRenderFns$1 = [];
  render$1._withStripped = true;
  var tiller_vue_vue_type_style_index_0_scoped_true_lang = "";
  function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render2) {
      options.render = render2;
      options.staticRenderFns = staticRenderFns2;
      options._compiled = true;
    }
    if (functionalTemplate) {
      options.functional = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    var hook;
    if (moduleIdentifier) {
      hook = function(context) {
        context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        if (injectStyles) {
          injectStyles.call(this, context);
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      options._ssrRegister = hook;
    } else if (injectStyles) {
      hook = shadowMode ? function() {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        );
      } : injectStyles;
    }
    if (hook) {
      if (options.functional) {
        options._injectStyles = hook;
        var originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const __vue2_script$1 = {
    name: "tiller",
    props: {
      list: {
        type: Array,
        required: true
      },
      item: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true
      },
      fields: {
        type: Object,
        required: true
      },
      fieldsets: {
        type: Object,
        required: false
      },
      pages: {
        type: Object,
        required: true
      },
      files: {
        type: Object,
        required: true
      },
      endpoints: {
        type: Object,
        required: true
      }
    },
    methods: {
      action_edit() {
        this.$refs.drawer_edit.open();
      },
      action_tiller() {
        this.$refs.dialog_tiller.open();
      },
      action_dialog(data) {
        this.$refs.dialog_remove.open();
      },
      action_close() {
        this.$refs.dialog_remove.close();
      },
      action_pages(data) {
        this.$refs.dialog_pages.open({
          multiple: true,
          search: this.pages.search,
          endpoint: this.endpoints.field + "/pages",
          selected: this.pages.selected.map((model) => model.id)
        });
      },
      action_files() {
        this.$refs.dialog_files.open({
          multiple: true,
          search: this.files.search,
          endpoint: this.endpoints.field + "/files",
          selected: this.files.selected.map((model) => model.id)
        });
      },
      action_kirby(data) {
        data.map((item) => {
          this.item.children.push({
            id: this.$helper.string.random(16),
            uuid: item.uuid,
            link: item.link,
            title: item.text,
            url: item.url,
            image: item.image,
            fields: this.fieldsets,
            children: []
          });
        });
      },
      action_remove() {
        this.$emit("action_remove", {
          haystack: this.list,
          needle: this.item.id
        });
        this.action_close();
      },
      action_flattened(data) {
        let children = [];
        return data.map((page) => {
          if (page.children && page.children.length) {
            children.push([...children, ...page.children]);
          }
          return page;
        }).concat(children.length ? this.action_flattened(children) : children);
      }
    }
  };
  const __cssModules$1 = {};
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    __vue2_script$1,
    render$1,
    staticRenderFns$1,
    false,
    __vue2_injectStyles$1,
    "6525219c",
    null,
    null
  );
  function __vue2_injectStyles$1(context) {
    for (let o in __cssModules$1) {
      this[o] = __cssModules$1[o];
    }
  }
  __component__$1.options.__file = "src/components/tiller.vue";
  var tiller = /* @__PURE__ */ function() {
    return __component__$1.exports;
  }();
  var render = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("k-field", { staticClass: "k-form-field k-tiller-field", attrs: { "help": _vm.help, "label": _vm.label, "value": _vm.value, "disabled": _vm.disabled, "required": _vm.required }, scopedSlots: _vm._u([{ key: "options", fn: function() {
      return [_c("k-dropdown", { staticClass: "k-tiller-menu" }, [_c("k-button", { attrs: { "icon": "dots" }, on: { "click": _vm.action_tiller } }), _c("k-dropdown-content", { ref: "dialog_tiller", attrs: { "align": "right" } }, [_c("k-dropdown-item", { on: { "click": _vm.action_pages } }, [_c("div", { staticClass: "k-menu-title" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "page" } }), _c("span", [_vm._v(" Add Pages ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Add pages from the kirby file system ")])]), _c("k-dropdown-item", { on: { "click": _vm.action_files } }, [_c("div", { staticClass: "k-menu-title" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "file" } }), _c("span", [_vm._v(" Add Files ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Add files from the kirby file system ")])]), _c("k-dropdown-item", { on: { "click": _vm.action_custom } }, [_c("div", { staticClass: "k-menu-title" }, [_c("k-icon", { staticClass: "k-menu-icon", attrs: { "type": "bolt" } }), _c("span", [_vm._v(" Add Custom ")])], 1), _c("p", { staticClass: "k-menu-text" }, [_vm._v(" Add a custom link not from the kirby file system ")])])], 1)], 1)];
    }, proxy: true }]) }, [_c("vue-nestable", { attrs: { "keyProp": "id", "childrenProp": "children" }, scopedSlots: _vm._u([{ key: "default", fn: function(ref) {
      var item = ref.item;
      var index2 = ref.index;
      return [_c("tiller", { key: index2, attrs: { "item": item, "list": _vm.list, "index": index2, "pages": _vm.pages, "files": _vm.files, "fields": _vm.fields, "fieldsets": _vm.fieldsets, "endpoints": _vm.endpoints }, on: { "action_remove": _vm.action_remove }, scopedSlots: _vm._u([{ key: "handle", fn: function() {
        return [_c("vue-nestable-handle", { attrs: { "item": item } }, [_c("svg", { attrs: { "viewBox": "0 0 256 512", "xmlns": "http://www.w3.org/2000/svg" } }, [_c("path", { attrs: { "d": "M32 96C32 78.33 46.33 64 64 64C81.67 64 96 78.33 96 96C96 113.7 81.67 128 64 128C46.33 128 32 113.7 32 96zM32 256C32 238.3 46.33 224 64 224C81.67 224 96 238.3 96 256C96 273.7 81.67 288 64 288C46.33 288 32 273.7 32 256zM96 416C96 433.7 81.67 448 64 448C46.33 448 32 433.7 32 416C32 398.3 46.33 384 64 384C81.67 384 96 398.3 96 416zM160 96C160 78.33 174.3 64 192 64C209.7 64 224 78.33 224 96C224 113.7 209.7 128 192 128C174.3 128 160 113.7 160 96zM224 256C224 273.7 209.7 288 192 288C174.3 288 160 273.7 160 256C160 238.3 174.3 224 192 224C209.7 224 224 238.3 224 256zM160 416C160 398.3 174.3 384 192 384C209.7 384 224 398.3 224 416C224 433.7 209.7 448 192 448C174.3 448 160 433.7 160 416z" } })])])];
      }, proxy: true }], null, true) })];
    } }]), model: { value: _vm.list, callback: function($$v) {
      _vm.list = $$v;
    }, expression: "list" } }, [_c("k-empty", { attrs: { "slot": "placeholder", "icon": "bolt" }, on: { "click": _vm.action_tiller }, slot: "placeholder" }, [_vm._v(" No menu items ")])], 1), _c("k-pages-dialog", { ref: "dialog_pages", on: { "submit": _vm.action_kirby } }), _c("k-files-dialog", { ref: "dialog_files", on: { "submit": _vm.action_kirby } }), _c("k-form-dialog", { ref: "dialog_custom", on: { "submit": _vm.action_kirby } })], 1);
  };
  var staticRenderFns = [];
  render._withStripped = true;
  var field_vue_vue_type_style_index_0_lang = "";
  const __vue2_script = {
    props: {
      value: {
        type: Array,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        required: false
      },
      required: {
        type: Boolean,
        required: false
      },
      endpoints: {
        type: Object,
        required: true
      },
      fields: {
        type: Object,
        required: false
      },
      fieldsets: {
        type: Object,
        required: false
      },
      pages: {
        type: Object,
        required: true
      },
      files: {
        type: Object,
        required: true
      }
    },
    components: {
      tiller
    },
    data() {
      return {
        list: this.value
      };
    },
    watch: {
      list: {
        handler(newVal, oldVal) {
          this.value = this.list;
          this.$emit("input", this.value);
        },
        deep: true
      }
    },
    methods: {
      action_tiller() {
        this.$refs.dialog_tiller.open({
          state: true
        });
      },
      action_custom() {
        this.$refs.dialog_custom.open({
          state: true
        });
      },
      action_pages() {
        this.$refs.dialog_pages.open({
          multiple: true,
          search: this.pages.search,
          endpoint: this.endpoints.field + "/pages",
          selected: this.pages.selected.map((model) => model.id)
        });
      },
      action_files() {
        this.$refs.dialog_files.open({
          multiple: true,
          search: this.files.search,
          endpoint: this.endpoints.field + "/files",
          selected: this.files.selected.map((model) => model.id)
        });
      },
      action_kirby(data) {
        data.map((item) => {
          this.list.push({
            id: this.$helper.string.random(16),
            uuid: item.uuid,
            link: item.link,
            title: item.text,
            url: item.url,
            image: item.image,
            fields: this.fields,
            children: []
          });
        });
      },
      action_remove(data) {
        return this.list = data.haystack.filter((item) => item.id !== data.needle).map((item) => {
          if (item.children && item.children.length) {
            item.children = this.action_remove({
              haystack: item.children,
              needle: data.needle
            });
          }
          return item;
        });
      }
    }
  };
  const __cssModules = {};
  var __component__ = /* @__PURE__ */ normalizeComponent(
    __vue2_script,
    render,
    staticRenderFns,
    false,
    __vue2_injectStyles,
    null,
    null,
    null
  );
  function __vue2_injectStyles(context) {
    for (let o in __cssModules) {
      this[o] = __cssModules[o];
    }
  }
  __component__.options.__file = "src/field.vue";
  var field = /* @__PURE__ */ function() {
    return __component__.exports;
  }();
  panel.plugin("beluga/tiller", {
    fields: {
      tiller: field
    },
    use: {
      nestable: index,
      plugin(Vue) {
        if (window && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
          window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue;
        }
      }
    }
  });
})();
