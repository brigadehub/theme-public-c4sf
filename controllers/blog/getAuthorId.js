module.exports = {
  method: 'get',
  endpoint: '/author/:authorId',
  authenticated: true,
  middleware: [],
  controller: getAuthorId
}

function getAuthorId (req, res) {

}
