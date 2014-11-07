/**
 * Module dependencies.
 */

var pathToRegexp = require('path-to-regexp');
var debug = require('debug')('koa-route');
var compose = require('koa-compose');
var methods = require('methods');
var slice = require('sliced');

/**
 * Expose `methods`
 */

methods.forEach(function(method){
  exports[method] = create(method);
});

exports.del = exports.delete;
exports.all = create();

/**
 * Create a function given a `method`
 *
 * @param {Strign} method
 * @return {Function}
 * @api private
 */

function create(method) {
  if (method) method = method.toUpperCase();

  return function(path, fn){
    var keys = [];
    var re = pathToRegexp(path, keys);
    var fn = compose(slice(arguments, 1));
    debug('%s %s -> %s', method, path, re);

    return function *(next){
      var m;

      // method
      if (method && method != this.method) return yield next;

      // path
      if (m = re.exec(this.path)) {
        this.params = match(m, keys);
        debug('%s %s matches %s %j', this.method, path, this.path, this.params);
        yield fn.call(this, next);
        return;
      }

      // miss
      yield next;
    }
  }
}

/**
 * Check if this route matches `path`, if so
 * populate `keys`.
 *
 * @param {Match} m
 * @param {Array} keys
 * @return {Boolean}
 * @api private
 */

function match(m, keys){
  var params = [];

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];

    var val = 'string' === typeof m[i]
      ? decode(m[i])
      : m[i];

    if (key) {
      params[key.name] = undefined !== params[key.name]
        ? params[key.name]
        : val;
    } else {
      params.push(val);
    }
  }

  return params;
};

/**
 * Decode value.
 *
 * @param {String} val
 * @return {String}
 * @api private
 */

function decode(val) {
  if (val) return decodeURIComponent(val);
}
