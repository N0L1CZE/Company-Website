// __mocks__/nextLink.js
const React = require('react')
module.exports = ({ href, children }) => {
  return React.createElement('a', { href }, children)
}