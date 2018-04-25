// Use for hash
export function getParameterByName(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(location.hash)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}