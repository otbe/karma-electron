(function () {
  // Based off of https://github.com/atom/electron/blob/v0.36.9/atom/common/lib/init.js#L34-L47
  // Bind parent window's node integration to this closure
  // DEV: Due to using an `iframe`, we lose the node integration inheritance =/
  // DEV: We use a closure since `__filename`/`__dirname` and relative requires change based on file
  // DEV: We skip error handlers so Karma can catch them
  var __parentWindow = window.parent || {};
  var module = __parentWindow.module ? __parentWindow.module : undefined;
  // DEV: Ignore JSHint errors about unused variables
  // jshint ignore:start
  var process = __parentWindow.process ? __parentWindow.process : undefined;
  var setImmediate = __parentWindow.setImmediate ? __parentWindow.setImmediate : undefined;
  var clearImmediate = __parentWindow.clearImmediate ? __parentWindow.clearImmediate : undefined;
  var global = __parentWindow.module ? window : undefined;
  // jshint ignore:end
  var __filename = __parentWindow.module ? '{{!filename}}' : undefined;
  var __dirname = __parentWindow.module ? '{{!dirname}}' : undefined;

  // Set up local requires
  var require;
  if (__filename) {
    // Save original require/require.resolve
    var __require = __parentWindow.require;
    var __requireResolve = __require.resolve;

    // Add our base directory as the path to find node modules from
    if (!window.__karmaBasePathAddedToModule) {
      module.paths = module.paths.concat(__require('module')._nodeModulePaths('{{!karmaBasePath}}'));
      window.__karmaBasePathAddedToModule = true;
    }

    // Define our patched require/require.resolve
    var __requireFilepath = function (filepath) {
      // If the filepath is relative, prepend the filename
      // e.g. `./submodule` -> `/home/todd/.../integration-test/./submodule`
      if (filepath && filepath[0] === '.') {
        filepath = __dirname + '{{!sep}}' + filepath;
      }

      // Return our filepath
      return filepath;
    };
    // Define our require/resolve.resolve
    require = function (filepath) {
      return __require(__requireFilepath(filepath));
    };
    require.resolve = function (filepath) {
      return __requireResolve(__requireFilepath(filepath));
    };
  }

  // Unset our `__parentWindow` to prevent leaks
  // jscs:disable
  __parentWindow = undefined;

  // Inject our content
  // jshint ignore:start
  {{!content}}
  // jshint ignore:end
}());
// Inject sourceMaps
// jshint ignore:start
{{sourceMap}}
// jshint ignore:end
// jscs:enable
