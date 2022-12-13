
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children$1(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop$1;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.54.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var noop = {value: () => {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames$1(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames$1(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get$1(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set$1(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    // Given something array like (or null), returns something that is strictly an
    // array. This is used to ensure that array-like objects passed to d3.selectAll
    // or selection.selectAll are converted into proper arrays when creating a
    // selection; we don’t ever want to create a selection backed by a live
    // HTMLCollection or NodeList. However, note that selection.selectAll will use a
    // static NodeList as a group, since it safely derived from querySelectorAll.
    function array(x) {
      return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
    }

    function empty() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty : function() {
        return this.querySelectorAll(selector);
      };
    }

    function arrayAll(select) {
      return function() {
        return array(select.apply(this, arguments));
      };
    }

    function selection_selectAll(select) {
      if (typeof select === "function") select = arrayAll(select);
      else select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection$1(subgroups, parents);
    }

    function matcher(selector) {
      return function() {
        return this.matches(selector);
      };
    }

    function childMatcher(selector) {
      return function(node) {
        return node.matches(selector);
      };
    }

    var find = Array.prototype.find;

    function childFind(match) {
      return function() {
        return find.call(this.children, match);
      };
    }

    function childFirst() {
      return this.firstElementChild;
    }

    function selection_selectChild(match) {
      return this.select(match == null ? childFirst
          : childFind(typeof match === "function" ? match : childMatcher(match)));
    }

    var filter = Array.prototype.filter;

    function children() {
      return Array.from(this.children);
    }

    function childrenFilter(match) {
      return function() {
        return filter.call(this.children, match);
      };
    }

    function selection_selectChildren(match) {
      return this.selectAll(match == null ? children
          : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
    }

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection$1(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection$1(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant$2(x) {
      return function() {
        return x;
      };
    }

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = new Map,
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
          if (nodeByKeyValue.has(keyValue)) {
            exit[i] = node;
          } else {
            nodeByKeyValue.set(keyValue, node);
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue.delete(keyValue);
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
          exit[i] = node;
        }
      }
    }

    function datum(node) {
      return node.__data__;
    }

    function selection_data(value, key) {
      if (!arguments.length) return Array.from(this, datum);

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant$2(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection$1(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    // Given some data, this returns an array-like view of it: an object that
    // exposes a length property and allows numeric indexing. Note that unlike
    // selectAll, this isn’t worried about “live” collections because the resulting
    // array will only be used briefly while data is being bound. (It is possible to
    // cause the data to change while iterating by using a key function, but please
    // don’t; we’d rather avoid a gratuitous copy.)
    function arraylike(data) {
      return typeof data === "object" && "length" in data
        ? data // Array, TypedArray, NodeList, array-like
        : Array.from(data); // Map, Set, iterable, string, or anything else
    }

    function selection_exit() {
      return new Selection$1(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_join(onenter, onupdate, onexit) {
      var enter = this.enter(), update = this, exit = this.exit();
      if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
      } else {
        enter = enter.append(onenter + "");
      }
      if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
      }
      if (onexit == null) exit.remove(); else onexit(exit);
      return enter && update ? enter.merge(update).order() : update;
    }

    function selection_merge(context) {
      var selection = context.selection ? context.selection() : context;

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection$1(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection$1(sortgroups, this._parents).order();
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      return Array.from(this);
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      let size = 0;
      for (const node of this) ++size; // eslint-disable-line no-unused-vars
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove$1(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS$1(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant$1(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS$1(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction$1(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS$1(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS$1 : attrRemove$1) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS$1 : attrFunction$1)
          : (fullname.local ? attrConstantNS$1 : attrConstant$1)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove$1(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant$1(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction$1(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove$1 : typeof value === "function"
                ? styleFunction$1
                : styleConstant$1)(name, value, priority == null ? "" : priority))
          : styleValue(this.node(), name);
    }

    function styleValue(node, name) {
      return node.style.getPropertyValue(name)
          || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant$1(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction$1(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction$1
              : textConstant$1)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_cloneShallow() {
      var clone = this.cloneNode(false), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_cloneDeep() {
      var clone = this.cloneNode(true), parent = this.parentNode;
      return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
    }

    function selection_clone(deep) {
      return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    function contextListener(listener) {
      return function(event) {
        listener.call(this, event, this.__data__);
      };
    }

    function parseTypenames(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, options) {
      return function() {
        var on = this.__on, o, listener = contextListener(value);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.options);
            this.addEventListener(o.type, o.listener = listener, o.options = options);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, options);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, options) {
      var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
      return this;
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (typeof event === "function") {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    function* selection_iterator() {
      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) yield node;
        }
      }
    }

    var root = [null];

    function Selection$1(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection$1([[document.documentElement]], root);
    }

    function selection_selection() {
      return this;
    }

    Selection$1.prototype = selection.prototype = {
      constructor: Selection$1,
      select: selection_select,
      selectAll: selection_selectAll,
      selectChild: selection_selectChild,
      selectChildren: selection_selectChildren,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      join: selection_join,
      merge: selection_merge,
      selection: selection_selection,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      clone: selection_clone,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch,
      [Symbol.iterator]: selection_iterator
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection$1([[document.querySelector(selector)]], [document.documentElement])
          : new Selection$1([[selector]], root);
    }

    function sourceEvent(event) {
      let sourceEvent;
      while (sourceEvent = event.sourceEvent) event = sourceEvent;
      return event;
    }

    function pointer(event, node) {
      event = sourceEvent(event);
      if (node === undefined) node = event.currentTarget;
      if (node) {
        var svg = node.ownerSVGElement || node;
        if (svg.createSVGPoint) {
          var point = svg.createSVGPoint();
          point.x = event.clientX, point.y = event.clientY;
          point = point.matrixTransform(node.getScreenCTM().inverse());
          return [point.x, point.y];
        }
        if (node.getBoundingClientRect) {
          var rect = node.getBoundingClientRect();
          return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
        }
      }
      return [event.pageX, event.pageY];
    }

    function selectAll(selector) {
      return typeof selector === "string"
          ? new Selection$1([document.querySelectorAll(selector)], [document.documentElement])
          : new Selection$1([array(selector)], root);
    }

    // These are typically used in conjunction with noevent to ensure that we can
    const nonpassivecapture = {capture: true, passive: false};

    function noevent$1(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    function dragDisable(view) {
      var root = view.document.documentElement,
          selection = select(view).on("dragstart.drag", noevent$1, nonpassivecapture);
      if ("onselectstart" in root) {
        selection.on("selectstart.drag", noevent$1, nonpassivecapture);
      } else {
        root.__noselect = root.style.MozUserSelect;
        root.style.MozUserSelect = "none";
      }
    }

    function yesdrag(view, noclick) {
      var root = view.document.documentElement,
          selection = select(view).on("dragstart.drag", null);
      if (noclick) {
        selection.on("click.drag", noevent$1, nonpassivecapture);
        setTimeout(function() { selection.on("click.drag", null); }, 0);
      }
      if ("onselectstart" in root) {
        selection.on("selectstart.drag", null);
      } else {
        root.style.MozUserSelect = root.__noselect;
        delete root.__noselect;
      }
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`),
        reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`),
        reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`),
        reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`),
        reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`),
        reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHex8: color_formatHex8,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHex8() {
      return this.rgb().formatHex8();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb() {
        return this;
      },
      clamp() {
        return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
      },
      displayable() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatHex8: rgb_formatHex8,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
    }

    function rgb_formatHex8() {
      return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
    }

    function rgb_formatRgb() {
      const a = clampa(this.opacity);
      return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
    }

    function clampa(opacity) {
      return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
    }

    function clampi(value) {
      return Math.max(0, Math.min(255, Math.round(value) || 0));
    }

    function hex(value) {
      value = clampi(value);
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      clamp() {
        return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
      },
      displayable() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl() {
        const a = clampa(this.opacity);
        return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
      }
    }));

    function clamph(value) {
      value = (value || 0) % 360;
      return value < 0 ? value + 360 : value;
    }

    function clampt(value) {
      return Math.max(0, Math.min(1, value || 0));
    }

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant$1 = x => () => x;

    function linear(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant$1(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant$1(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb$1(start, end) {
        var r = color((start = rgb(start)).r, (end = rgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb$1.gamma = rgbGamma;

      return rgb$1;
    })(1);

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function interpolateString(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    var degrees = 180 / Math.PI;

    var identity$1 = {
      translateX: 0,
      translateY: 0,
      rotate: 0,
      skewX: 0,
      scaleX: 1,
      scaleY: 1
    };

    function decompose(a, b, c, d, e, f) {
      var scaleX, scaleY, skewX;
      if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
      if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
      if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
      if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
      return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * degrees,
        skewX: Math.atan(skewX) * degrees,
        scaleX: scaleX,
        scaleY: scaleY
      };
    }

    var svgNode;

    /* eslint-disable no-undef */
    function parseCss(value) {
      const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
      return m.isIdentity ? identity$1 : decompose(m.a, m.b, m.c, m.d, m.e, m.f);
    }

    function parseSvg(value) {
      if (value == null) return identity$1;
      if (!svgNode) svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
      svgNode.setAttribute("transform", value);
      if (!(value = svgNode.transform.baseVal.consolidate())) return identity$1;
      value = value.matrix;
      return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
    }

    function interpolateTransform(parse, pxComma, pxParen, degParen) {

      function pop(s) {
        return s.length ? s.pop() + " " : "";
      }

      function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push("translate(", null, pxComma, null, pxParen);
          q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
        } else if (xb || yb) {
          s.push("translate(" + xb + pxComma + yb + pxParen);
        }
      }

      function rotate(a, b, s, q) {
        if (a !== b) {
          if (a - b > 180) b += 360; else if (b - a > 180) a += 360; // shortest path
          q.push({i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: interpolateNumber(a, b)});
        } else if (b) {
          s.push(pop(s) + "rotate(" + b + degParen);
        }
      }

      function skewX(a, b, s, q) {
        if (a !== b) {
          q.push({i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: interpolateNumber(a, b)});
        } else if (b) {
          s.push(pop(s) + "skewX(" + b + degParen);
        }
      }

      function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
          var i = s.push(pop(s) + "scale(", null, ",", null, ")");
          q.push({i: i - 4, x: interpolateNumber(xa, xb)}, {i: i - 2, x: interpolateNumber(ya, yb)});
        } else if (xb !== 1 || yb !== 1) {
          s.push(pop(s) + "scale(" + xb + "," + yb + ")");
        }
      }

      return function(a, b) {
        var s = [], // string constants and placeholders
            q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function(t) {
          var i = -1, n = q.length, o;
          while (++i < n) s[(o = q[i]).i] = o.x(t);
          return s.join("");
        };
      };
    }

    var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
    var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

    var epsilon2 = 1e-12;

    function cosh(x) {
      return ((x = Math.exp(x)) + 1 / x) / 2;
    }

    function sinh(x) {
      return ((x = Math.exp(x)) - 1 / x) / 2;
    }

    function tanh(x) {
      return ((x = Math.exp(2 * x)) - 1) / (x + 1);
    }

    var interpolateZoom = (function zoomRho(rho, rho2, rho4) {

      // p0 = [ux0, uy0, w0]
      // p1 = [ux1, uy1, w1]
      function zoom(p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2],
            ux1 = p1[0], uy1 = p1[1], w1 = p1[2],
            dx = ux1 - ux0,
            dy = uy1 - uy0,
            d2 = dx * dx + dy * dy,
            i,
            S;

        // Special case for u0 ≅ u1.
        if (d2 < epsilon2) {
          S = Math.log(w1 / w0) / rho;
          i = function(t) {
            return [
              ux0 + t * dx,
              uy0 + t * dy,
              w0 * Math.exp(rho * t * S)
            ];
          };
        }

        // General case.
        else {
          var d1 = Math.sqrt(d2),
              b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1),
              b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1),
              r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0),
              r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
          S = (r1 - r0) / rho;
          i = function(t) {
            var s = t * S,
                coshr0 = cosh(r0),
                u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
            return [
              ux0 + u * dx,
              uy0 + u * dy,
              w0 * coshr0 / cosh(rho * s + r0)
            ];
          };
        }

        i.duration = S * 1000 * rho / Math.SQRT2;

        return i;
      }

      zoom.rho = function(_) {
        var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
        return zoomRho(_1, _2, _4);
      };

      return zoom;
    })(Math.SQRT2, 2, 4);

    var frame = 0, // is an animation frame pending?
        timeout$1 = 0, // is a timeout pending?
        interval = 0, // are any timers active?
        pokeDelay = 1000, // how frequently we check for clock skew
        taskHead,
        taskTail,
        clockLast = 0,
        clockNow = 0,
        clockSkew = 0,
        clock = typeof performance === "object" && performance.now ? performance : Date,
        setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

    function now() {
      return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
    }

    function clearNow() {
      clockNow = 0;
    }

    function Timer() {
      this._call =
      this._time =
      this._next = null;
    }

    Timer.prototype = timer.prototype = {
      constructor: Timer,
      restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && taskTail !== this) {
          if (taskTail) taskTail._next = this;
          else taskHead = this;
          taskTail = this;
        }
        this._call = callback;
        this._time = time;
        sleep();
      },
      stop: function() {
        if (this._call) {
          this._call = null;
          this._time = Infinity;
          sleep();
        }
      }
    };

    function timer(callback, delay, time) {
      var t = new Timer;
      t.restart(callback, delay, time);
      return t;
    }

    function timerFlush() {
      now(); // Get the current time, if not already set.
      ++frame; // Pretend we’ve set an alarm, if we haven’t already.
      var t = taskHead, e;
      while (t) {
        if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
        t = t._next;
      }
      --frame;
    }

    function wake() {
      clockNow = (clockLast = clock.now()) + clockSkew;
      frame = timeout$1 = 0;
      try {
        timerFlush();
      } finally {
        frame = 0;
        nap();
        clockNow = 0;
      }
    }

    function poke() {
      var now = clock.now(), delay = now - clockLast;
      if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
    }

    function nap() {
      var t0, t1 = taskHead, t2, time = Infinity;
      while (t1) {
        if (t1._call) {
          if (time > t1._time) time = t1._time;
          t0 = t1, t1 = t1._next;
        } else {
          t2 = t1._next, t1._next = null;
          t1 = t0 ? t0._next = t2 : taskHead = t2;
        }
      }
      taskTail = t0;
      sleep(time);
    }

    function sleep(time) {
      if (frame) return; // Soonest alarm already set, or will be.
      if (timeout$1) timeout$1 = clearTimeout(timeout$1);
      var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
      if (delay > 24) {
        if (time < Infinity) timeout$1 = setTimeout(wake, time - clock.now() - clockSkew);
        if (interval) interval = clearInterval(interval);
      } else {
        if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
        frame = 1, setFrame(wake);
      }
    }

    function timeout(callback, delay, time) {
      var t = new Timer;
      delay = delay == null ? 0 : +delay;
      t.restart(elapsed => {
        t.stop();
        callback(elapsed + delay);
      }, delay, time);
      return t;
    }

    var emptyOn = dispatch("start", "end", "cancel", "interrupt");
    var emptyTween = [];

    var CREATED = 0;
    var SCHEDULED = 1;
    var STARTING = 2;
    var STARTED = 3;
    var RUNNING = 4;
    var ENDING = 5;
    var ENDED = 6;

    function schedule(node, name, id, index, group, timing) {
      var schedules = node.__transition;
      if (!schedules) node.__transition = {};
      else if (id in schedules) return;
      create(node, id, {
        name: name,
        index: index, // For context during callback.
        group: group, // For context during callback.
        on: emptyOn,
        tween: emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: CREATED
      });
    }

    function init(node, id) {
      var schedule = get(node, id);
      if (schedule.state > CREATED) throw new Error("too late; already scheduled");
      return schedule;
    }

    function set(node, id) {
      var schedule = get(node, id);
      if (schedule.state > STARTED) throw new Error("too late; already running");
      return schedule;
    }

    function get(node, id) {
      var schedule = node.__transition;
      if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
      return schedule;
    }

    function create(node, id, self) {
      var schedules = node.__transition,
          tween;

      // Initialize the self timer when the transition is created.
      // Note the actual delay is not known until the first callback!
      schedules[id] = self;
      self.timer = timer(schedule, 0, self.time);

      function schedule(elapsed) {
        self.state = SCHEDULED;
        self.timer.restart(start, self.delay, self.time);

        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
      }

      function start(elapsed) {
        var i, j, n, o;

        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== SCHEDULED) return stop();

        for (i in schedules) {
          o = schedules[i];
          if (o.name !== self.name) continue;

          // While this element already has a starting transition during this frame,
          // defer starting an interrupting transition until that transition has a
          // chance to tick (and possibly end); see d3/d3-transition#54!
          if (o.state === STARTED) return timeout(start);

          // Interrupt the active transition, if any.
          if (o.state === RUNNING) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("interrupt", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }

          // Cancel any pre-empted transitions.
          else if (+i < id) {
            o.state = ENDED;
            o.timer.stop();
            o.on.call("cancel", node, node.__data__, o.index, o.group);
            delete schedules[i];
          }
        }

        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        timeout(function() {
          if (self.state === STARTED) {
            self.state = RUNNING;
            self.timer.restart(tick, self.delay, self.time);
            tick(elapsed);
          }
        });

        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = STARTING;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== STARTING) return; // interrupted
        self.state = STARTED;

        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for (i = 0, j = -1; i < n; ++i) {
          if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
            tween[++j] = o;
          }
        }
        tween.length = j + 1;
      }

      function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1),
            i = -1,
            n = tween.length;

        while (++i < n) {
          tween[i].call(node, t);
        }

        // Dispatch the end event.
        if (self.state === ENDING) {
          self.on.call("end", node, node.__data__, self.index, self.group);
          stop();
        }
      }

      function stop() {
        self.state = ENDED;
        self.timer.stop();
        delete schedules[id];
        for (var i in schedules) return; // eslint-disable-line no-unused-vars
        delete node.__transition;
      }
    }

    function interrupt(node, name) {
      var schedules = node.__transition,
          schedule,
          active,
          empty = true,
          i;

      if (!schedules) return;

      name = name == null ? null : name + "";

      for (i in schedules) {
        if ((schedule = schedules[i]).name !== name) { empty = false; continue; }
        active = schedule.state > STARTING && schedule.state < ENDING;
        schedule.state = ENDED;
        schedule.timer.stop();
        schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
      }

      if (empty) delete node.__transition;
    }

    function selection_interrupt(name) {
      return this.each(function() {
        interrupt(this, name);
      });
    }

    function tweenRemove(id, name) {
      var tween0, tween1;
      return function() {
        var schedule = set(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = tween0 = tween;
          for (var i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1 = tween1.slice();
              tween1.splice(i, 1);
              break;
            }
          }
        }

        schedule.tween = tween1;
      };
    }

    function tweenFunction(id, name, value) {
      var tween0, tween1;
      if (typeof value !== "function") throw new Error;
      return function() {
        var schedule = set(this, id),
            tween = schedule.tween;

        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
          tween1 = (tween0 = tween).slice();
          for (var t = {name: name, value: value}, i = 0, n = tween1.length; i < n; ++i) {
            if (tween1[i].name === name) {
              tween1[i] = t;
              break;
            }
          }
          if (i === n) tween1.push(t);
        }

        schedule.tween = tween1;
      };
    }

    function transition_tween(name, value) {
      var id = this._id;

      name += "";

      if (arguments.length < 2) {
        var tween = get(this.node(), id).tween;
        for (var i = 0, n = tween.length, t; i < n; ++i) {
          if ((t = tween[i]).name === name) {
            return t.value;
          }
        }
        return null;
      }

      return this.each((value == null ? tweenRemove : tweenFunction)(id, name, value));
    }

    function tweenValue(transition, name, value) {
      var id = transition._id;

      transition.each(function() {
        var schedule = set(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
      });

      return function(node) {
        return get(node, id).value[name];
      };
    }

    function interpolate(a, b) {
      var c;
      return (typeof b === "number" ? interpolateNumber
          : b instanceof color ? interpolateRgb
          : (c = color(b)) ? (b = c, interpolateRgb)
          : interpolateString)(a, b);
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function attrConstantNS(fullname, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function attrFunction(name, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function attrFunctionNS(fullname, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function transition_attr(name, value) {
      var fullname = namespace(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate;
      return this.attrTween(name, typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)(fullname, i, tweenValue(this, "attr." + name, value))
          : value == null ? (fullname.local ? attrRemoveNS : attrRemove)(fullname)
          : (fullname.local ? attrConstantNS : attrConstant)(fullname, i, value));
    }

    function attrInterpolate(name, i) {
      return function(t) {
        this.setAttribute(name, i.call(this, t));
      };
    }

    function attrInterpolateNS(fullname, i) {
      return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
      };
    }

    function attrTweenNS(fullname, value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolateNS(fullname, i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function attrTween(name, value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && attrInterpolate(name, i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function transition_attrTween(name, value) {
      var key = "attr." + name;
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      var fullname = namespace(name);
      return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
    }

    function delayFunction(id, value) {
      return function() {
        init(this, id).delay = +value.apply(this, arguments);
      };
    }

    function delayConstant(id, value) {
      return value = +value, function() {
        init(this, id).delay = value;
      };
    }

    function transition_delay(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? delayFunction
              : delayConstant)(id, value))
          : get(this.node(), id).delay;
    }

    function durationFunction(id, value) {
      return function() {
        set(this, id).duration = +value.apply(this, arguments);
      };
    }

    function durationConstant(id, value) {
      return value = +value, function() {
        set(this, id).duration = value;
      };
    }

    function transition_duration(value) {
      var id = this._id;

      return arguments.length
          ? this.each((typeof value === "function"
              ? durationFunction
              : durationConstant)(id, value))
          : get(this.node(), id).duration;
    }

    function easeConstant(id, value) {
      if (typeof value !== "function") throw new Error;
      return function() {
        set(this, id).ease = value;
      };
    }

    function transition_ease(value) {
      var id = this._id;

      return arguments.length
          ? this.each(easeConstant(id, value))
          : get(this.node(), id).ease;
    }

    function easeVarying(id, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (typeof v !== "function") throw new Error;
        set(this, id).ease = v;
      };
    }

    function transition_easeVarying(value) {
      if (typeof value !== "function") throw new Error;
      return this.each(easeVarying(this._id, value));
    }

    function transition_filter(match) {
      if (typeof match !== "function") match = matcher(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Transition(subgroups, this._parents, this._name, this._id);
    }

    function transition_merge(transition) {
      if (transition._id !== this._id) throw new Error;

      for (var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Transition(merges, this._parents, this._name, this._id);
    }

    function start(name) {
      return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
      });
    }

    function onFunction(id, name, listener) {
      var on0, on1, sit = start(name) ? init : set;
      return function() {
        var schedule = sit(this, id),
            on = schedule.on;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);

        schedule.on = on1;
      };
    }

    function transition_on(name, listener) {
      var id = this._id;

      return arguments.length < 2
          ? get(this.node(), id).on.on(name)
          : this.each(onFunction(id, name, listener));
    }

    function removeFunction(id) {
      return function() {
        var parent = this.parentNode;
        for (var i in this.__transition) if (+i !== id) return;
        if (parent) parent.removeChild(this);
      };
    }

    function transition_remove() {
      return this.on("end.remove", removeFunction(this._id));
    }

    function transition_select(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
            schedule(subgroup[i], name, id, i, subgroup, get(node, id));
          }
        }
      }

      return new Transition(subgroups, this._parents, name, id);
    }

    function transition_selectAll(select) {
      var name = this._name,
          id = this._id;

      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            for (var children = select.call(node, node.__data__, i, group), child, inherit = get(node, id), k = 0, l = children.length; k < l; ++k) {
              if (child = children[k]) {
                schedule(child, name, id, k, children, inherit);
              }
            }
            subgroups.push(children);
            parents.push(node);
          }
        }
      }

      return new Transition(subgroups, parents, name, id);
    }

    var Selection = selection.prototype.constructor;

    function transition_selection() {
      return new Selection(this._groups, this._parents);
    }

    function styleNull(name, interpolate) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0 = styleValue(this, name),
            string1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, string10 = string1);
      };
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, interpolate, value1) {
      var string00,
          string1 = value1 + "",
          interpolate0;
      return function() {
        var string0 = styleValue(this, name);
        return string0 === string1 ? null
            : string0 === string00 ? interpolate0
            : interpolate0 = interpolate(string00 = string0, value1);
      };
    }

    function styleFunction(name, interpolate, value) {
      var string00,
          string10,
          interpolate0;
      return function() {
        var string0 = styleValue(this, name),
            value1 = value(this),
            string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
        return string0 === string1 ? null
            : string0 === string00 && string1 === string10 ? interpolate0
            : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
      };
    }

    function styleMaybeRemove(id, name) {
      var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
      return function() {
        var schedule = set(this, id),
            on = schedule.on,
            listener = schedule.value[key] == null ? remove || (remove = styleRemove(name)) : undefined;

        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);

        schedule.on = on1;
      };
    }

    function transition_style(name, value, priority) {
      var i = (name += "") === "transform" ? interpolateTransformCss : interpolate;
      return value == null ? this
          .styleTween(name, styleNull(name, i))
          .on("end.style." + name, styleRemove(name))
        : typeof value === "function" ? this
          .styleTween(name, styleFunction(name, i, tweenValue(this, "style." + name, value)))
          .each(styleMaybeRemove(this._id, name))
        : this
          .styleTween(name, styleConstant(name, i, value), priority)
          .on("end.style." + name, null);
    }

    function styleInterpolate(name, i, priority) {
      return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
      };
    }

    function styleTween(name, value, priority) {
      var t, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && styleInterpolate(name, i, priority);
        return t;
      }
      tween._value = value;
      return tween;
    }

    function transition_styleTween(name, value, priority) {
      var key = "style." + (name += "");
      if (arguments.length < 2) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
      };
    }

    function transition_text(value) {
      return this.tween("text", typeof value === "function"
          ? textFunction(tweenValue(this, "text", value))
          : textConstant(value == null ? "" : value + ""));
    }

    function textInterpolate(i) {
      return function(t) {
        this.textContent = i.call(this, t);
      };
    }

    function textTween(value) {
      var t0, i0;
      function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && textInterpolate(i);
        return t0;
      }
      tween._value = value;
      return tween;
    }

    function transition_textTween(value) {
      var key = "text";
      if (arguments.length < 1) return (key = this.tween(key)) && key._value;
      if (value == null) return this.tween(key, null);
      if (typeof value !== "function") throw new Error;
      return this.tween(key, textTween(value));
    }

    function transition_transition() {
      var name = this._name,
          id0 = this._id,
          id1 = newId();

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            var inherit = get(node, id0);
            schedule(node, name, id1, i, group, {
              time: inherit.time + inherit.delay + inherit.duration,
              delay: 0,
              duration: inherit.duration,
              ease: inherit.ease
            });
          }
        }
      }

      return new Transition(groups, this._parents, name, id1);
    }

    function transition_end() {
      var on0, on1, that = this, id = that._id, size = that.size();
      return new Promise(function(resolve, reject) {
        var cancel = {value: reject},
            end = {value: function() { if (--size === 0) resolve(); }};

        that.each(function() {
          var schedule = set(this, id),
              on = schedule.on;

          // If this node shared a dispatch with the previous node,
          // just assign the updated shared dispatch and we’re done!
          // Otherwise, copy-on-write.
          if (on !== on0) {
            on1 = (on0 = on).copy();
            on1._.cancel.push(cancel);
            on1._.interrupt.push(cancel);
            on1._.end.push(end);
          }

          schedule.on = on1;
        });

        // The selection was empty, resolve end immediately
        if (size === 0) resolve();
      });
    }

    var id = 0;

    function Transition(groups, parents, name, id) {
      this._groups = groups;
      this._parents = parents;
      this._name = name;
      this._id = id;
    }

    function newId() {
      return ++id;
    }

    var selection_prototype = selection.prototype;

    Transition.prototype = {
      constructor: Transition,
      select: transition_select,
      selectAll: transition_selectAll,
      selectChild: selection_prototype.selectChild,
      selectChildren: selection_prototype.selectChildren,
      filter: transition_filter,
      merge: transition_merge,
      selection: transition_selection,
      transition: transition_transition,
      call: selection_prototype.call,
      nodes: selection_prototype.nodes,
      node: selection_prototype.node,
      size: selection_prototype.size,
      empty: selection_prototype.empty,
      each: selection_prototype.each,
      on: transition_on,
      attr: transition_attr,
      attrTween: transition_attrTween,
      style: transition_style,
      styleTween: transition_styleTween,
      text: transition_text,
      textTween: transition_textTween,
      remove: transition_remove,
      tween: transition_tween,
      delay: transition_delay,
      duration: transition_duration,
      ease: transition_ease,
      easeVarying: transition_easeVarying,
      end: transition_end,
      [Symbol.iterator]: selection_prototype[Symbol.iterator]
    };

    function cubicInOut(t) {
      return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
    }

    var defaultTiming = {
      time: null, // Set on use.
      delay: 0,
      duration: 250,
      ease: cubicInOut
    };

    function inherit(node, id) {
      var timing;
      while (!(timing = node.__transition) || !(timing = timing[id])) {
        if (!(node = node.parentNode)) {
          throw new Error(`transition ${id} not found`);
        }
      }
      return timing;
    }

    function selection_transition(name) {
      var id,
          timing;

      if (name instanceof Transition) {
        id = name._id, name = name._name;
      } else {
        id = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
      }

      for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            schedule(node, name, id, i, group, timing || inherit(node, id));
          }
        }
      }

      return new Transition(groups, this._parents, name, id);
    }

    selection.prototype.interrupt = selection_interrupt;
    selection.prototype.transition = selection_transition;

    var constant = x => () => x;

    function ZoomEvent(type, {
      sourceEvent,
      target,
      transform,
      dispatch
    }) {
      Object.defineProperties(this, {
        type: {value: type, enumerable: true, configurable: true},
        sourceEvent: {value: sourceEvent, enumerable: true, configurable: true},
        target: {value: target, enumerable: true, configurable: true},
        transform: {value: transform, enumerable: true, configurable: true},
        _: {value: dispatch}
      });
    }

    function Transform(k, x, y) {
      this.k = k;
      this.x = x;
      this.y = y;
    }

    Transform.prototype = {
      constructor: Transform,
      scale: function(k) {
        return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
      },
      translate: function(x, y) {
        return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
      },
      apply: function(point) {
        return [point[0] * this.k + this.x, point[1] * this.k + this.y];
      },
      applyX: function(x) {
        return x * this.k + this.x;
      },
      applyY: function(y) {
        return y * this.k + this.y;
      },
      invert: function(location) {
        return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
      },
      invertX: function(x) {
        return (x - this.x) / this.k;
      },
      invertY: function(y) {
        return (y - this.y) / this.k;
      },
      rescaleX: function(x) {
        return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
      },
      rescaleY: function(y) {
        return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
      },
      toString: function() {
        return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
      }
    };

    var identity = new Transform(1, 0, 0);

    transform.prototype = Transform.prototype;

    function transform(node) {
      while (!node.__zoom) if (!(node = node.parentNode)) return identity;
      return node.__zoom;
    }

    function nopropagation(event) {
      event.stopImmediatePropagation();
    }

    function noevent(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    // Ignore right-click, since that should open the context menu.
    // except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
    function defaultFilter(event) {
      return (!event.ctrlKey || event.type === 'wheel') && !event.button;
    }

    function defaultExtent() {
      var e = this;
      if (e instanceof SVGElement) {
        e = e.ownerSVGElement || e;
        if (e.hasAttribute("viewBox")) {
          e = e.viewBox.baseVal;
          return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
        }
        return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
      }
      return [[0, 0], [e.clientWidth, e.clientHeight]];
    }

    function defaultTransform() {
      return this.__zoom || identity;
    }

    function defaultWheelDelta(event) {
      return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
    }

    function defaultTouchable() {
      return navigator.maxTouchPoints || ("ontouchstart" in this);
    }

    function defaultConstrain(transform, extent, translateExtent) {
      var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0],
          dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0],
          dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1],
          dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
      return transform.translate(
        dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
        dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
      );
    }

    function zoom() {
      var filter = defaultFilter,
          extent = defaultExtent,
          constrain = defaultConstrain,
          wheelDelta = defaultWheelDelta,
          touchable = defaultTouchable,
          scaleExtent = [0, Infinity],
          translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]],
          duration = 250,
          interpolate = interpolateZoom,
          listeners = dispatch("start", "zoom", "end"),
          touchstarting,
          touchfirst,
          touchending,
          touchDelay = 500,
          wheelDelay = 150,
          clickDistance2 = 0,
          tapDistance = 10;

      function zoom(selection) {
        selection
            .property("__zoom", defaultTransform)
            .on("wheel.zoom", wheeled, {passive: false})
            .on("mousedown.zoom", mousedowned)
            .on("dblclick.zoom", dblclicked)
          .filter(touchable)
            .on("touchstart.zoom", touchstarted)
            .on("touchmove.zoom", touchmoved)
            .on("touchend.zoom touchcancel.zoom", touchended)
            .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
      }

      zoom.transform = function(collection, transform, point, event) {
        var selection = collection.selection ? collection.selection() : collection;
        selection.property("__zoom", defaultTransform);
        if (collection !== selection) {
          schedule(collection, transform, point, event);
        } else {
          selection.interrupt().each(function() {
            gesture(this, arguments)
              .event(event)
              .start()
              .zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform)
              .end();
          });
        }
      };

      zoom.scaleBy = function(selection, k, p, event) {
        zoom.scaleTo(selection, function() {
          var k0 = this.__zoom.k,
              k1 = typeof k === "function" ? k.apply(this, arguments) : k;
          return k0 * k1;
        }, p, event);
      };

      zoom.scaleTo = function(selection, k, p, event) {
        zoom.transform(selection, function() {
          var e = extent.apply(this, arguments),
              t0 = this.__zoom,
              p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p,
              p1 = t0.invert(p0),
              k1 = typeof k === "function" ? k.apply(this, arguments) : k;
          return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
        }, p, event);
      };

      zoom.translateBy = function(selection, x, y, event) {
        zoom.transform(selection, function() {
          return constrain(this.__zoom.translate(
            typeof x === "function" ? x.apply(this, arguments) : x,
            typeof y === "function" ? y.apply(this, arguments) : y
          ), extent.apply(this, arguments), translateExtent);
        }, null, event);
      };

      zoom.translateTo = function(selection, x, y, p, event) {
        zoom.transform(selection, function() {
          var e = extent.apply(this, arguments),
              t = this.__zoom,
              p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
          return constrain(identity.translate(p0[0], p0[1]).scale(t.k).translate(
            typeof x === "function" ? -x.apply(this, arguments) : -x,
            typeof y === "function" ? -y.apply(this, arguments) : -y
          ), e, translateExtent);
        }, p, event);
      };

      function scale(transform, k) {
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
        return k === transform.k ? transform : new Transform(k, transform.x, transform.y);
      }

      function translate(transform, p0, p1) {
        var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
        return x === transform.x && y === transform.y ? transform : new Transform(transform.k, x, y);
      }

      function centroid(extent) {
        return [(+extent[0][0] + +extent[1][0]) / 2, (+extent[0][1] + +extent[1][1]) / 2];
      }

      function schedule(transition, transform, point, event) {
        transition
            .on("start.zoom", function() { gesture(this, arguments).event(event).start(); })
            .on("interrupt.zoom end.zoom", function() { gesture(this, arguments).event(event).end(); })
            .tween("zoom", function() {
              var that = this,
                  args = arguments,
                  g = gesture(that, args).event(event),
                  e = extent.apply(that, args),
                  p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point,
                  w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]),
                  a = that.__zoom,
                  b = typeof transform === "function" ? transform.apply(that, args) : transform,
                  i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
              return function(t) {
                if (t === 1) t = b; // Avoid rounding error on end.
                else { var l = i(t), k = w / l[2]; t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k); }
                g.zoom(null, t);
              };
            });
      }

      function gesture(that, args, clean) {
        return (!clean && that.__zooming) || new Gesture(that, args);
      }

      function Gesture(that, args) {
        this.that = that;
        this.args = args;
        this.active = 0;
        this.sourceEvent = null;
        this.extent = extent.apply(that, args);
        this.taps = 0;
      }

      Gesture.prototype = {
        event: function(event) {
          if (event) this.sourceEvent = event;
          return this;
        },
        start: function() {
          if (++this.active === 1) {
            this.that.__zooming = this;
            this.emit("start");
          }
          return this;
        },
        zoom: function(key, transform) {
          if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
          if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
          if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
          this.that.__zoom = transform;
          this.emit("zoom");
          return this;
        },
        end: function() {
          if (--this.active === 0) {
            delete this.that.__zooming;
            this.emit("end");
          }
          return this;
        },
        emit: function(type) {
          var d = select(this.that).datum();
          listeners.call(
            type,
            this.that,
            new ZoomEvent(type, {
              sourceEvent: this.sourceEvent,
              target: zoom,
              type,
              transform: this.that.__zoom,
              dispatch: listeners
            }),
            d
          );
        }
      };

      function wheeled(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var g = gesture(this, args).event(event),
            t = this.__zoom,
            k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))),
            p = pointer(event);

        // If the mouse is in the same location as before, reuse it.
        // If there were recent wheel events, reset the wheel idle timeout.
        if (g.wheel) {
          if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
            g.mouse[1] = t.invert(g.mouse[0] = p);
          }
          clearTimeout(g.wheel);
        }

        // If this wheel event won’t trigger a transform change, ignore it.
        else if (t.k === k) return;

        // Otherwise, capture the mouse point and location at the start.
        else {
          g.mouse = [p, t.invert(p)];
          interrupt(this);
          g.start();
        }

        noevent(event);
        g.wheel = setTimeout(wheelidled, wheelDelay);
        g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));

        function wheelidled() {
          g.wheel = null;
          g.end();
        }
      }

      function mousedowned(event, ...args) {
        if (touchending || !filter.apply(this, arguments)) return;
        var currentTarget = event.currentTarget,
            g = gesture(this, args, true).event(event),
            v = select(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true),
            p = pointer(event, currentTarget),
            x0 = event.clientX,
            y0 = event.clientY;

        dragDisable(event.view);
        nopropagation(event);
        g.mouse = [p, this.__zoom.invert(p)];
        interrupt(this);
        g.start();

        function mousemoved(event) {
          noevent(event);
          if (!g.moved) {
            var dx = event.clientX - x0, dy = event.clientY - y0;
            g.moved = dx * dx + dy * dy > clickDistance2;
          }
          g.event(event)
           .zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
        }

        function mouseupped(event) {
          v.on("mousemove.zoom mouseup.zoom", null);
          yesdrag(event.view, g.moved);
          noevent(event);
          g.event(event).end();
        }
      }

      function dblclicked(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var t0 = this.__zoom,
            p0 = pointer(event.changedTouches ? event.changedTouches[0] : event, this),
            p1 = t0.invert(p0),
            k1 = t0.k * (event.shiftKey ? 0.5 : 2),
            t1 = constrain(translate(scale(t0, k1), p0, p1), extent.apply(this, args), translateExtent);

        noevent(event);
        if (duration > 0) select(this).transition().duration(duration).call(schedule, t1, p0, event);
        else select(this).call(zoom.transform, t1, p0, event);
      }

      function touchstarted(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var touches = event.touches,
            n = touches.length,
            g = gesture(this, args, event.changedTouches.length === n).event(event),
            started, i, t, p;

        nopropagation(event);
        for (i = 0; i < n; ++i) {
          t = touches[i], p = pointer(t, this);
          p = [p, this.__zoom.invert(p), t.identifier];
          if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
          else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
        }

        if (touchstarting) touchstarting = clearTimeout(touchstarting);

        if (started) {
          if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() { touchstarting = null; }, touchDelay);
          interrupt(this);
          g.start();
        }
      }

      function touchmoved(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event),
            touches = event.changedTouches,
            n = touches.length, i, t, p, l;

        noevent(event);
        for (i = 0; i < n; ++i) {
          t = touches[i], p = pointer(t, this);
          if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
          else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
        }
        t = g.that.__zoom;
        if (g.touch1) {
          var p0 = g.touch0[0], l0 = g.touch0[1],
              p1 = g.touch1[0], l1 = g.touch1[1],
              dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp,
              dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
          t = scale(t, Math.sqrt(dp / dl));
          p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
          l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
        }
        else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
        else return;

        g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
      }

      function touchended(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event),
            touches = event.changedTouches,
            n = touches.length, i, t;

        nopropagation(event);
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() { touchending = null; }, touchDelay);
        for (i = 0; i < n; ++i) {
          t = touches[i];
          if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
          else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
        }
        if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
        if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
        else {
          g.end();
          // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
          if (g.taps === 2) {
            t = pointer(t, this);
            if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
              var p = select(this).on("dblclick.zoom");
              if (p) p.apply(this, arguments);
            }
          }
        }
      }

      zoom.wheelDelta = function(_) {
        return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant(+_), zoom) : wheelDelta;
      };

      zoom.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), zoom) : filter;
      };

      zoom.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), zoom) : touchable;
      };

      zoom.extent = function(_) {
        return arguments.length ? (extent = typeof _ === "function" ? _ : constant([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
      };

      zoom.scaleExtent = function(_) {
        return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
      };

      zoom.translateExtent = function(_) {
        return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
      };

      zoom.constrain = function(_) {
        return arguments.length ? (constrain = _, zoom) : constrain;
      };

      zoom.duration = function(_) {
        return arguments.length ? (duration = +_, zoom) : duration;
      };

      zoom.interpolate = function(_) {
        return arguments.length ? (interpolate = _, zoom) : interpolate;
      };

      zoom.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? zoom : value;
      };

      zoom.clickDistance = function(_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
      };

      zoom.tapDistance = function(_) {
        return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
      };

      return zoom;
    }

    /* svelvetrabbit/Edges/EdgeText.svelte generated by Svelte v3.54.0 */

    const file$7 = "svelvetrabbit/Edges/EdgeText.svelte";

    // (25:0) {:else}
    function create_else_block$2(ctx) {
    	let g;
    	let rect;
    	let rect_fill_value;
    	let rect_x_value;
    	let rect_y_value;
    	let text_1;
    	let t;
    	let text_1_fill_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			rect = svg_element("rect");
    			text_1 = svg_element("text");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(rect, "class", "EdgeTextBg");
    			attr_dev(rect, "data-testid", "edge-text-bg");

    			attr_dev(rect, "fill", rect_fill_value = /*labelBgColor*/ ctx[5]
    			? /*labelBgColor*/ ctx[5]
    			: 'white');

    			attr_dev(rect, "x", rect_x_value = /*textCenterX*/ ctx[3] - /*labelPx*/ ctx[1] / 2);
    			attr_dev(rect, "y", rect_y_value = /*textCenterY*/ ctx[2] - shiftRectY);
    			attr_dev(rect, "width", /*labelPx*/ ctx[1]);
    			attr_dev(rect, "height", 16);
    			add_location(rect, file$7, 26, 4, 779);
    			attr_dev(text_1, "class", "EdgeText");
    			attr_dev(text_1, "x", /*textCenterX*/ ctx[3]);
    			attr_dev(text_1, "y", /*textCenterY*/ ctx[2]);
    			attr_dev(text_1, "font-size", "12px");
    			attr_dev(text_1, "dominant-baseline", "central");
    			attr_dev(text_1, "text-anchor", "middle");

    			attr_dev(text_1, "fill", text_1_fill_value = /*labelTextColor*/ ctx[4]
    			? /*labelTextColor*/ ctx[4]
    			: 'black');

    			add_location(text_1, file$7, 35, 4, 1016);
    			add_location(g, file$7, 25, 2, 771);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, rect);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labelBgColor*/ 32 && rect_fill_value !== (rect_fill_value = /*labelBgColor*/ ctx[5]
    			? /*labelBgColor*/ ctx[5]
    			: 'white')) {
    				attr_dev(rect, "fill", rect_fill_value);
    			}

    			if (dirty & /*textCenterX, labelPx*/ 10 && rect_x_value !== (rect_x_value = /*textCenterX*/ ctx[3] - /*labelPx*/ ctx[1] / 2)) {
    				attr_dev(rect, "x", rect_x_value);
    			}

    			if (dirty & /*textCenterY*/ 4 && rect_y_value !== (rect_y_value = /*textCenterY*/ ctx[2] - shiftRectY)) {
    				attr_dev(rect, "y", rect_y_value);
    			}

    			if (dirty & /*labelPx*/ 2) {
    				attr_dev(rect, "width", /*labelPx*/ ctx[1]);
    			}

    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);

    			if (dirty & /*textCenterX*/ 8) {
    				attr_dev(text_1, "x", /*textCenterX*/ ctx[3]);
    			}

    			if (dirty & /*textCenterY*/ 4) {
    				attr_dev(text_1, "y", /*textCenterY*/ ctx[2]);
    			}

    			if (dirty & /*labelTextColor*/ 16 && text_1_fill_value !== (text_1_fill_value = /*labelTextColor*/ ctx[4]
    			? /*labelTextColor*/ ctx[4]
    			: 'black')) {
    				attr_dev(text_1, "fill", text_1_fill_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(25:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:0) {#if typeof label === 'undefined' || !label}
    function create_if_block$3(ctx) {
    	let t_value = null + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(23:0) {#if typeof label === 'undefined' || !label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*label*/ ctx[0] === 'undefined' || !/*label*/ ctx[0]) return create_if_block$3;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const shiftRectY = 7;

    function instance$b($$self, $$props, $$invalidate) {
    	let label;
    	let labelBgColor;
    	let labelTextColor;
    	let centerX;
    	let centerY;
    	let pxRatio;
    	let textCenterX;
    	let textCenterY;
    	let spaces;
    	let newLength;
    	let labelPx;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EdgeText', slots, []);
    	let { edgeTextProps } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (edgeTextProps === undefined && !('edgeTextProps' in $$props || $$self.$$.bound[$$self.$$.props['edgeTextProps']])) {
    			console.warn("<EdgeText> was created without expected prop 'edgeTextProps'");
    		}
    	});

    	const writable_props = ['edgeTextProps'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EdgeText> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('edgeTextProps' in $$props) $$invalidate(6, edgeTextProps = $$props.edgeTextProps);
    	};

    	$$self.$capture_state = () => ({
    		edgeTextProps,
    		shiftRectY,
    		pxRatio,
    		newLength,
    		labelPx,
    		spaces,
    		label,
    		centerY,
    		textCenterY,
    		centerX,
    		textCenterX,
    		labelTextColor,
    		labelBgColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('edgeTextProps' in $$props) $$invalidate(6, edgeTextProps = $$props.edgeTextProps);
    		if ('pxRatio' in $$props) $$invalidate(7, pxRatio = $$props.pxRatio);
    		if ('newLength' in $$props) $$invalidate(8, newLength = $$props.newLength);
    		if ('labelPx' in $$props) $$invalidate(1, labelPx = $$props.labelPx);
    		if ('spaces' in $$props) $$invalidate(9, spaces = $$props.spaces);
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('centerY' in $$props) $$invalidate(10, centerY = $$props.centerY);
    		if ('textCenterY' in $$props) $$invalidate(2, textCenterY = $$props.textCenterY);
    		if ('centerX' in $$props) $$invalidate(11, centerX = $$props.centerX);
    		if ('textCenterX' in $$props) $$invalidate(3, textCenterX = $$props.textCenterX);
    		if ('labelTextColor' in $$props) $$invalidate(4, labelTextColor = $$props.labelTextColor);
    		if ('labelBgColor' in $$props) $$invalidate(5, labelBgColor = $$props.labelBgColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*edgeTextProps*/ 64) {
    			$$invalidate(0, { label, labelBgColor, labelTextColor, centerX, centerY } = edgeTextProps, label, ($$invalidate(5, labelBgColor), $$invalidate(6, edgeTextProps)), ($$invalidate(4, labelTextColor), $$invalidate(6, edgeTextProps)), ($$invalidate(11, centerX), $$invalidate(6, edgeTextProps)), ($$invalidate(10, centerY), $$invalidate(6, edgeTextProps)));
    		}

    		if ($$self.$$.dirty & /*label*/ 1) {
    			$$invalidate(7, pxRatio = label.length < 3 ? 9 : 7);
    		}

    		if ($$self.$$.dirty & /*centerX*/ 2048) {
    			// determine the center point of the edge to be used in the EdgeText component
    			$$invalidate(3, textCenterX = centerX);
    		}

    		if ($$self.$$.dirty & /*centerY*/ 1024) {
    			$$invalidate(2, textCenterY = centerY);
    		}

    		if ($$self.$$.dirty & /*label*/ 1) {
    			// determine width of rect to render based on label.length (removing spaces)
    			// pxRatio is an estimate of how many pixels 1 character might take up
    			// pxRatio not 100% accurate as font is not monospace
    			$$invalidate(9, spaces = label.split(' ').length - 1);
    		}

    		if ($$self.$$.dirty & /*label, spaces*/ 513) {
    			$$invalidate(8, newLength = label.length - spaces);
    		}

    		if ($$self.$$.dirty & /*newLength, pxRatio*/ 384) {
    			$$invalidate(1, labelPx = newLength * pxRatio);
    		}
    	};

    	return [
    		label,
    		labelPx,
    		textCenterY,
    		textCenterX,
    		labelTextColor,
    		labelBgColor,
    		edgeTextProps,
    		pxRatio,
    		newLength,
    		spaces,
    		centerY,
    		centerX
    	];
    }

    class EdgeText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$b, create_fragment$b, safe_not_equal, { edgeTextProps: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EdgeText",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get edgeTextProps() {
    		throw new Error("<EdgeText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set edgeTextProps(value) {
    		throw new Error("<EdgeText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Edges/BaseEdge.svelte generated by Svelte v3.54.0 */
    const file$6 = "svelvetrabbit/Edges/BaseEdge.svelte";

    // (41:0) {:else}
    function create_else_block$1(ctx) {
    	let path_1;
    	let path_1_class_value;
    	let path_1_stroke_value;

    	const block = {
    		c: function create() {
    			path_1 = svg_element("path");
    			attr_dev(path_1, "class", path_1_class_value = "" + (null_to_empty(/*animate*/ ctx[3] ? 'animate' : '') + " svelte-qtkn5z"));
    			attr_dev(path_1, "d", /*path*/ ctx[4]);
    			attr_dev(path_1, "fill", "transparent");
    			attr_dev(path_1, "stroke", path_1_stroke_value = /*edgeColor*/ ctx[1] ? /*edgeColor*/ ctx[1] : 'gray');
    			attr_dev(path_1, "aria-label", "svg-path");
    			add_location(path_1, file$6, 41, 2, 891);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*animate*/ 8 && path_1_class_value !== (path_1_class_value = "" + (null_to_empty(/*animate*/ ctx[3] ? 'animate' : '') + " svelte-qtkn5z"))) {
    				attr_dev(path_1, "class", path_1_class_value);
    			}

    			if (dirty & /*path*/ 16) {
    				attr_dev(path_1, "d", /*path*/ ctx[4]);
    			}

    			if (dirty & /*edgeColor*/ 2 && path_1_stroke_value !== (path_1_stroke_value = /*edgeColor*/ ctx[1] ? /*edgeColor*/ ctx[1] : 'gray')) {
    				attr_dev(path_1, "stroke", path_1_stroke_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(41:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:0) {#if arrow}
    function create_if_block_1$1(ctx) {
    	let path_1;
    	let path_1_class_value;
    	let path_1_stroke_value;

    	const block = {
    		c: function create() {
    			path_1 = svg_element("path");
    			attr_dev(path_1, "class", path_1_class_value = "" + (null_to_empty(/*animate*/ ctx[3] ? 'animate' : '') + " svelte-qtkn5z"));
    			attr_dev(path_1, "d", /*path*/ ctx[4]);
    			attr_dev(path_1, "fill", "transparent");
    			attr_dev(path_1, "stroke", path_1_stroke_value = /*edgeColor*/ ctx[1] ? /*edgeColor*/ ctx[1] : 'gray');
    			attr_dev(path_1, "marker-end", "url(#arrow)");
    			attr_dev(path_1, "aria-label", "svg-path");
    			add_location(path_1, file$6, 32, 2, 698);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*animate*/ 8 && path_1_class_value !== (path_1_class_value = "" + (null_to_empty(/*animate*/ ctx[3] ? 'animate' : '') + " svelte-qtkn5z"))) {
    				attr_dev(path_1, "class", path_1_class_value);
    			}

    			if (dirty & /*path*/ 16) {
    				attr_dev(path_1, "d", /*path*/ ctx[4]);
    			}

    			if (dirty & /*edgeColor*/ 2 && path_1_stroke_value !== (path_1_stroke_value = /*edgeColor*/ ctx[1] ? /*edgeColor*/ ctx[1] : 'gray')) {
    				attr_dev(path_1, "stroke", path_1_stroke_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(32:0) {#if arrow}",
    		ctx
    	});

    	return block;
    }

    // (51:0) {#if edgeTextProps.label}
    function create_if_block$2(ctx) {
    	let edgetext;
    	let current;

    	edgetext = new EdgeText({
    			props: { edgeTextProps: /*edgeTextProps*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(edgetext.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(edgetext, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const edgetext_changes = {};
    			if (dirty & /*edgeTextProps*/ 1) edgetext_changes.edgeTextProps = /*edgeTextProps*/ ctx[0];
    			edgetext.$set(edgetext_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(edgetext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(edgetext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(edgetext, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(51:0) {#if edgeTextProps.label}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let defs;
    	let marker;
    	let polygon;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*arrow*/ ctx[2]) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*edgeTextProps*/ ctx[0].label && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			defs = svg_element("defs");
    			marker = svg_element("marker");
    			polygon = svg_element("polygon");
    			t0 = space();
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty$1();
    			attr_dev(polygon, "points", /*defaultArrow*/ ctx[5]);
    			attr_dev(polygon, "fill", "gray");
    			add_location(polygon, file$6, 27, 4, 617);
    			attr_dev(marker, "id", "arrow");
    			attr_dev(marker, "markerWidth", "9");
    			attr_dev(marker, "markerHeight", "9");
    			attr_dev(marker, "refX", "8");
    			attr_dev(marker, "refY", "4");
    			attr_dev(marker, "orient", "auto");
    			add_location(marker, file$6, 26, 2, 528);
    			add_location(defs, file$6, 25, 0, 519);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, defs, anchor);
    			append_dev(defs, marker);
    			append_dev(marker, polygon);
    			insert_dev(target, t0, anchor);
    			if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			}

    			if (/*edgeTextProps*/ ctx[0].label) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*edgeTextProps*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(defs);
    			if (detaching) detach_dev(t0);
    			if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let path;
    	let animate;
    	let arrow;
    	let label;
    	let labelBgColor;
    	let labelTextColor;
    	let edgeColor;
    	let centerX;
    	let centerY;
    	let edgeTextProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BaseEdge', slots, []);
    	let { baseEdgeProps } = $$props;
    	const defaultArrow = `0 0, 9 4.5, 0 9`;

    	$$self.$$.on_mount.push(function () {
    		if (baseEdgeProps === undefined && !('baseEdgeProps' in $$props || $$self.$$.bound[$$self.$$.props['baseEdgeProps']])) {
    			console.warn("<BaseEdge> was created without expected prop 'baseEdgeProps'");
    		}
    	});

    	const writable_props = ['baseEdgeProps'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BaseEdge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('baseEdgeProps' in $$props) $$invalidate(6, baseEdgeProps = $$props.baseEdgeProps);
    	};

    	$$self.$capture_state = () => ({
    		EdgeText,
    		baseEdgeProps,
    		defaultArrow,
    		centerY,
    		centerX,
    		labelTextColor,
    		labelBgColor,
    		label,
    		edgeTextProps,
    		edgeColor,
    		arrow,
    		animate,
    		path
    	});

    	$$self.$inject_state = $$props => {
    		if ('baseEdgeProps' in $$props) $$invalidate(6, baseEdgeProps = $$props.baseEdgeProps);
    		if ('centerY' in $$props) $$invalidate(7, centerY = $$props.centerY);
    		if ('centerX' in $$props) $$invalidate(8, centerX = $$props.centerX);
    		if ('labelTextColor' in $$props) $$invalidate(9, labelTextColor = $$props.labelTextColor);
    		if ('labelBgColor' in $$props) $$invalidate(10, labelBgColor = $$props.labelBgColor);
    		if ('label' in $$props) $$invalidate(11, label = $$props.label);
    		if ('edgeTextProps' in $$props) $$invalidate(0, edgeTextProps = $$props.edgeTextProps);
    		if ('edgeColor' in $$props) $$invalidate(1, edgeColor = $$props.edgeColor);
    		if ('arrow' in $$props) $$invalidate(2, arrow = $$props.arrow);
    		if ('animate' in $$props) $$invalidate(3, animate = $$props.animate);
    		if ('path' in $$props) $$invalidate(4, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*baseEdgeProps*/ 64) {
    			// destructuring the props passed in from the parent component
    			$$invalidate(4, { path, animate, arrow, label, labelBgColor, labelTextColor, edgeColor, centerX, centerY } = baseEdgeProps, path, ($$invalidate(3, animate), $$invalidate(6, baseEdgeProps)), ($$invalidate(2, arrow), $$invalidate(6, baseEdgeProps)), ($$invalidate(11, label), $$invalidate(6, baseEdgeProps)), ($$invalidate(10, labelBgColor), $$invalidate(6, baseEdgeProps)), ($$invalidate(9, labelTextColor), $$invalidate(6, baseEdgeProps)), ($$invalidate(1, edgeColor), $$invalidate(6, baseEdgeProps)), ($$invalidate(8, centerX), $$invalidate(6, baseEdgeProps)), ($$invalidate(7, centerY), $$invalidate(6, baseEdgeProps)));
    		}

    		if ($$self.$$.dirty & /*label, labelBgColor, labelTextColor, centerX, centerY*/ 3968) {
    			// setting edge text props
    			$$invalidate(0, edgeTextProps = {
    				label,
    				labelBgColor,
    				labelTextColor,
    				centerX,
    				centerY
    			});
    		}
    	};

    	return [
    		edgeTextProps,
    		edgeColor,
    		arrow,
    		animate,
    		path,
    		defaultArrow,
    		baseEdgeProps,
    		centerY,
    		centerX,
    		labelTextColor,
    		labelBgColor,
    		label
    	];
    }

    class BaseEdge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$a, create_fragment$a, safe_not_equal, { baseEdgeProps: 6 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BaseEdge",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get baseEdgeProps() {
    		throw new Error("<BaseEdge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseEdgeProps(value) {
    		throw new Error("<BaseEdge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // enumerable values (static) set for Position
    var Position;
    (function (Position) {
        Position["Left"] = "left";
        Position["Right"] = "right";
        Position["Top"] = "top";
        Position["Bottom"] = "bottom";
    })(Position || (Position = {}));
    //
    // export type CoordinateExtent = [[number, number], [number, number]];

    /* svelvetrabbit/Edges/SimpleBezierEdge.svelte generated by Svelte v3.54.0 */

    function create_fragment$9(ctx) {
    	let baseedge;
    	let current;

    	baseedge = new BaseEdge({
    			props: { baseEdgeProps: /*baseEdgeProps*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(baseedge.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(baseedge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const baseedge_changes = {};
    			if (dirty & /*baseEdgeProps*/ 1) baseedge_changes.baseEdgeProps = /*baseEdgeProps*/ ctx[0];
    			baseedge.$set(baseedge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baseedge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baseedge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(baseedge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function calculateControlOffset(distance, curvature) {
    	if (distance >= 0) {
    		return 0.5 * distance;
    	} else {
    		return curvature * 25 * Math.sqrt(-distance);
    	}
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let params;
    	let path;
    	let centerX;
    	let centerY;
    	let baseEdgeProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SimpleBezierEdge', slots, []);

    	function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
    		let ctX, ctY;

    		switch (pos) {
    			case Position.Left:
    				{
    					ctX = x1 - calculateControlOffset(x1 - x2, c);
    					ctY = y1;
    				}
    				break;
    			case Position.Right:
    				{
    					ctX = x1 + calculateControlOffset(x2 - x1, c);
    					ctY = y1;
    				}
    				break;
    			case Position.Top:
    				{
    					ctX = x1;
    					ctY = y1 - calculateControlOffset(y1 - y2, c);
    				}
    				break;
    			case Position.Bottom:
    				{
    					ctX = x1;
    					ctY = y1 + calculateControlOffset(y2 - y1, c);
    				}
    				break;
    		}

    		return [ctX, ctY];
    	}

    	// returns string to pass into edge 'path' svg d attribute (where to be drawn)
    	// referenced from ReactFlow.dev
    	function getSimpleBezierPath(
    		{ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25 }
    	) {
    		const [sourceControlX, sourceControlY] = getControlWithCurvature({
    			pos: sourcePosition,
    			x1: sourceX,
    			y1: sourceY,
    			x2: targetX,
    			y2: targetY,
    			c: curvature
    		});

    		const [targetControlX, targetControlY] = getControlWithCurvature({
    			pos: targetPosition,
    			x1: targetX,
    			y1: targetY,
    			x2: sourceX,
    			y2: sourceY,
    			c: curvature
    		});

    		return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
    	}

    	// determining center of the bezier curve to know where to place the bezier edge text label
    	function getSimpleBezierCenter(
    		{ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25 }
    	) {
    		const [sourceControlX, sourceControlY] = getControlWithCurvature({
    			pos: sourcePosition,
    			x1: sourceX,
    			y1: sourceY,
    			x2: targetX,
    			y2: targetY,
    			c: curvature
    		});

    		const [targetControlX, targetControlY] = getControlWithCurvature({
    			pos: targetPosition,
    			x1: targetX,
    			y1: targetY,
    			x2: sourceX,
    			y2: sourceY,
    			c: curvature
    		});

    		// cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
    		// https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
    		const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;

    		const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
    		const xOffset = Math.abs(centerX - sourceX);
    		const yOffset = Math.abs(centerY - sourceY);
    		return [centerX, centerY, xOffset, yOffset];
    	}

    	let { edge } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (edge === undefined && !('edge' in $$props || $$self.$$.bound[$$self.$$.props['edge']])) {
    			console.warn("<SimpleBezierEdge> was created without expected prop 'edge'");
    		}
    	});

    	const writable_props = ['edge'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SimpleBezierEdge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('edge' in $$props) $$invalidate(1, edge = $$props.edge);
    	};

    	$$self.$capture_state = () => ({
    		BaseEdge,
    		Position,
    		calculateControlOffset,
    		getControlWithCurvature,
    		getSimpleBezierPath,
    		getSimpleBezierCenter,
    		edge,
    		centerY,
    		centerX,
    		path,
    		baseEdgeProps,
    		params
    	});

    	$$self.$inject_state = $$props => {
    		if ('edge' in $$props) $$invalidate(1, edge = $$props.edge);
    		if ('centerY' in $$props) $$invalidate(2, centerY = $$props.centerY);
    		if ('centerX' in $$props) $$invalidate(3, centerX = $$props.centerX);
    		if ('path' in $$props) $$invalidate(4, path = $$props.path);
    		if ('baseEdgeProps' in $$props) $$invalidate(0, baseEdgeProps = $$props.baseEdgeProps);
    		if ('params' in $$props) $$invalidate(5, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*edge*/ 2) {
    			$$invalidate(5, params = {
    				sourceX: edge.sourceX,
    				sourceY: edge.sourceY,
    				sourcePosition: edge.sourcePosition,
    				targetX: edge.targetX,
    				targetY: edge.targetY,
    				targetPosition: edge.targetPosition,
    				curvature: 0.25
    			});
    		}

    		if ($$self.$$.dirty & /*params*/ 32) {
    			// pass in params to function that returns a string value for SVG path d attribute (where to be drawn)
    			$$invalidate(4, path = getSimpleBezierPath(params));
    		}

    		if ($$self.$$.dirty & /*params*/ 32) {
    			$$invalidate(3, [centerX, centerY] = getSimpleBezierCenter(params), centerX, (($$invalidate(2, centerY), $$invalidate(5, params)), $$invalidate(1, edge)));
    		}

    		if ($$self.$$.dirty & /*edge, path, centerX, centerY*/ 30) {
    			// pass necessary values to BaseEdge component
    			// BaseEdge renders a 'base' path that can be customized by parent Edge components
    			$$invalidate(0, baseEdgeProps = { ...edge, path, centerX, centerY });
    		}
    	};

    	return [baseEdgeProps, edge, centerY, centerX, path, params];
    }

    class SimpleBezierEdge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$9, create_fragment$9, safe_not_equal, { edge: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimpleBezierEdge",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get edge() {
    		throw new Error("<SimpleBezierEdge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set edge(value) {
    		throw new Error("<SimpleBezierEdge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Edges/StraightEdge.svelte generated by Svelte v3.54.0 */

    function create_fragment$8(ctx) {
    	let baseedge;
    	let current;

    	baseedge = new BaseEdge({
    			props: { baseEdgeProps: /*baseEdgeProps*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(baseedge.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(baseedge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const baseedge_changes = {};
    			if (dirty & /*baseEdgeProps*/ 1) baseedge_changes.baseEdgeProps = /*baseEdgeProps*/ ctx[0];
    			baseedge.$set(baseedge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baseedge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baseedge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(baseedge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let xOffset;
    	let yOffset;
    	let centerX;
    	let centerY;
    	let path;
    	let baseEdgeProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StraightEdge', slots, []);
    	let { edge } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (edge === undefined && !('edge' in $$props || $$self.$$.bound[$$self.$$.props['edge']])) {
    			console.warn("<StraightEdge> was created without expected prop 'edge'");
    		}
    	});

    	const writable_props = ['edge'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StraightEdge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('edge' in $$props) $$invalidate(1, edge = $$props.edge);
    	};

    	$$self.$capture_state = () => ({
    		BaseEdge,
    		edge,
    		centerY,
    		centerX,
    		path,
    		baseEdgeProps,
    		yOffset,
    		xOffset
    	});

    	$$self.$inject_state = $$props => {
    		if ('edge' in $$props) $$invalidate(1, edge = $$props.edge);
    		if ('centerY' in $$props) $$invalidate(2, centerY = $$props.centerY);
    		if ('centerX' in $$props) $$invalidate(3, centerX = $$props.centerX);
    		if ('path' in $$props) $$invalidate(4, path = $$props.path);
    		if ('baseEdgeProps' in $$props) $$invalidate(0, baseEdgeProps = $$props.baseEdgeProps);
    		if ('yOffset' in $$props) $$invalidate(5, yOffset = $$props.yOffset);
    		if ('xOffset' in $$props) $$invalidate(6, xOffset = $$props.xOffset);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*edge*/ 2) {
    			// offset is determining the difference between X and Y coordinates of the source and target nodes
    			$$invalidate(6, xOffset = Math.abs(edge.targetX - edge.sourceX) / 2);
    		}

    		if ($$self.$$.dirty & /*edge*/ 2) {
    			$$invalidate(5, yOffset = Math.abs(edge.targetY - edge.sourceY) / 2);
    		}

    		if ($$self.$$.dirty & /*edge, xOffset*/ 66) {
    			// determining the center point of the edge to be used in the EdgeText component
    			$$invalidate(3, centerX = edge.targetX < edge.sourceX
    			? edge.targetX + xOffset
    			: edge.targetX - xOffset);
    		}

    		if ($$self.$$.dirty & /*edge, yOffset*/ 34) {
    			$$invalidate(2, centerY = edge.targetY < edge.sourceY
    			? edge.targetY + yOffset
    			: edge.targetY - yOffset);
    		}

    		if ($$self.$$.dirty & /*edge*/ 2) {
    			// determine SVG path d (where to be drawn) string value to pass into BaseEdge component
    			// path is reactive to current edge source/target X and Y values
    			$$invalidate(4, path = `M ${edge.sourceX},${edge.sourceY}L ${edge.targetX},${edge.targetY}`);
    		}

    		if ($$self.$$.dirty & /*edge, path, centerX, centerY*/ 30) {
    			$$invalidate(0, baseEdgeProps = { ...edge, path, centerX, centerY });
    		}
    	};

    	return [baseEdgeProps, edge, centerY, centerX, path, yOffset, xOffset];
    }

    class StraightEdge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$8, create_fragment$8, safe_not_equal, { edge: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StraightEdge",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get edge() {
    		throw new Error("<StraightEdge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set edge(value) {
    		throw new Error("<StraightEdge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //needed for getCenter funciotn
    const LeftOrRight = [Position.Left, Position.Right];
    //used to determine the position for edge text on a Smooth or Step Edge
    const getCenter = ({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top }) => {
        const sourceIsLeftOrRight = LeftOrRight.includes(sourcePosition);
        const targetIsLeftOrRight = LeftOrRight.includes(targetPosition);
        // we expect flows to be horizontal or vertical (all handles left or right respectively top or bottom)
        // a mixed edge is when one the source is on the left and the target is on the top for example.
        const mixedEdge = (sourceIsLeftOrRight && !targetIsLeftOrRight) || (targetIsLeftOrRight && !sourceIsLeftOrRight);
        if (mixedEdge) {
            const xOffset = sourceIsLeftOrRight ? Math.abs(targetX - sourceX) : 0;
            const centerX = sourceX > targetX ? sourceX - xOffset : sourceX + xOffset;
            const yOffset = sourceIsLeftOrRight ? 0 : Math.abs(targetY - sourceY);
            const centerY = sourceY < targetY ? sourceY + yOffset : sourceY - yOffset;
            return [centerX, centerY, xOffset, yOffset];
        }
        const xOffset = Math.abs(targetX - sourceX) / 2;
        const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
        const yOffset = Math.abs(targetY - sourceY) / 2;
        const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
        return [centerX, centerY, xOffset, yOffset];
    };

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const svelvetStores = {};
    // refer to Svelvet/index, if store does not exist, then create one.

    // Moved this out of the findOrCreateStore function to have it as more of a traditional? state that can be updated more easily
    const coreSvelvetStore = {
        nodesStore: writable([]),
        edgesStore: writable([]),
        widthStore: writable(600),
        heightStore: writable(600),
        backgroundStore: writable(false),
        movementStore: writable(true),
        nodeSelected: writable(false),
        nodeIdSelected: writable(-1),
        edgeSelected: writable(false),
        edgeIdSelected: writable(-1),
        d3Scale: writable(1),
        snapgrid: writable(false),
        snapResize: writable(30),
        backgroundColor: writable(),
        mouseX: writable(1),
        mouseY: writable(1),
        hoveredElement: writable(null)
    };


    // Creates one Svelvet component store using the unique key
    function findOrCreateStore(key) {
        //This just returns whatever we are requesting from store.js
        const existing = svelvetStores[key];
        if (existing) {
            return existing;
        }
        //Setting defaults of core svelvet store and making them a store using writable
        // const coreSvelvetStore = {
        //     nodesStore: writable([]),
        //     edgesStore: writable([]),
        //     widthStore: writable(600),
        //     heightStore: writable(600),
        //     backgroundStore: writable(false),
        //     movementStore: writable(true),
        //     nodeSelected: writable(false),
        //     nodeIdSelected: writable(-1),
        //     d3Scale: writable(1),
        //     snapgrid: writable(false),
        //     snapResize: writable(30),
        //     backgroundColor: writable()
        // };

        // This is the function handler for the mouseMove event to update the position of the selected node.
        // Changed from onMouseMove to onNodeMove because of addition of onEdgeMove function
        const onNodeMove = (e, nodeID) => {
            coreSvelvetStore.nodesStore.update((n) => {
                const correctNode = n.find((node) => node.id === nodeID);
                // console.log('node x', correctNode.position.x);
                // console.log('node y', correctNode.position.y);

                const scale = get_store_value(coreSvelvetStore.d3Scale);

                if(correctNode.childNodes){
                    n.forEach((child) => {
                        if(correctNode.childNodes.includes(child.id)){
                            child.position.x += e.movementX / scale;
                            child.position.y += e.movementY / scale;
                        }
                    });
                    correctNode.position.x += e.movementX / scale;
                    correctNode.position.y += e.movementY / scale;
                }
                else {
                    // divide the movement value by scale to keep it proportional to d3Zoom transformations
                    correctNode.position.x += e.movementX / scale;
                    correctNode.position.y += e.movementY / scale;

                }
                return [...n];
            });
        };

        // Mostly copied from onNodeMove, this allows for the movement of new Edges that don't yet have targets/sources
        const onEdgeMove = (event, edgeID) => {
            coreSvelvetStore.edgesStore.update((e) => {
                const correctEdge = e.find((edge) => edge.id === edgeID);
                // correctEdge.targetX = event.clientX;
                // correctEdge.targetY = event.clientY;
                console.log('correctEdge from store', correctEdge);

                const scale = get_store_value(coreSvelvetStore.d3Scale);
                // divide the movement value by scale to keep it proportional to d3Zoom transformations
                if (!correctEdge.target) {
                  correctEdge.targetX += event.movementX / scale;
                  correctEdge.targetY += event.movementY / scale;
                } 
                if (!correctEdge.source) {
                  correctEdge.sourceX += event.movementX / scale;
                  correctEdge.sourceY += event.movementY / scale;
                  console.log('sourceX', correctEdge.sourceX, 'sourceY', correctEdge.sourceY);
                }
        
                return [...e];
            });
        };

        // This is the function handler for the touch event on mobile to select a node.
        const onTouchMove = (e, nodeID) => {
                coreSvelvetStore.nodesStore.update((n) => {
                    // restores mobile functionality
                    n.forEach(node => {
                        if (node.id === nodeID) {
                          //calculates the location of the selected node
                          const { x, y, width, height } = e.target.getBoundingClientRect();
                          const offsetX = ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
                          const offsetY = ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
                          // centers the node consistently under the user's touch
                          node.position.x += offsetX - node.width / 2;
                          node.position.y += offsetY - node.height / 2;
                        }
                      });
                      return [...n];
                    });
                /*  Svelvet 4.0 dev code see:
                    https://github.com/open-source-labs/Svelvet/blob/main/NPM%20Package/svelvet/Future%20Iteration/ParentNode.md
                    const correctNode = n.find((node) => node.id === nodeID);
                    const { x, y, width, height } = e.target.getBoundingClientRect();
                    const offsetX = ((e.touches[0].clientX - x) / width) * e.target.offsetWidth;
                    const offsetY = ((e.touches[0].clientY - y) / height) * e.target.offsetHeight;
        
                    if(correctNode.childNodes){
                        n.forEach((child)=>{
                            //conditional fails, make it recognize the nodes in childNodes
                            if(correctNode.childNodes.includes(child.id)){
                                //All nodes within child nodes will move with the parent container node.
                                child.position.x += offsetX - correctNode.width/2;
                                child.position.y += offsetY - correctNode.height/2;
                            }
                        })
                        correctNode.position.x += offsetX - correctNode.width/2;
                        correctNode.position.y += offsetY - correctNode.height/2;
                    }  else {
                        // centers the node consistently under the user's touch
                        correctNode.position.x += offsetX - correctNode.width/2;
                        correctNode.position.y += offsetY - correctNode.height/2;
        
                    }
                });
                return [...n];
                */
        };

        const nodeIdSelected = coreSvelvetStore.nodeIdSelected;
        // if the user clicks a node without moving it, this function fires allowing a user to invoke the callback function
        const onNodeClick = (e, nodeID) => {
            get_store_value(nodesStore).forEach((node) => {
                if (node.id === get_store_value(nodeIdSelected)) {
                    node.clickCallback?.(node);
                }
            });
        };

        const edgesStore = coreSvelvetStore.edgesStore;
        const nodesStore = coreSvelvetStore.nodesStore;
        // derive from nodesStore and edgesStore, pass in array value from each store
        // updates edgesStore with new object properties (edge.sourceX, edge.targetY, etc) for edgesArray
        // $nodesStore and its individual object properties are reactive to node.position.x and node.position.y
        // so derivedEdges has access to node.position.x and node.position.y changes inside of this function
        const derivedEdges = derived([nodesStore, edgesStore], ([$nodesStore, $edgesStore]) => {
            $edgesStore.forEach((edge) => {
                // any -> edge should follow type DerivedEdge, but we are assigning to any so the typing meshes together
                // These are dummy nodes to resolve a typescripting issue. They are overwritten in the following forEach loop
                let sourceNode = {
                    id: 0,
                    position: { x: 25, y: 475 },
                    data: { label: '9' },
                    width: 175,
                    height: 40,
                    targetPosition: 'right',
                    sourcePosition: 'left'
                };
                let targetNode = {
                    id: 10,
                    position: { x: 750, y: 475 },
                    data: { label: '10' },
                    width: 175,
                    height: 40,
                    targetPosition: 'right',
                    sourcePosition: 'left'
                };
                
                //We find out what the sourceNode is or the targetNode is.
                $nodesStore.forEach((node) => {
                    if (edge.source === node.id) {
                        sourceNode = node;
                    }
                    if (edge.target === node.id) {
                        targetNode = node;
                    } 
                });

                // If the edge doesn't have a target yet, set the target to null rather than to the dummy node above
                if(!$nodesStore.some(node => node.id === edge.target)) targetNode = null;
                // Do the same for the source 
                if(!$nodesStore.some(node => node.id === edge.source)) sourceNode = null;

                if (sourceNode) {
                    
                    //left side of the node selected
                    let left = sourceNode.position.x;
                    
                    //top of the node selected
                    let top = sourceNode.position.y;
                    
                    //declaring the middle point of the node
                    let middle = sourceNode.width / 2;
                    
                    //Default sourcePosition to bottom if sourcePosition not defined
                    if (sourceNode.sourcePosition === 'bottom' || sourceNode.sourcePosition === undefined) {
                    
                        //the x coordinate of the middle of the node
                        edge.sourceX = left + middle;
                        
                        //the y coordinate of the bottom of the node
                        edge.sourceY = top + sourceNode.height;
                        
                        //assign sourcePosition to the edge for usage in the various edge components
                        edge.sourcePosition = 'bottom';
                    }
                    else if (sourceNode.sourcePosition === 'top') {
                        edge.sourceX = left + middle;
                        edge.sourceY = top;
                        edge.sourcePosition = sourceNode.sourcePosition;
                    }
                    else if (sourceNode.sourcePosition === 'left') {
                        edge.sourceX = left;
                        edge.sourceY = top + sourceNode.height / 2;
                        edge.sourcePosition = sourceNode.sourcePosition;
                    }
                    else if (sourceNode.sourcePosition === 'right') {
                        edge.sourceX = left + sourceNode.width;
                        edge.sourceY = top + sourceNode.height / 2;
                        edge.sourcePosition = sourceNode.sourcePosition;
                    }
                }
                if (targetNode) {
                    
                    //left side of the node selected
                    let left = targetNode.position.x;
                    
                    //top of the node selected
                    let top = targetNode.position.y;
                    
                    //declaring the middle point of the node
                    let middle = targetNode.width / 2;

                    //Default to top targetPosition if targetPosition undefined
                    if (targetNode.targetPosition === 'top' || targetNode.targetPosition === undefined) {
                        //the x coordinate of the middle of the node
                        edge.targetX = left + middle;
                        //the y coordinate of the top of the node
                        edge.targetY = top;
                        //assign sourcePosition to the edge for usage in the various edge components
                        edge.targetPosition = 'top';
                    }
                    else if (targetNode.targetPosition === 'bottom') {
                        edge.targetX = left + middle;
                        edge.targetY = top + targetNode.height;
                        edge.targetPosition = targetNode.targetPosition;
                    }
                    else if (targetNode.targetPosition === 'left') {
                        edge.targetX = left;
                        edge.targetY = top + targetNode.height / 2;
                        edge.targetPosition = targetNode.targetPosition;
                    }
                    else if (targetNode.targetPosition === 'right') {
                        edge.targetX = left + targetNode.width;
                        edge.targetY = top + targetNode.height / 2;
                        edge.targetPosition = targetNode.targetPosition;
                    }
                } 
            });
            return [...$edgesStore];
        });
        //Puts everything together as the svelvet store and use the key so that it can be used.
        const svelvetStore = {
            ...coreSvelvetStore,
            onTouchMove,
            onEdgeMove,
            onNodeMove,
            onNodeClick,
            derivedEdges
        };
        svelvetStores[key] = svelvetStore;
        return svelvetStore;
    }

    /* svelvetrabbit/Edges/EdgeAnchor.svelte generated by Svelte v3.54.0 */

    const { console: console_1$1 } = globals;
    const file$5 = "svelvetrabbit/Edges/EdgeAnchor.svelte";

    function create_fragment$7(ctx) {
    	let circle;
    	let circle_r_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "Anchor svelte-1d74fpe");
    			attr_dev(circle, "cx", /*x*/ ctx[0]);
    			attr_dev(circle, "cy", /*y*/ ctx[1]);
    			attr_dev(circle, "r", circle_r_value = /*hovered*/ ctx[8] === true ? 10 : 6);
    			attr_dev(circle, "stroke", "white");
    			attr_dev(circle, "fill", "black");
    			add_location(circle, file$5, 149, 0, 4997);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousemove", /*mousemove_handler*/ ctx[23], false, false, false),
    					listen_dev(window, "mouseup", /*mouseup_handler*/ ctx[24], false, false, false),
    					listen_dev(circle, "mousedown", /*mousedown_handler*/ ctx[25], false, false, false),
    					listen_dev(circle, "mouseup", /*mouseup_handler_1*/ ctx[26], false, false, false),
    					listen_dev(circle, "mouseenter", /*mouseenter_handler*/ ctx[27], false, false, false),
    					listen_dev(circle, "mouseleave", /*mouseleave_handler*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*x*/ 1) {
    				attr_dev(circle, "cx", /*x*/ ctx[0]);
    			}

    			if (dirty[0] & /*y*/ 2) {
    				attr_dev(circle, "cy", /*y*/ ctx[1]);
    			}

    			if (dirty[0] & /*hovered*/ 256 && circle_r_value !== (circle_r_value = /*hovered*/ ctx[8] === true ? 10 : 6)) {
    				attr_dev(circle, "r", circle_r_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let shouldMove;
    	let store;

    	let $nodesStore,
    		$$unsubscribe_nodesStore = noop$1,
    		$$subscribe_nodesStore = () => ($$unsubscribe_nodesStore(), $$unsubscribe_nodesStore = subscribe(nodesStore, $$value => $$invalidate(31, $nodesStore = $$value)), nodesStore);

    	let $derivedEdges,
    		$$unsubscribe_derivedEdges = noop$1,
    		$$subscribe_derivedEdges = () => ($$unsubscribe_derivedEdges(), $$unsubscribe_derivedEdges = subscribe(derivedEdges, $$value => $$invalidate(12, $derivedEdges = $$value)), derivedEdges);

    	let $movementStore;
    	let $nodeSelected;
    	let $hoveredElement;
    	$$self.$$.on_destroy.push(() => $$unsubscribe_nodesStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_derivedEdges());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EdgeAnchor', slots, []);
    	let { x } = $$props;
    	let { y } = $$props;
    	let { key } = $$props;
    	let { derivedEdges } = $$props;
    	validate_store(derivedEdges, 'derivedEdges');
    	$$subscribe_derivedEdges();
    	let { node } = $$props;
    	let { nodesStore } = $$props;
    	validate_store(nodesStore, 'nodesStore');
    	$$subscribe_nodesStore();
    	let { position } = $$props;
    	let newNode;
    	let newEdge;
    	let hovered = false;
    	const { onNodeMove, onEdgeMove, onNodeClick, onTouchMove, nodeSelected, edgeSelected, widthStore, heightStore, nodeIdSelected, edgeIdSelected, movementStore, snapgrid, snapResize, mouseX, mouseY, hoveredElement } = findOrCreateStore(key);
    	validate_store(nodeSelected, 'nodeSelected');
    	component_subscribe($$self, nodeSelected, value => $$invalidate(13, $nodeSelected = value));
    	validate_store(movementStore, 'movementStore');
    	component_subscribe($$self, movementStore, value => $$invalidate(22, $movementStore = value));
    	validate_store(hoveredElement, 'hoveredElement');
    	component_subscribe($$self, hoveredElement, value => $$invalidate(14, $hoveredElement = value));

    	// $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
    	// moving local boolean specific to node selected, to change position of individual node once selected
    	let moving = false;

    	let moved = false;
    	let edgeShouldMove = false;

    	/* This keeps track of the cursors current position, taking into account d3 transformations,
    updating the mouseX and mouseY values in the store
    */
    	// d3.select('svg') 
    	//   .on('mousemove', (event) => {
    	//     store.mouseX.set(d3.pointer(event)[0]);
    	//     store.mouseY.set(d3.pointer(event)[1]);
    	//   })
    	/*
    This is the function that renders a new edge when an anchor is clicked
    */
    	const renderEdge = e => {
    		e.preventDefault(); // preventing default behavior, not sure if necessary

    		// set the target or the source depending on the anchor position
    		position === 'bottom' ? node.id : null;

    		position === 'top' ? node.id : null;

    		// Setting the newEdge variable to an edge prototype
    		$$invalidate(7, newEdge = position === 'bottom'
    		? {
    				id: (Math.random() + 10).toFixed(2), // need better way to generate id, uuid?
    				source: node.id, // the source is the node that the anchor is on
    				target: null, // until the mouse is released the target will be set to null
    				targetX: node.position.x + node.width / 2,
    				targetY: node.position.y + node.height,
    				label: "newEdge"
    			}
    		: {
    				id: (Math.random() + 10).toFixed(2), // need better way to generate id, uuid?
    				source: null, // until the mouse is released the source will be set to null
    				target: node.id, // the target is the node that the anchor is on
    				sourceX: node.position.x + node.width / 2,
    				sourceY: node.position.y,
    				label: "newEdge"
    			});

    		store.edgesStore.set([...$derivedEdges, newEdge]); // updating the edges in the store
    	};

    	/*
    This is the function that renders a new node when the mouse is released
    after clicking on an anchor, takes in the newEdge that was just created
    */
    	const renderNewNode = (event, edge) => {
    		event.preventDefault();

    		let pos = position === 'bottom'
    		? { x: edge.targetX, y: edge.targetY }
    		: { x: edge.sourceX, y: edge.sourceY };

    		// setting newNode variable to a 'prototype' node
    		newNode = {
    			id: (Math.random() + 10).toFixed(2), // again, better id generation needed, uuid?
    			position: pos, // the position (top left corner) is at the target coords of the edge for now
    			data: { label: "newNode" }, // need ways to change the rest of the properties
    			width: 100,
    			height: 40,
    			bgColor: "white"
    		};

    		// newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
    		if (position === 'bottom') {
    			edge.target = newNode.id; // set the new edge to target the new node
    			newNode.position.x = edge.targetX - newNode.width / 2; // moves the node over to the correct position
    		} else {
    			edge.source = newNode.id;
    			newNode.position.x = edge.sourceX - newNode.width / 2;
    			newNode.position.y = edge.sourceY - newNode.height;
    		}

    		store.nodesStore.set([...$nodesStore, newNode]); // update the nodes in the store
    	};

    	$$self.$$.on_mount.push(function () {
    		if (x === undefined && !('x' in $$props || $$self.$$.bound[$$self.$$.props['x']])) {
    			console_1$1.warn("<EdgeAnchor> was created without expected prop 'x'");
    		}

    		if (y === undefined && !('y' in $$props || $$self.$$.bound[$$self.$$.props['y']])) {
    			console_1$1.warn("<EdgeAnchor> was created without expected prop 'y'");
    		}

    		if (key === undefined && !('key' in $$props || $$self.$$.bound[$$self.$$.props['key']])) {
    			console_1$1.warn("<EdgeAnchor> was created without expected prop 'key'");
    		}

    		if (derivedEdges === undefined && !('derivedEdges' in $$props || $$self.$$.bound[$$self.$$.props['derivedEdges']])) {
    			console_1$1.warn("<EdgeAnchor> was created without expected prop 'derivedEdges'");
    		}

    		if (node === undefined && !('node' in $$props || $$self.$$.bound[$$self.$$.props['node']])) {
    			console_1$1.warn("<EdgeAnchor> was created without expected prop 'node'");
    		}

    		if (nodesStore === undefined && !('nodesStore' in $$props || $$self.$$.bound[$$self.$$.props['nodesStore']])) {
    			console_1$1.warn("<EdgeAnchor> was created without expected prop 'nodesStore'");
    		}

    		if (position === undefined && !('position' in $$props || $$self.$$.bound[$$self.$$.props['position']])) {
    			console_1$1.warn("<EdgeAnchor> was created without expected prop 'position'");
    		}
    	});

    	const writable_props = ['x', 'y', 'key', 'derivedEdges', 'node', 'nodesStore', 'position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<EdgeAnchor> was created with unknown prop '${key}'`);
    	});

    	const mousemove_handler = e => {
    		e.preventDefault();

    		if (edgeShouldMove) {
    			// onNodeMove(e, newNode.id);
    			onEdgeMove(e, newEdge.id); // re-renders (moves) the edge while the mouse is down and moving

    			$$invalidate(9, moved = true);
    		}
    	};

    	const mouseup_handler = e => {
    		$$invalidate(10, edgeShouldMove = false); // prevent the new edge from moving
    		$$invalidate(6, moving = false);
    		set_store_value(nodeSelected, $nodeSelected = false, $nodeSelected);
    		$$invalidate(9, moved = false);

    		if (newEdge) {
    			if ($hoveredElement) {
    				if (position === 'top') $$invalidate(7, newEdge.source = $hoveredElement.id, newEdge); else $$invalidate(7, newEdge.target = $hoveredElement.id, newEdge);
    				store.edgesStore.set([...$derivedEdges, newEdge]);
    			} else {
    				renderNewNode(e, newEdge);
    			} // newEdge.target = newNode.id;
    		}

    		$$invalidate(7, newEdge = null);
    	};

    	const mousedown_handler = e => {
    		e.preventDefault();
    		e.stopPropagation(); // Important! Prevents the event from firing on the parent element (the .Edges svg) 
    		renderEdge(e); // renders the new edge on the screen
    		$$invalidate(10, edgeShouldMove = true);
    	};

    	const mouseup_handler_1 = e => {
    		e.preventDefault();
    		$$invalidate(10, edgeShouldMove = false);
    		$$invalidate(6, moving = false);
    		$$invalidate(9, moved = false);
    	};

    	const mouseenter_handler = e => {
    		$$invalidate(8, hovered = true);
    		store.hoveredElement.set(node); // If the mouse enters an anchor, we store the node it's attached to for reference
    		console.log($hoveredElement);
    	};

    	const mouseleave_handler = e => {
    		$$invalidate(8, hovered = false);
    		store.hoveredElement.set(null); // When the mouse leaves an anchor, we clear the value in the store
    		console.log($hoveredElement);
    	};

    	$$self.$$set = $$props => {
    		if ('x' in $$props) $$invalidate(0, x = $$props.x);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    		if ('key' in $$props) $$invalidate(21, key = $$props.key);
    		if ('derivedEdges' in $$props) $$subscribe_derivedEdges($$invalidate(2, derivedEdges = $$props.derivedEdges));
    		if ('node' in $$props) $$invalidate(3, node = $$props.node);
    		if ('nodesStore' in $$props) $$subscribe_nodesStore($$invalidate(4, nodesStore = $$props.nodesStore));
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({
    		select,
    		selectAll,
    		Position,
    		findOrCreateStore,
    		derived,
    		x,
    		y,
    		key,
    		derivedEdges,
    		node,
    		nodesStore,
    		position,
    		newNode,
    		newEdge,
    		hovered,
    		onNodeMove,
    		onEdgeMove,
    		onNodeClick,
    		onTouchMove,
    		nodeSelected,
    		edgeSelected,
    		widthStore,
    		heightStore,
    		nodeIdSelected,
    		edgeIdSelected,
    		movementStore,
    		snapgrid,
    		snapResize,
    		mouseX,
    		mouseY,
    		hoveredElement,
    		moving,
    		moved,
    		edgeShouldMove,
    		renderEdge,
    		renderNewNode,
    		store,
    		shouldMove,
    		$nodesStore,
    		$derivedEdges,
    		$movementStore,
    		$nodeSelected,
    		$hoveredElement
    	});

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) $$invalidate(0, x = $$props.x);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    		if ('key' in $$props) $$invalidate(21, key = $$props.key);
    		if ('derivedEdges' in $$props) $$subscribe_derivedEdges($$invalidate(2, derivedEdges = $$props.derivedEdges));
    		if ('node' in $$props) $$invalidate(3, node = $$props.node);
    		if ('nodesStore' in $$props) $$subscribe_nodesStore($$invalidate(4, nodesStore = $$props.nodesStore));
    		if ('position' in $$props) $$invalidate(5, position = $$props.position);
    		if ('newNode' in $$props) newNode = $$props.newNode;
    		if ('newEdge' in $$props) $$invalidate(7, newEdge = $$props.newEdge);
    		if ('hovered' in $$props) $$invalidate(8, hovered = $$props.hovered);
    		if ('moving' in $$props) $$invalidate(6, moving = $$props.moving);
    		if ('moved' in $$props) $$invalidate(9, moved = $$props.moved);
    		if ('edgeShouldMove' in $$props) $$invalidate(10, edgeShouldMove = $$props.edgeShouldMove);
    		if ('store' in $$props) $$invalidate(11, store = $$props.store);
    		if ('shouldMove' in $$props) shouldMove = $$props.shouldMove;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*moving, $movementStore*/ 4194368) {
    			shouldMove = moving && $movementStore;
    		}

    		if ($$self.$$.dirty[0] & /*key*/ 2097152) {
    			$$invalidate(11, store = findOrCreateStore(key));
    		}
    	};

    	return [
    		x,
    		y,
    		derivedEdges,
    		node,
    		nodesStore,
    		position,
    		moving,
    		newEdge,
    		hovered,
    		moved,
    		edgeShouldMove,
    		store,
    		$derivedEdges,
    		$nodeSelected,
    		$hoveredElement,
    		onEdgeMove,
    		nodeSelected,
    		movementStore,
    		hoveredElement,
    		renderEdge,
    		renderNewNode,
    		key,
    		$movementStore,
    		mousemove_handler,
    		mouseup_handler,
    		mousedown_handler,
    		mouseup_handler_1,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class EdgeAnchor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				x: 0,
    				y: 1,
    				key: 21,
    				derivedEdges: 2,
    				node: 3,
    				nodesStore: 4,
    				position: 5
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EdgeAnchor",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get x() {
    		throw new Error("<EdgeAnchor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<EdgeAnchor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<EdgeAnchor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<EdgeAnchor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<EdgeAnchor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<EdgeAnchor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get derivedEdges() {
    		throw new Error("<EdgeAnchor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set derivedEdges(value) {
    		throw new Error("<EdgeAnchor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get node() {
    		throw new Error("<EdgeAnchor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<EdgeAnchor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nodesStore() {
    		throw new Error("<EdgeAnchor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodesStore(value) {
    		throw new Error("<EdgeAnchor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<EdgeAnchor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<EdgeAnchor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Edges/SmoothStepEdge.svelte generated by Svelte v3.54.0 */

    function create_fragment$6(ctx) {
    	let baseedge;
    	let current;

    	baseedge = new BaseEdge({
    			props: { baseEdgeProps: /*baseEdgeProps*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(baseedge.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(baseedge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const baseedge_changes = {};
    			if (dirty & /*baseEdgeProps*/ 1) baseedge_changes.baseEdgeProps = /*baseEdgeProps*/ ctx[0];
    			baseedge.$set(baseedge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(baseedge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(baseedge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(baseedge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let params;
    	let centerX;
    	let centerY;
    	let path;
    	let baseEdgeProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SmoothStepEdge', slots, []);
    	const bottomLeftCorner = (x, y, size) => `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`;
    	const leftBottomCorner = (x, y, size) => `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
    	const bottomRightCorner = (x, y, size) => `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;
    	const rightBottomCorner = (x, y, size) => `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`;
    	const leftTopCorner = (x, y, size) => `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;
    	const topLeftCorner = (x, y, size) => `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`;
    	const topRightCorner = (x, y, size) => `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;
    	const rightTopCorner = (x, y, size) => `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`;

    	function getSmoothStepPath(
    		{ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY }
    	) {
    		const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY });
    		const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
    		const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
    		const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
    		const leftAndRight = [Position.Left, Position.Right];
    		const cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    		const cY = typeof centerY !== 'undefined' ? centerY : _centerY;
    		let firstCornerPath = null;
    		let secondCornerPath = null;

    		// for non-mixed edge top/bottom
    		if (sourceX <= targetX) {
    			firstCornerPath = sourceY <= targetY
    			? bottomLeftCorner(sourceX, cY, cornerSize)
    			: topLeftCorner(sourceX, cY, cornerSize);

    			secondCornerPath = sourceY <= targetY
    			? rightTopCorner(targetX, cY, cornerSize)
    			: rightBottomCorner(targetX, cY, cornerSize);
    		} else {
    			firstCornerPath = sourceY < targetY
    			? bottomRightCorner(sourceX, cY, cornerSize)
    			: topRightCorner(sourceX, cY, cornerSize);

    			secondCornerPath = sourceY < targetY
    			? leftTopCorner(targetX, cY, cornerSize)
    			: leftBottomCorner(targetX, cY, cornerSize);
    		}

    		// for non-mixed edge left/right
    		if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    			if (sourceX <= targetX) {
    				firstCornerPath = sourceY <= targetY
    				? rightTopCorner(cX, sourceY, cornerSize)
    				: rightBottomCorner(cX, sourceY, cornerSize);

    				secondCornerPath = sourceY <= targetY
    				? bottomLeftCorner(cX, targetY, cornerSize)
    				: topLeftCorner(cX, targetY, cornerSize);
    			} else if (sourcePosition === Position.Right && targetPosition === Position.Left || sourcePosition === Position.Left && targetPosition === Position.Right || sourcePosition === Position.Left && targetPosition === Position.Left) {
    				// and sourceX > targetX
    				firstCornerPath = sourceY <= targetY
    				? leftTopCorner(cX, sourceY, cornerSize)
    				: leftBottomCorner(cX, sourceY, cornerSize);

    				secondCornerPath = sourceY <= targetY
    				? bottomRightCorner(cX, targetY, cornerSize)
    				: topRightCorner(cX, targetY, cornerSize);
    			}
    		} else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
    			if (sourceX <= targetX) {
    				firstCornerPath = sourceY <= targetY
    				? rightTopCorner(targetX, sourceY, cornerSize)
    				: rightBottomCorner(targetX, sourceY, cornerSize); // for mixed edges (top/bottom to left/right) OR (left/right to top/bottom)
    			} else {
    				firstCornerPath = sourceY <= targetY
    				? leftTopCorner(targetX, sourceY, cornerSize)
    				: leftBottomCorner(targetX, sourceY, cornerSize);
    			}

    			secondCornerPath = '';
    		} else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    			if (sourceX <= targetX) {
    				firstCornerPath = sourceY <= targetY
    				? bottomLeftCorner(sourceX, targetY, cornerSize)
    				: topLeftCorner(sourceX, targetY, cornerSize);
    			} else {
    				firstCornerPath = sourceY <= targetY
    				? bottomRightCorner(sourceX, targetY, cornerSize)
    				: topRightCorner(sourceX, targetY, cornerSize);
    			}

    			secondCornerPath = '';
    		}

    		return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`;
    	}

    	let { edge } = $$props;
    	let { borderRadius = 5 } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (edge === undefined && !('edge' in $$props || $$self.$$.bound[$$self.$$.props['edge']])) {
    			console.warn("<SmoothStepEdge> was created without expected prop 'edge'");
    		}
    	});

    	const writable_props = ['edge', 'borderRadius'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SmoothStepEdge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('edge' in $$props) $$invalidate(2, edge = $$props.edge);
    		if ('borderRadius' in $$props) $$invalidate(3, borderRadius = $$props.borderRadius);
    	};

    	$$self.$capture_state = () => ({
    		BaseEdge,
    		getCenter,
    		Position,
    		EdgeAnchor,
    		bottomLeftCorner,
    		leftBottomCorner,
    		bottomRightCorner,
    		rightBottomCorner,
    		leftTopCorner,
    		topLeftCorner,
    		topRightCorner,
    		rightTopCorner,
    		getSmoothStepPath,
    		edge,
    		borderRadius,
    		centerY,
    		centerX,
    		path,
    		baseEdgeProps,
    		params
    	});

    	$$self.$inject_state = $$props => {
    		if ('edge' in $$props) $$invalidate(2, edge = $$props.edge);
    		if ('borderRadius' in $$props) $$invalidate(3, borderRadius = $$props.borderRadius);
    		if ('centerY' in $$props) $$invalidate(4, centerY = $$props.centerY);
    		if ('centerX' in $$props) $$invalidate(5, centerX = $$props.centerX);
    		if ('path' in $$props) $$invalidate(6, path = $$props.path);
    		if ('baseEdgeProps' in $$props) $$invalidate(0, baseEdgeProps = $$props.baseEdgeProps);
    		if ('params' in $$props) $$invalidate(7, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*edge, borderRadius*/ 12) {
    			$$invalidate(7, params = {
    				sourceX: edge.sourceX,
    				sourceY: edge.sourceY,
    				targetX: edge.targetX,
    				targetY: edge.targetY,
    				sourcePosition: edge.sourcePosition,
    				targetPosition: edge.targetPosition,
    				borderRadius
    			});
    		}

    		if ($$self.$$.dirty & /*params*/ 128) {
    			$$invalidate(5, [centerX, centerY] = getCenter(params), centerX, ((($$invalidate(4, centerY), $$invalidate(7, params)), $$invalidate(2, edge)), $$invalidate(3, borderRadius)));
    		}

    		if ($$self.$$.dirty & /*params*/ 128) {
    			$$invalidate(6, path = getSmoothStepPath(params));
    		}

    		if ($$self.$$.dirty & /*edge, path, centerX, centerY*/ 116) {
    			$$invalidate(0, baseEdgeProps = { ...edge, path, centerX, centerY });
    		}
    	};

    	return [
    		baseEdgeProps,
    		getSmoothStepPath,
    		edge,
    		borderRadius,
    		centerY,
    		centerX,
    		path,
    		params
    	];
    }

    class SmoothStepEdge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			getSmoothStepPath: 1,
    			edge: 2,
    			borderRadius: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SmoothStepEdge",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get getSmoothStepPath() {
    		return this.$$.ctx[1];
    	}

    	set getSmoothStepPath(value) {
    		throw new Error("<SmoothStepEdge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get edge() {
    		throw new Error("<SmoothStepEdge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set edge(value) {
    		throw new Error("<SmoothStepEdge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderRadius() {
    		throw new Error("<SmoothStepEdge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderRadius(value) {
    		throw new Error("<SmoothStepEdge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Edges/StepEdge.svelte generated by Svelte v3.54.0 */

    function create_fragment$5(ctx) {
    	let smoothstepedge;
    	let current;

    	smoothstepedge = new SmoothStepEdge({
    			props: { edge: /*edge*/ ctx[0], borderRadius: 0 },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(smoothstepedge.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(smoothstepedge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const smoothstepedge_changes = {};
    			if (dirty & /*edge*/ 1) smoothstepedge_changes.edge = /*edge*/ ctx[0];
    			smoothstepedge.$set(smoothstepedge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(smoothstepedge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(smoothstepedge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(smoothstepedge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StepEdge', slots, []);
    	let { edge } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (edge === undefined && !('edge' in $$props || $$self.$$.bound[$$self.$$.props['edge']])) {
    			console.warn("<StepEdge> was created without expected prop 'edge'");
    		}
    	});

    	const writable_props = ['edge'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StepEdge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('edge' in $$props) $$invalidate(0, edge = $$props.edge);
    	};

    	$$self.$capture_state = () => ({ SmoothStepEdge, edge });

    	$$self.$inject_state = $$props => {
    		if ('edge' in $$props) $$invalidate(0, edge = $$props.edge);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [edge];
    }

    class StepEdge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal, { edge: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StepEdge",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get edge() {
    		throw new Error("<StepEdge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set edge(value) {
    		throw new Error("<StepEdge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Nodes/index.svelte generated by Svelte v3.54.0 */
    const file$4 = "svelvetrabbit/Nodes/index.svelte";

    // (83:2) {#if node.image}
    function create_if_block$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*node*/ ctx[0].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			set_style(img, "width", /*node*/ ctx[0].width * 0.75 + "px");
    			set_style(img, "height", /*node*/ ctx[0].height * 0.75 + "px");
    			set_style(img, "overflow", "hidden");
    			add_location(img, file$4, 83, 4, 2276);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*node*/ 1 && !src_url_equal(img.src, img_src_value = /*node*/ ctx[0].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*node*/ 1) {
    				set_style(img, "width", /*node*/ ctx[0].width * 0.75 + "px");
    			}

    			if (dirty & /*node*/ 1) {
    				set_style(img, "height", /*node*/ ctx[0].height * 0.75 + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(83:2) {#if node.image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let t;
    	let div_id_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*node*/ ctx[0].image && create_if_block$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "Node svelte-1g1wdfn");
    			set_style(div, "left", /*node*/ ctx[0].position.x + "px");
    			set_style(div, "top", /*node*/ ctx[0].position.y + "px");
    			set_style(div, "width", /*node*/ ctx[0].width + "px");
    			set_style(div, "height", /*node*/ ctx[0].height + "px");
    			set_style(div, "background-color", /*node*/ ctx[0].bgColor);
    			set_style(div, "border-color", /*node*/ ctx[0].borderColor);
    			set_style(div, "border-radius", /*node*/ ctx[0].borderRadius + "px");
    			set_style(div, "color", /*node*/ ctx[0].textColor);
    			attr_dev(div, "id", div_id_value = "svelvet-" + /*node*/ ctx[0].id);
    			add_location(div, file$4, 49, 0, 1472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousemove", /*mousemove_handler*/ ctx[20], false, false, false),
    					listen_dev(window, "mouseup", /*mouseup_handler*/ ctx[21], false, false, false),
    					listen_dev(div, "touchmove", /*touchmove_handler*/ ctx[22], false, false, false),
    					listen_dev(div, "touchstart", /*touchstart_handler*/ ctx[23], false, false, false),
    					listen_dev(div, "touchend", /*touchend_handler*/ ctx[24], false, false, false),
    					listen_dev(div, "mousedown", /*mousedown_handler*/ ctx[25], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*node*/ ctx[0].image) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "left", /*node*/ ctx[0].position.x + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "top", /*node*/ ctx[0].position.y + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "width", /*node*/ ctx[0].width + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "height", /*node*/ ctx[0].height + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "background-color", /*node*/ ctx[0].bgColor);
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "border-color", /*node*/ ctx[0].borderColor);
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "border-radius", /*node*/ ctx[0].borderRadius + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(div, "color", /*node*/ ctx[0].textColor);
    			}

    			if (!current || dirty & /*node*/ 1 && div_id_value !== (div_id_value = "svelvet-" + /*node*/ ctx[0].id)) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let shouldMove;
    	let $movementStore;
    	let $snapgrid;
    	let $snapResize;
    	let $nodeSelected;
    	let $nodeIdSelected;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nodes', slots, ['default']);
    	let { node } = $$props;
    	let { key } = $$props;
    	const { onNodeMove, onNodeClick, onTouchMove, nodeSelected, widthStore, heightStore, nodeIdSelected, movementStore, snapgrid, snapResize } = findOrCreateStore(key);
    	validate_store(nodeSelected, 'nodeSelected');
    	component_subscribe($$self, nodeSelected, value => $$invalidate(6, $nodeSelected = value));
    	validate_store(nodeIdSelected, 'nodeIdSelected');
    	component_subscribe($$self, nodeIdSelected, value => $$invalidate(7, $nodeIdSelected = value));
    	validate_store(movementStore, 'movementStore');
    	component_subscribe($$self, movementStore, value => $$invalidate(17, $movementStore = value));
    	validate_store(snapgrid, 'snapgrid');
    	component_subscribe($$self, snapgrid, value => $$invalidate(4, $snapgrid = value));
    	validate_store(snapResize, 'snapResize');
    	component_subscribe($$self, snapResize, value => $$invalidate(5, $snapResize = value));

    	// $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
    	// moving local boolean specific to node selected, to change position of individual node once selected
    	let moving = false;

    	let moved = false;

    	$$self.$$.on_mount.push(function () {
    		if (node === undefined && !('node' in $$props || $$self.$$.bound[$$self.$$.props['node']])) {
    			console.warn("<Nodes> was created without expected prop 'node'");
    		}

    		if (key === undefined && !('key' in $$props || $$self.$$.bound[$$self.$$.props['key']])) {
    			console.warn("<Nodes> was created without expected prop 'key'");
    		}
    	});

    	const writable_props = ['node', 'key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nodes> was created with unknown prop '${key}'`);
    	});

    	const mousemove_handler = e => {
    		e.preventDefault();

    		if (shouldMove) {
    			onNodeMove(e, node.id);
    			$$invalidate(2, moved = true);
    		}
    	};

    	const mouseup_handler = e => {
    		// Note: mouseup moved outside of div to prevent issue where node becomes magnetized to cursor after leaving visible boundaries, github issues #120 & #125
    		if ($snapgrid) {
    			// If user sets snap attribute as true inside Svelvet
    			$$invalidate(0, node.position.x = Math.floor(node.position.x / $snapResize) * $snapResize, node);

    			$$invalidate(0, node.position.y = Math.floor(node.position.y / $snapResize) * $snapResize, node);

    			// Invoking on mouseMove so that edges update relation to node immediately upon snap 
    			onNodeMove(e, node.id);
    		}

    		$$invalidate(1, moving = false);
    		set_store_value(nodeSelected, $nodeSelected = false, $nodeSelected);

    		if (!moved && node.id == $nodeIdSelected) {
    			onNodeClick(e, node.id);
    		}

    		$$invalidate(2, moved = false);
    	};

    	const touchmove_handler = e => {
    		if (shouldMove) {
    			onTouchMove(e, node.id);
    		}
    	};

    	const touchstart_handler = e => {
    		e.preventDefault();
    		$$invalidate(1, moving = true);
    		set_store_value(nodeSelected, $nodeSelected = true, $nodeSelected);
    	};

    	const touchend_handler = e => {
    		$$invalidate(1, moving = false);
    		set_store_value(nodeSelected, $nodeSelected = false, $nodeSelected);
    	};

    	const mousedown_handler = e => {
    		e.preventDefault();
    		$$invalidate(1, moving = true);
    		set_store_value(nodeIdSelected, $nodeIdSelected = node.id, $nodeIdSelected);
    		set_store_value(nodeSelected, $nodeSelected = true, $nodeSelected);
    	};

    	$$self.$$set = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    		if ('key' in $$props) $$invalidate(16, key = $$props.key);
    		if ('$$scope' in $$props) $$invalidate(18, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		findOrCreateStore,
    		node,
    		key,
    		onNodeMove,
    		onNodeClick,
    		onTouchMove,
    		nodeSelected,
    		widthStore,
    		heightStore,
    		nodeIdSelected,
    		movementStore,
    		snapgrid,
    		snapResize,
    		moving,
    		moved,
    		shouldMove,
    		$movementStore,
    		$snapgrid,
    		$snapResize,
    		$nodeSelected,
    		$nodeIdSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    		if ('key' in $$props) $$invalidate(16, key = $$props.key);
    		if ('moving' in $$props) $$invalidate(1, moving = $$props.moving);
    		if ('moved' in $$props) $$invalidate(2, moved = $$props.moved);
    		if ('shouldMove' in $$props) $$invalidate(3, shouldMove = $$props.shouldMove);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*moving, $movementStore*/ 131074) {
    			$$invalidate(3, shouldMove = moving && $movementStore);
    		}
    	};

    	return [
    		node,
    		moving,
    		moved,
    		shouldMove,
    		$snapgrid,
    		$snapResize,
    		$nodeSelected,
    		$nodeIdSelected,
    		onNodeMove,
    		onNodeClick,
    		onTouchMove,
    		nodeSelected,
    		nodeIdSelected,
    		movementStore,
    		snapgrid,
    		snapResize,
    		key,
    		$movementStore,
    		$$scope,
    		slots,
    		mousemove_handler,
    		mouseup_handler,
    		touchmove_handler,
    		touchstart_handler,
    		touchend_handler,
    		mousedown_handler
    	];
    }

    class Nodes extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { node: 0, key: 16 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nodes",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get node() {
    		throw new Error("<Nodes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<Nodes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Nodes>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Nodes>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Nodes/ImageNode.svelte generated by Svelte v3.54.0 */
    const file$3 = "svelvetrabbit/Nodes/ImageNode.svelte";

    function create_fragment$3(ctx) {
    	let img;
    	let img_src_value;
    	let img_id_value;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			img = element("img");
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(img, "class", "Node svelte-1g1wdfn");
    			set_style(img, "left", /*node*/ ctx[0].position.x + "px");
    			set_style(img, "top", /*node*/ ctx[0].position.y + "px");
    			set_style(img, "width", /*node*/ ctx[0].width + "px");
    			set_style(img, "height", /*node*/ ctx[0].height + "px");
    			set_style(img, "background-color", /*node*/ ctx[0].bgColor);
    			set_style(img, "border-color", /*node*/ ctx[0].borderColor);
    			set_style(img, "border-radius", /*node*/ ctx[0].borderRadius + "px");
    			set_style(img, "color", /*node*/ ctx[0].textColor);
    			if (!src_url_equal(img.src, img_src_value = /*node*/ ctx[0].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "id", img_id_value = "svelvet-" + /*node*/ ctx[0].id);
    			add_location(img, file$3, 21, 0, 731);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousemove", /*mousemove_handler*/ ctx[13], false, false, false),
    					listen_dev(img, "touchmove", /*touchmove_handler*/ ctx[14], false, false, false),
    					listen_dev(img, "touchstart", /*touchstart_handler*/ ctx[15], false, false, false),
    					listen_dev(img, "touchend", /*touchend_handler*/ ctx[16], false, false, false),
    					listen_dev(img, "mousedown", /*mousedown_handler*/ ctx[17], false, false, false),
    					listen_dev(img, "mouseup", /*mouseup_handler*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "left", /*node*/ ctx[0].position.x + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "top", /*node*/ ctx[0].position.y + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "width", /*node*/ ctx[0].width + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "height", /*node*/ ctx[0].height + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "background-color", /*node*/ ctx[0].bgColor);
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "border-color", /*node*/ ctx[0].borderColor);
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "border-radius", /*node*/ ctx[0].borderRadius + "px");
    			}

    			if (!current || dirty & /*node*/ 1) {
    				set_style(img, "color", /*node*/ ctx[0].textColor);
    			}

    			if (!current || dirty & /*node*/ 1 && !src_url_equal(img.src, img_src_value = /*node*/ ctx[0].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*node*/ 1 && img_id_value !== (img_id_value = "svelvet-" + /*node*/ ctx[0].id)) {
    				attr_dev(img, "id", img_id_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $nodeSelected;
    	let $nodeIdSelected;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ImageNode', slots, ['default']);
    	let { node } = $$props;
    	let { key } = $$props;
    	const { onMouseMove, onNodeClick, onTouchMove, nodeSelected, nodeIdSelected } = findOrCreateStore(key);
    	validate_store(nodeSelected, 'nodeSelected');
    	component_subscribe($$self, nodeSelected, value => $$invalidate(3, $nodeSelected = value));
    	validate_store(nodeIdSelected, 'nodeIdSelected');
    	component_subscribe($$self, nodeIdSelected, value => $$invalidate(4, $nodeIdSelected = value));

    	// $nodeSelected is a store boolean that lets GraphView component know if ANY node is selected
    	// moving local boolean specific to node selected, to change position of individual node once selected
    	let moving = false;

    	let moved = false;

    	$$self.$$.on_mount.push(function () {
    		if (node === undefined && !('node' in $$props || $$self.$$.bound[$$self.$$.props['node']])) {
    			console.warn("<ImageNode> was created without expected prop 'node'");
    		}

    		if (key === undefined && !('key' in $$props || $$self.$$.bound[$$self.$$.props['key']])) {
    			console.warn("<ImageNode> was created without expected prop 'key'");
    		}
    	});

    	const writable_props = ['node', 'key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ImageNode> was created with unknown prop '${key}'`);
    	});

    	const mousemove_handler = e => {
    		e.preventDefault();

    		if (moving) {
    			onMouseMove(e, node.id);
    			$$invalidate(2, moved = true);
    		}
    	};

    	const touchmove_handler = e => {
    		if (moving) {
    			onTouchMove(e, node.id);
    		}
    	};

    	const touchstart_handler = e => {
    		e.preventDefault();
    		$$invalidate(1, moving = true);
    		set_store_value(nodeSelected, $nodeSelected = true, $nodeSelected);
    	};

    	const touchend_handler = e => {
    		$$invalidate(1, moving = false);
    		set_store_value(nodeSelected, $nodeSelected = false, $nodeSelected);
    	};

    	const mousedown_handler = e => {
    		e.preventDefault();
    		$$invalidate(1, moving = true);
    		set_store_value(nodeIdSelected, $nodeIdSelected = node.id, $nodeIdSelected);
    		set_store_value(nodeSelected, $nodeSelected = true, $nodeSelected);
    	};

    	const mouseup_handler = e => {
    		$$invalidate(1, moving = false);
    		set_store_value(nodeSelected, $nodeSelected = false, $nodeSelected);

    		if (!moved && node.id == $nodeIdSelected) {
    			onNodeClick(e, node.id);
    		}

    		$$invalidate(2, moved = false);
    	};

    	$$self.$$set = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    		if ('key' in $$props) $$invalidate(10, key = $$props.key);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		findOrCreateStore,
    		node,
    		key,
    		onMouseMove,
    		onNodeClick,
    		onTouchMove,
    		nodeSelected,
    		nodeIdSelected,
    		moving,
    		moved,
    		$nodeSelected,
    		$nodeIdSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('node' in $$props) $$invalidate(0, node = $$props.node);
    		if ('key' in $$props) $$invalidate(10, key = $$props.key);
    		if ('moving' in $$props) $$invalidate(1, moving = $$props.moving);
    		if ('moved' in $$props) $$invalidate(2, moved = $$props.moved);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		node,
    		moving,
    		moved,
    		$nodeSelected,
    		$nodeIdSelected,
    		onMouseMove,
    		onNodeClick,
    		onTouchMove,
    		nodeSelected,
    		nodeIdSelected,
    		key,
    		$$scope,
    		slots,
    		mousemove_handler,
    		touchmove_handler,
    		touchstart_handler,
    		touchend_handler,
    		mousedown_handler,
    		mouseup_handler
    	];
    }

    class ImageNode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { node: 0, key: 10 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageNode",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get node() {
    		throw new Error("<ImageNode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set node(value) {
    		throw new Error("<ImageNode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<ImageNode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<ImageNode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Containers/GraphView/index.svelte generated by Svelte v3.54.0 */
    const file$2 = "svelvetrabbit/Containers/GraphView/index.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[21] = list[i];
    	return child_ctx;
    }

    // (90:8) {:else}
    function create_else_block_1(ctx) {
    	let node;
    	let current;

    	node = new Nodes({
    			props: {
    				node: /*node*/ ctx[21],
    				key: /*key*/ ctx[2],
    				derivedEdges: /*derivedEdges*/ ctx[1],
    				nodesStore: /*nodesStore*/ ctx[0],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(node.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(node, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const node_changes = {};
    			if (dirty & /*$nodesStore*/ 16) node_changes.node = /*node*/ ctx[21];
    			if (dirty & /*key*/ 4) node_changes.key = /*key*/ ctx[2];
    			if (dirty & /*derivedEdges*/ 2) node_changes.derivedEdges = /*derivedEdges*/ ctx[1];
    			if (dirty & /*nodesStore*/ 1) node_changes.nodesStore = /*nodesStore*/ ctx[0];

    			if (dirty & /*$$scope, $nodesStore*/ 536870928) {
    				node_changes.$$scope = { dirty, ctx };
    			}

    			node.$set(node_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(node.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(node.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(node, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(90:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (86:33) 
    function create_if_block_5(ctx) {
    	let node;
    	let t;
    	let current;

    	node = new Nodes({
    			props: {
    				node: /*node*/ ctx[21],
    				key: /*key*/ ctx[2],
    				derivedEdges: /*derivedEdges*/ ctx[1],
    				nodesStore: /*nodesStore*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(node.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(node, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const node_changes = {};
    			if (dirty & /*$nodesStore*/ 16) node_changes.node = /*node*/ ctx[21];
    			if (dirty & /*key*/ 4) node_changes.key = /*key*/ ctx[2];
    			if (dirty & /*derivedEdges*/ 2) node_changes.derivedEdges = /*derivedEdges*/ ctx[1];
    			if (dirty & /*nodesStore*/ 1) node_changes.nodesStore = /*nodesStore*/ ctx[0];

    			if (dirty & /*$$scope, $nodesStore*/ 536870928) {
    				node_changes.$$scope = { dirty, ctx };
    			}

    			node.$set(node_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(node.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(node.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(node, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(86:33) ",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if node.image && !node.data.label}
    function create_if_block_4(ctx) {
    	let imagenode;
    	let t;
    	let current;

    	imagenode = new ImageNode({
    			props: {
    				node: /*node*/ ctx[21],
    				key: /*key*/ ctx[2],
    				derivedEdges: /*derivedEdges*/ ctx[1],
    				nodesStore: /*nodesStore*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(imagenode.$$.fragment);
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			mount_component(imagenode, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const imagenode_changes = {};
    			if (dirty & /*$nodesStore*/ 16) imagenode_changes.node = /*node*/ ctx[21];
    			if (dirty & /*key*/ 4) imagenode_changes.key = /*key*/ ctx[2];
    			if (dirty & /*derivedEdges*/ 2) imagenode_changes.derivedEdges = /*derivedEdges*/ ctx[1];
    			if (dirty & /*nodesStore*/ 1) imagenode_changes.nodesStore = /*nodesStore*/ ctx[0];
    			imagenode.$set(imagenode_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagenode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagenode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(imagenode, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(83:8) {#if node.image && !node.data.label}",
    		ctx
    	});

    	return block;
    }

    // (91:10) <Node {node} {key} {derivedEdges} {nodesStore}>
    function create_default_slot_1(ctx) {
    	let t_value = /*node*/ ctx[21].data.label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$nodesStore*/ 16 && t_value !== (t_value = /*node*/ ctx[21].data.label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(91:10) <Node {node} {key} {derivedEdges} {nodesStore}>",
    		ctx
    	});

    	return block;
    }

    // (87:10) <Node {node} {key} {derivedEdges} {nodesStore}>
    function create_default_slot(ctx) {
    	let html_tag;
    	let raw_value = /*node*/ ctx[21].data.html + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty$1();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$nodesStore*/ 16 && raw_value !== (raw_value = /*node*/ ctx[21].data.html + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(87:10) <Node {node} {key} {derivedEdges} {nodesStore}>",
    		ctx
    	});

    	return block;
    }

    // (82:6) {#each $nodesStore as node}
    function create_each_block_2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4, create_if_block_5, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*node*/ ctx[21].image && !/*node*/ ctx[21].data.label) return 0;
    		if (/*node*/ ctx[21].data.html) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(82:6) {#each $nodesStore as node}",
    		ctx
    	});

    	return block;
    }

    // (119:4) {#if $backgroundStore}
    function create_if_block_3(ctx) {
    	let rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "width", "100%");
    			attr_dev(rect, "height", "100%");
    			set_style(rect, "fill", "url(#background-" + /*key*/ ctx[2] + ")");
    			attr_dev(rect, "class", "svelte-1xotsq2");
    			add_location(rect, file$2, 119, 6, 4649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*key*/ 4) {
    				set_style(rect, "fill", "url(#background-" + /*key*/ ctx[2] + ")");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(119:4) {#if $backgroundStore}",
    		ctx
    	});

    	return block;
    }

    // (132:8) {:else}
    function create_else_block(ctx) {
    	let simplebezieredge;
    	let current;

    	simplebezieredge = new SimpleBezierEdge({
    			props: { edge: /*edge*/ ctx[24] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(simplebezieredge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(simplebezieredge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const simplebezieredge_changes = {};
    			if (dirty & /*$derivedEdges*/ 128) simplebezieredge_changes.edge = /*edge*/ ctx[24];
    			simplebezieredge.$set(simplebezieredge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(simplebezieredge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(simplebezieredge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(simplebezieredge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(132:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (130:39) 
    function create_if_block_2(ctx) {
    	let stepedge;
    	let current;

    	stepedge = new StepEdge({
    			props: { edge: /*edge*/ ctx[24] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stepedge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stepedge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stepedge_changes = {};
    			if (dirty & /*$derivedEdges*/ 128) stepedge_changes.edge = /*edge*/ ctx[24];
    			stepedge.$set(stepedge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stepedge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stepedge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stepedge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(130:39) ",
    		ctx
    	});

    	return block;
    }

    // (128:45) 
    function create_if_block_1(ctx) {
    	let smoothstepedge;
    	let current;

    	smoothstepedge = new SmoothStepEdge({
    			props: { edge: /*edge*/ ctx[24] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(smoothstepedge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(smoothstepedge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const smoothstepedge_changes = {};
    			if (dirty & /*$derivedEdges*/ 128) smoothstepedge_changes.edge = /*edge*/ ctx[24];
    			smoothstepedge.$set(smoothstepedge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(smoothstepedge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(smoothstepedge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(smoothstepedge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(128:45) ",
    		ctx
    	});

    	return block;
    }

    // (126:8) {#if edge.type === 'straight'}
    function create_if_block(ctx) {
    	let straightedge;
    	let current;

    	straightedge = new StraightEdge({
    			props: { edge: /*edge*/ ctx[24] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(straightedge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(straightedge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const straightedge_changes = {};
    			if (dirty & /*$derivedEdges*/ 128) straightedge_changes.edge = /*edge*/ ctx[24];
    			straightedge.$set(straightedge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(straightedge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(straightedge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(straightedge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(126:8) {#if edge.type === 'straight'}",
    		ctx
    	});

    	return block;
    }

    // (125:6) {#each $derivedEdges as edge}
    function create_each_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*edge*/ ctx[24].type === 'straight') return 0;
    		if (/*edge*/ ctx[24].type === 'smoothstep') return 1;
    		if (/*edge*/ ctx[24].type === 'step') return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(125:6) {#each $derivedEdges as edge}",
    		ctx
    	});

    	return block;
    }

    // (143:6) {#each $nodesStore as node}
    function create_each_block(ctx) {
    	let edgeanchor0;
    	let edgeanchor1;
    	let current;

    	edgeanchor0 = new EdgeAnchor({
    			props: {
    				x: /*node*/ ctx[21].position.x + /*node*/ ctx[21].width / 2,
    				y: /*node*/ ctx[21].position.y,
    				position: 'top',
    				key: /*key*/ ctx[2],
    				derivedEdges: /*derivedEdges*/ ctx[1],
    				node: /*node*/ ctx[21],
    				nodesStore: /*nodesStore*/ ctx[0]
    			},
    			$$inline: true
    		});

    	edgeanchor1 = new EdgeAnchor({
    			props: {
    				x: /*node*/ ctx[21].position.x + /*node*/ ctx[21].width / 2,
    				y: /*node*/ ctx[21].position.y + /*node*/ ctx[21].height,
    				position: 'bottom',
    				key: /*key*/ ctx[2],
    				derivedEdges: /*derivedEdges*/ ctx[1],
    				node: /*node*/ ctx[21],
    				nodesStore: /*nodesStore*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(edgeanchor0.$$.fragment);
    			create_component(edgeanchor1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(edgeanchor0, target, anchor);
    			mount_component(edgeanchor1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const edgeanchor0_changes = {};
    			if (dirty & /*$nodesStore*/ 16) edgeanchor0_changes.x = /*node*/ ctx[21].position.x + /*node*/ ctx[21].width / 2;
    			if (dirty & /*$nodesStore*/ 16) edgeanchor0_changes.y = /*node*/ ctx[21].position.y;
    			if (dirty & /*key*/ 4) edgeanchor0_changes.key = /*key*/ ctx[2];
    			if (dirty & /*derivedEdges*/ 2) edgeanchor0_changes.derivedEdges = /*derivedEdges*/ ctx[1];
    			if (dirty & /*$nodesStore*/ 16) edgeanchor0_changes.node = /*node*/ ctx[21];
    			if (dirty & /*nodesStore*/ 1) edgeanchor0_changes.nodesStore = /*nodesStore*/ ctx[0];
    			edgeanchor0.$set(edgeanchor0_changes);
    			const edgeanchor1_changes = {};
    			if (dirty & /*$nodesStore*/ 16) edgeanchor1_changes.x = /*node*/ ctx[21].position.x + /*node*/ ctx[21].width / 2;
    			if (dirty & /*$nodesStore*/ 16) edgeanchor1_changes.y = /*node*/ ctx[21].position.y + /*node*/ ctx[21].height;
    			if (dirty & /*key*/ 4) edgeanchor1_changes.key = /*key*/ ctx[2];
    			if (dirty & /*derivedEdges*/ 2) edgeanchor1_changes.derivedEdges = /*derivedEdges*/ ctx[1];
    			if (dirty & /*$nodesStore*/ 16) edgeanchor1_changes.node = /*node*/ ctx[21];
    			if (dirty & /*nodesStore*/ 1) edgeanchor1_changes.nodesStore = /*nodesStore*/ ctx[0];
    			edgeanchor1.$set(edgeanchor1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(edgeanchor0.$$.fragment, local);
    			transition_in(edgeanchor1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(edgeanchor0.$$.fragment, local);
    			transition_out(edgeanchor1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(edgeanchor0, detaching);
    			destroy_component(edgeanchor1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(143:6) {#each $nodesStore as node}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let div1_class_value;
    	let div2_class_value;
    	let t1;
    	let div3;
    	let t2;
    	let svg;
    	let defs;
    	let pattern;
    	let circle;
    	let pattern_id_value;
    	let g;
    	let each1_anchor;
    	let svg_class_value;
    	let svg_viewBox_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*$nodesStore*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let if_block = /*$backgroundStore*/ ctx[3] && create_if_block_3(ctx);
    	let each_value_1 = /*$derivedEdges*/ ctx[7];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*$nodesStore*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_2 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();
    			div3 = element("div");
    			t2 = space();
    			svg = svg_element("svg");
    			defs = svg_element("defs");
    			pattern = svg_element("pattern");
    			circle = svg_element("circle");
    			if (if_block) if_block.c();
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			each1_anchor = empty$1();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "svelvet-container");
    			add_location(div0, file$2, 75, 2, 3236);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`Node Node-${/*key*/ ctx[2]}`) + " svelte-1xotsq2"));
    			add_location(div1, file$2, 80, 4, 3405);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(`Nodes Nodes-${/*key*/ ctx[2]}`) + " svelte-1xotsq2"));
    			add_location(div2, file$2, 78, 2, 3282);
    			attr_dev(div3, "class", "background-container");
    			add_location(div3, file$2, 95, 2, 4093);
    			attr_dev(circle, "id", "dot");
    			attr_dev(circle, "cx", gridSize / 2 - dotSize / 2);
    			attr_dev(circle, "cy", gridSize / 2 - dotSize / 2);
    			attr_dev(circle, "r", "0.5");
    			set_style(circle, "fill", "gray");
    			add_location(circle, file$2, 108, 8, 4415);
    			attr_dev(pattern, "id", pattern_id_value = `background-${/*key*/ ctx[2]}`);
    			attr_dev(pattern, "x", "0");
    			attr_dev(pattern, "y", "0");
    			attr_dev(pattern, "width", gridSize);
    			attr_dev(pattern, "height", gridSize);
    			attr_dev(pattern, "patternUnits", "userSpaceOnUse");
    			add_location(pattern, file$2, 100, 6, 4240);
    			add_location(defs, file$2, 99, 4, 4227);
    			add_location(g, file$2, 123, 4, 4834);
    			attr_dev(svg, "class", svg_class_value = "" + (null_to_empty(`Edges Edges-${/*key*/ ctx[2]}`) + " svelte-1xotsq2"));
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*$widthStore*/ ctx[5] + " " + /*$heightStore*/ ctx[6]);
    			add_location(svg, file$2, 98, 2, 4144);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div1, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, svg, anchor);
    			append_dev(svg, defs);
    			append_dev(defs, pattern);
    			append_dev(pattern, circle);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, g);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g, null);
    			}

    			append_dev(g, each1_anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "contextmenu", prevent_default(/*contextmenu_handler*/ ctx[13]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$nodesStore, key, derivedEdges, nodesStore*/ 23) {
    				each_value_2 = /*$nodesStore*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*key*/ 4 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`Node Node-${/*key*/ ctx[2]}`) + " svelte-1xotsq2"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*key*/ 4 && div2_class_value !== (div2_class_value = "" + (null_to_empty(`Nodes Nodes-${/*key*/ ctx[2]}`) + " svelte-1xotsq2"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty & /*key*/ 4 && pattern_id_value !== (pattern_id_value = `background-${/*key*/ ctx[2]}`)) {
    				attr_dev(pattern, "id", pattern_id_value);
    			}

    			if (/*$backgroundStore*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(svg, g);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$derivedEdges*/ 128) {
    				each_value_1 = /*$derivedEdges*/ ctx[7];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(g, each1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*$nodesStore, key, derivedEdges, nodesStore*/ 23) {
    				each_value = /*$nodesStore*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(g, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_2(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*key*/ 4 && svg_class_value !== (svg_class_value = "" + (null_to_empty(`Edges Edges-${/*key*/ ctx[2]}`) + " svelte-1xotsq2"))) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (!current || dirty & /*$widthStore, $heightStore*/ 96 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*$widthStore*/ ctx[5] + " " + /*$heightStore*/ ctx[6])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const gridSize = 15;
    const dotSize = 10;

    function instance$2($$self, $$props, $$invalidate) {
    	let $backgroundStore;
    	let $movementStore;
    	let $nodeSelected;

    	let $nodesStore,
    		$$unsubscribe_nodesStore = noop$1,
    		$$subscribe_nodesStore = () => ($$unsubscribe_nodesStore(), $$unsubscribe_nodesStore = subscribe(nodesStore, $$value => $$invalidate(4, $nodesStore = $$value)), nodesStore);

    	let $widthStore;
    	let $heightStore;

    	let $derivedEdges,
    		$$unsubscribe_derivedEdges = noop$1,
    		$$subscribe_derivedEdges = () => ($$unsubscribe_derivedEdges(), $$unsubscribe_derivedEdges = subscribe(derivedEdges, $$value => $$invalidate(7, $derivedEdges = $$value)), derivedEdges);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_nodesStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_derivedEdges());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GraphView', slots, []);
    	let d3 = { zoom, zoomTransform: transform, select, selectAll };
    	let { nodesStore } = $$props;
    	validate_store(nodesStore, 'nodesStore');
    	$$subscribe_nodesStore();
    	let { derivedEdges } = $$props;
    	validate_store(derivedEdges, 'derivedEdges');
    	$$subscribe_derivedEdges();
    	let { key } = $$props;

    	// here we lookup the store using the unique key
    	const svelvetStore = findOrCreateStore(key);

    	const { nodeSelected, backgroundStore, movementStore, widthStore, heightStore, d3Scale } = svelvetStore;
    	validate_store(nodeSelected, 'nodeSelected');
    	component_subscribe($$self, nodeSelected, value => $$invalidate(15, $nodeSelected = value));
    	validate_store(backgroundStore, 'backgroundStore');
    	component_subscribe($$self, backgroundStore, value => $$invalidate(3, $backgroundStore = value));
    	validate_store(movementStore, 'movementStore');
    	component_subscribe($$self, movementStore, value => $$invalidate(14, $movementStore = value));
    	validate_store(widthStore, 'widthStore');
    	component_subscribe($$self, widthStore, value => $$invalidate(5, $widthStore = value));
    	validate_store(heightStore, 'heightStore');
    	component_subscribe($$self, heightStore, value => $$invalidate(6, $heightStore = value));

    	onMount(() => {
    		d3.select(`.Nodes-${key}`).call(d3Zoom);

    		/* When this is uncommented and d3.select is called on the Edges class, node linking/creation doesn't work properly */
    		d3.select(`.Edges-${key}`).call(d3Zoom);
    	});

    	// TODO: Update d3Zoom type (refer to d3Zoom docs)
    	let d3Zoom = d3.zoom().filter(() => !$nodeSelected).scaleExtent([0.4, 2]).on('zoom', handleZoom);

    	// function to handle zoom events - arguments: d3ZoomEvent
    	function handleZoom(e) {
    		if (!$movementStore) return;

    		//add a store that contains the current value of the d3-zoom's scale to be used in onMouseMove function
    		d3Scale.set(e.transform.k);

    		// should not run d3.select below if backgroundStore is false
    		if ($backgroundStore) {
    			d3.select(`#background-${key}`).attr('x', e.transform.x).attr('y', e.transform.y).attr('width', gridSize * e.transform.k).attr('height', gridSize * e.transform.k).selectAll('#dot').attr('x', gridSize * e.transform.k / 2 - dotSize / 2).attr('y', gridSize * e.transform.k / 2 - dotSize / 2).attr('opacity', Math.min(e.transform.k, 1));
    		}

    		// transform 'g' SVG elements (edge, edge text, edge anchor)
    		d3.select(`.Edges-${key} g`).attr('transform', e.transform);

    		// d3.select(`.Anchor`).attr('transform', e.transform);
    		// transform div elements (nodes)
    		let transform = d3.zoomTransform(this);

    		// selects and transforms all node divs from class 'Node' and performs transformation
    		d3.select(`.Node-${key}`).style('transform', 'translate(' + transform.x + 'px,' + transform.y + 'px) scale(' + transform.k + ')').style('transform-origin', '0 0');
    	}

    	d3.selectAll();

    	$$self.$$.on_mount.push(function () {
    		if (nodesStore === undefined && !('nodesStore' in $$props || $$self.$$.bound[$$self.$$.props['nodesStore']])) {
    			console.warn("<GraphView> was created without expected prop 'nodesStore'");
    		}

    		if (derivedEdges === undefined && !('derivedEdges' in $$props || $$self.$$.bound[$$self.$$.props['derivedEdges']])) {
    			console.warn("<GraphView> was created without expected prop 'derivedEdges'");
    		}

    		if (key === undefined && !('key' in $$props || $$self.$$.bound[$$self.$$.props['key']])) {
    			console.warn("<GraphView> was created without expected prop 'key'");
    		}
    	});

    	const writable_props = ['nodesStore', 'derivedEdges', 'key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GraphView> was created with unknown prop '${key}'`);
    	});

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('nodesStore' in $$props) $$subscribe_nodesStore($$invalidate(0, nodesStore = $$props.nodesStore));
    		if ('derivedEdges' in $$props) $$subscribe_derivedEdges($$invalidate(1, derivedEdges = $$props.derivedEdges));
    		if ('key' in $$props) $$invalidate(2, key = $$props.key);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		zoom,
    		zoomTransform: transform,
    		select,
    		selectAll,
    		SimpleBezierEdge,
    		StraightEdge,
    		SmoothStepEdge,
    		StepEdge,
    		EdgeAnchor,
    		Node: Nodes,
    		ImageNode,
    		findOrCreateStore,
    		d3,
    		nodesStore,
    		derivedEdges,
    		key,
    		svelvetStore,
    		nodeSelected,
    		backgroundStore,
    		movementStore,
    		widthStore,
    		heightStore,
    		d3Scale,
    		gridSize,
    		dotSize,
    		d3Zoom,
    		handleZoom,
    		$backgroundStore,
    		$movementStore,
    		$nodeSelected,
    		$nodesStore,
    		$widthStore,
    		$heightStore,
    		$derivedEdges
    	});

    	$$self.$inject_state = $$props => {
    		if ('d3' in $$props) d3 = $$props.d3;
    		if ('nodesStore' in $$props) $$subscribe_nodesStore($$invalidate(0, nodesStore = $$props.nodesStore));
    		if ('derivedEdges' in $$props) $$subscribe_derivedEdges($$invalidate(1, derivedEdges = $$props.derivedEdges));
    		if ('key' in $$props) $$invalidate(2, key = $$props.key);
    		if ('d3Zoom' in $$props) d3Zoom = $$props.d3Zoom;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		nodesStore,
    		derivedEdges,
    		key,
    		$backgroundStore,
    		$nodesStore,
    		$widthStore,
    		$heightStore,
    		$derivedEdges,
    		nodeSelected,
    		backgroundStore,
    		movementStore,
    		widthStore,
    		heightStore,
    		contextmenu_handler
    	];
    }

    class GraphView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { nodesStore: 0, derivedEdges: 1, key: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphView",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get nodesStore() {
    		throw new Error("<GraphView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodesStore(value) {
    		throw new Error("<GraphView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get derivedEdges() {
    		throw new Error("<GraphView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set derivedEdges(value) {
    		throw new Error("<GraphView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<GraphView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<GraphView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* svelvetrabbit/Containers/Svelvet/index.svelte generated by Svelte v3.54.0 */
    const file$1 = "svelvetrabbit/Containers/Svelvet/index.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let graphview;
    	let div_style_value;
    	let current;

    	graphview = new GraphView({
    			props: {
    				nodesStore: /*nodesStore*/ ctx[6],
    				derivedEdges: /*derivedEdges*/ ctx[7],
    				key: /*key*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(graphview.$$.fragment);
    			attr_dev(div, "class", "Svelvet svelte-16lqcyz");
    			attr_dev(div, "style", div_style_value = `width: ${/*$widthStore*/ ctx[0]}px; height: ${/*$heightStore*/ ctx[1]}px; background-color: ${/*$backgroundColor*/ ctx[2]}`);
    			add_location(div, file$1, 52, 0, 2346);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(graphview, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$widthStore, $heightStore, $backgroundColor*/ 7 && div_style_value !== (div_style_value = `width: ${/*$widthStore*/ ctx[0]}px; height: ${/*$heightStore*/ ctx[1]}px; background-color: ${/*$backgroundColor*/ ctx[2]}`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graphview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graphview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(graphview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $widthStore;
    	let $heightStore;
    	let $backgroundColor;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Svelvet', slots, []);
    	let { nodes } = $$props;
    	let { edges } = $$props;
    	let { width = 600 } = $$props;
    	let { height = 600 } = $$props;
    	let { background = false } = $$props;
    	let { movement = true } = $$props;
    	let { snap = false } = $$props;
    	let { snapTo = 30 } = $$props;
    	let { bgColor = '#ffffff' } = $$props;

    	// generates a unique string for each svelvet component's unique store instance
    	const key = (Math.random() + 1).toString(36).substring(7);

    	// creates a store that uses the unique sting as the key to create and look up the corresponding store
    	// this way we can have multiple Svelvet Components on the same page and prevent overlap of information
    	const svelvetStore = findOrCreateStore(key);

    	// stores (state) within stores, so that we cannot access values from everywhere
    	const { widthStore, heightStore, nodesStore, derivedEdges, backgroundColor } = svelvetStore;

    	validate_store(widthStore, 'widthStore');
    	component_subscribe($$self, widthStore, value => $$invalidate(0, $widthStore = value));
    	validate_store(heightStore, 'heightStore');
    	component_subscribe($$self, heightStore, value => $$invalidate(1, $heightStore = value));
    	validate_store(backgroundColor, 'backgroundColor');
    	component_subscribe($$self, backgroundColor, value => $$invalidate(2, $backgroundColor = value));

    	// sets the state of the store to the values passed in from the Svelvet Component on initial render
    	onMount(() => {
    		svelvetStore.nodesStore.set(nodes);
    		svelvetStore.edgesStore.set(edges);
    		svelvetStore.widthStore.set(width);
    		svelvetStore.heightStore.set(height);
    		svelvetStore.backgroundStore.set(background);
    		svelvetStore.movementStore.set(movement);
    		svelvetStore.snapgrid.set(snap);
    		svelvetStore.backgroundColor.set(bgColor);
    		svelvetStore.snapResize.set(snapTo);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (nodes === undefined && !('nodes' in $$props || $$self.$$.bound[$$self.$$.props['nodes']])) {
    			console.warn("<Svelvet> was created without expected prop 'nodes'");
    		}

    		if (edges === undefined && !('edges' in $$props || $$self.$$.bound[$$self.$$.props['edges']])) {
    			console.warn("<Svelvet> was created without expected prop 'edges'");
    		}
    	});

    	const writable_props = [
    		'nodes',
    		'edges',
    		'width',
    		'height',
    		'background',
    		'movement',
    		'snap',
    		'snapTo',
    		'bgColor'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Svelvet> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('nodes' in $$props) $$invalidate(9, nodes = $$props.nodes);
    		if ('edges' in $$props) $$invalidate(10, edges = $$props.edges);
    		if ('width' in $$props) $$invalidate(11, width = $$props.width);
    		if ('height' in $$props) $$invalidate(12, height = $$props.height);
    		if ('background' in $$props) $$invalidate(13, background = $$props.background);
    		if ('movement' in $$props) $$invalidate(14, movement = $$props.movement);
    		if ('snap' in $$props) $$invalidate(15, snap = $$props.snap);
    		if ('snapTo' in $$props) $$invalidate(16, snapTo = $$props.snapTo);
    		if ('bgColor' in $$props) $$invalidate(17, bgColor = $$props.bgColor);
    	};

    	$$self.$capture_state = () => ({
    		GraphView,
    		findOrCreateStore,
    		afterUpdate,
    		onMount,
    		nodes,
    		edges,
    		width,
    		height,
    		background,
    		movement,
    		snap,
    		snapTo,
    		bgColor,
    		key,
    		svelvetStore,
    		widthStore,
    		heightStore,
    		nodesStore,
    		derivedEdges,
    		backgroundColor,
    		$widthStore,
    		$heightStore,
    		$backgroundColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('nodes' in $$props) $$invalidate(9, nodes = $$props.nodes);
    		if ('edges' in $$props) $$invalidate(10, edges = $$props.edges);
    		if ('width' in $$props) $$invalidate(11, width = $$props.width);
    		if ('height' in $$props) $$invalidate(12, height = $$props.height);
    		if ('background' in $$props) $$invalidate(13, background = $$props.background);
    		if ('movement' in $$props) $$invalidate(14, movement = $$props.movement);
    		if ('snap' in $$props) $$invalidate(15, snap = $$props.snap);
    		if ('snapTo' in $$props) $$invalidate(16, snapTo = $$props.snapTo);
    		if ('bgColor' in $$props) $$invalidate(17, bgColor = $$props.bgColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		$widthStore,
    		$heightStore,
    		$backgroundColor,
    		key,
    		widthStore,
    		heightStore,
    		nodesStore,
    		derivedEdges,
    		backgroundColor,
    		nodes,
    		edges,
    		width,
    		height,
    		background,
    		movement,
    		snap,
    		snapTo,
    		bgColor
    	];
    }

    class Svelvet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			nodes: 9,
    			edges: 10,
    			width: 11,
    			height: 12,
    			background: 13,
    			movement: 14,
    			snap: 15,
    			snapTo: 16,
    			bgColor: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Svelvet",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get nodes() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nodes(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get edges() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set edges(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get movement() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set movement(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get snap() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set snap(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get snapTo() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set snapTo(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgColor() {
    		throw new Error("<Svelvet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgColor(value) {
    		throw new Error("<Svelvet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.54.0 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let p;
    	let t4;
    	let a;
    	let t6;
    	let t7;
    	let svelvet;
    	let current;

    	svelvet = new Svelvet({
    			props: {
    				nodes: /*initialNodes*/ ctx[1],
    				width: 800,
    				height: 800,
    				initialZoom: 0,
    				initialLocation: { x: 1000, y: 400 },
    				edges: /*initialEdges*/ ctx[2],
    				bgColor: 'pink',
    				background: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			t0 = text("Hello ");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = text("!");
    			t3 = space();
    			p = element("p");
    			t4 = text("Visit the ");
    			a = element("a");
    			a.textContent = "Svelte tutorial";
    			t6 = text(" to learn how to build Svelte apps.");
    			t7 = space();
    			create_component(svelvet.$$.fragment);
    			attr_dev(h1, "class", "svelte-1tky8bj");
    			add_location(h1, file, 104, 1, 2088);
    			attr_dev(a, "href", "https://svelte.dev/tutorial");
    			add_location(a, file, 105, 14, 2125);
    			add_location(p, file, 105, 1, 2112);
    			attr_dev(main, "class", "svelte-1tky8bj");
    			add_location(main, file, 103, 0, 2080);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(main, t3);
    			append_dev(main, p);
    			append_dev(p, t4);
    			append_dev(p, a);
    			append_dev(p, t6);
    			append_dev(main, t7);
    			mount_component(svelvet, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelvet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelvet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(svelvet);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const initialNodes = [
    		{
    			id: 1,
    			position: { x: 150, y: 50 },
    			data: { label: "default styling" },
    			width: 150,
    			height: 40,
    			bgColor: "white"
    		},
    		{
    			id: 2,
    			position: { x: 50, y: 300 },
    			data: { label: "borderColor" },
    			width: 150,
    			height: 40,
    			borderColor: "red",
    			bgColor: "white"
    		},
    		{
    			id: 3,
    			position: { x: 50, y: 150 },
    			data: { label: "textColor" },
    			width: 150,
    			height: 40,
    			textColor: "#3F6FD6",
    			bgColor: "white"
    		},
    		{
    			id: 4,
    			position: { x: 250, y: 150 },
    			data: { label: "Danny Pink" },
    			width: 150,
    			height: 40,
    			textColor: "white",
    			borderColor: "transparent",
    			bgColor: "#FF9ABD"
    		},
    		{
    			id: 5,
    			position: { x: 250, y: 250 },
    			data: { label: "width and height" },
    			width: 90,
    			height: 110,
    			bgColor: "white"
    		},
    		{
    			id: 6,
    			position: { x: 250, y: 400 },
    			data: { label: "borderRadius" },
    			width: 100,
    			height: 100,
    			bgColor: "orange",
    			borderRadius: 30
    		},
    		{
    			id: 7,
    			position: { x: 50, y: 500 },
    			data: { label: "clickCallback" },
    			width: 150,
    			height: 40,
    			bgColor: "white",
    			clickCallback: node => console.log(node)
    		},
    		{
    			id: 8,
    			position: { x: 1000, y: 400 },
    			data: { label: "test" },
    			width: 100,
    			height: 100,
    			bgColor: "orange",
    			borderRadius: 30
    		},
    		{
    			id: 9,
    			position: { x: 0, y: 0 },
    			data: { label: "burp" },
    			width: 0,
    			height: 0,
    			bgColor: "white"
    		}
    	];

    	const initialEdges = [
    		{
    			id: "e1-2",
    			source: 1,
    			target: 2,
    			label: "connection"
    		},
    		{
    			id: "e2-3",
    			source: 2,
    			target: 5,
    			label: "label"
    		},
    		{
    			id: "e1-4",
    			source: 5,
    			target: 6,
    			label: "box",
    			animate: true,
    			arrow: true
    		},
    		{
    			id: "e2-5",
    			source: 6,
    			target: 7,
    			animate: true
    		}
    	];

    	let { name } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (name === undefined && !('name' in $$props || $$self.$$.bound[$$self.$$.props['name']])) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	});

    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		Svelvet,
    		initialNodes,
    		initialEdges,
    		name
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, initialNodes, initialEdges];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
