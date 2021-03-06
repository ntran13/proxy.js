
var config = require('../../config')

module.exports = remotes

remotes.hostname = config.hostname
// all the names of supported remotes
var names = remotes.names = []
// all supported proxies
var aliases = remotes.aliases = [
  'nlz.io'
]
if (!~aliases.indexOf(remotes.hostname))
  aliases.push(remotes.hostname)

require('fs').readdirSync(__dirname).forEach(function (name) {
  if (name[0] === '.') return
  if (name === 'index.js') return
  names.push(name = name.replace(/\.js$/, ''))
  var remote = remotes[name] = require('./' + name)
  remote.name = name
  var aliases = remote.aliases
  if (!~aliases.indexOf(remote.hostname)) aliases.push(remote.hostname)
  if (!~aliases.indexOf(name)) aliases.push(name)
  var shorthand = remote.shorthand
  if (shorthand && !~aliases.indexOf(shorthand)) aliases.push(shorthand)
})

/**
 * Look up a remote by a hostname or a name.
 *
 * @param {String} hostname
 * @return {Object} remote
 * @api public
 */

function remotes(hostname) {
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    var remote = remotes[name]
    if (name === hostname) return remote
    if (~remote.aliases.indexOf(hostname)) return remote
  }
  var err = new Error('Invalid remote: ' + hostname)
  err.status = 404
  throw err
}
