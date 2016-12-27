/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/account',
  authenticated: true,
  middleware: [],
  controller: getAccount
}

/**
 *  Controller
 */

function getAccount (req, res) {
  res.render(res.theme.public + '/views/account/profile', {
    view: 'account-settings',
    title: 'Account Management',
    brigade: res.locals.brigade
  })
}
