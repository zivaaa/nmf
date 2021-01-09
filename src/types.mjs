/**
 * @namespace nmf
 */

/**
 * @namespace nmf
 */

/**
 * @callback nmf.ActionFn
 * @memberOf nmf
 * @async
 * @param  {nmf.App} app - приложение
 */

/**
 * @typedef nmf.Action
 * @memberOf nmf
 * @type {object}
 * @property {string} name
 * @property {string} [description]
 * @property {nmf.ActionFn} fn
 */

/**
 * @memberOf nmf
 * @typedef {Object} nmf.AppBinding
 * @property {string|Symbol|any} key
 * @property {any} value
 */

/**
 * @memberOf nmf
 * @typedef {object} nmf.AppConfig
 * @property {object} config
 * @property {nmf.Provider[]} providers
 * @property {nmf.AppBinding[]} bindings
 * @property {nmf.Action[]} actions
 *
 */

/**
 * @memberOf nmf
 * @function nmf.AppConfigFn
 * @param {nmf.App} app
 * @return {nmf.AppConfig}
 *
 */

/**
 * @memberOf nmf
 * @typedef {Object} nmf.AppConfigResolverFn
 * @property {string} root
 * @property {nmf.Provider[]} [coreProviders]
 * @property {function(app:nmf.App):nmf.AppConfig} config
 *
 */

/**
 * @memberOf nmf
 * @callback nmf.ProviderBindFn
 * @async
 * @param {nmf.App} app
 * @return {Promise<void>}
 */

/**
 * @memberOf nmf
 * @callback nmf.ProviderResolveFn
 * @async
 * @param {nmf.App} app
 * @return {Promise<void>}
 */


/**
 * @memberOf nmf
 * @typedef {Object} nmf.Provider
 * @property {nmf.ProviderBindFn} bind
 * @property {nmf.ProviderResolveFn} resolve
 */

/**
 * @memberOf nmf
 * @typedef {Object.<string, any>} nmf.Tools
 * @property {nmf.App} app
 * @property {nmf.Context} ctx
 */

export const unused = {};