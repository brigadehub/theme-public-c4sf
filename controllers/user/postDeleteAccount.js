/**
 *  Exports
 */

module.exports = {
  method: 'post',
  endpoint: '/account/delete',
  authenticated: true,
  middleware: [],
  controller: postDeleteAccount
}

/**
 *  Controller
 */

function postDeleteAccount (req, res, next) {
  var Users = req.models.Users
  if (req.body['verify-account-deletion-string'] === 'delete my account') {
    Users.remove({ _id: req.user.id }, function (err) {
      if (err) {
        return next(err)
      }
      req.logout()
      req.flash('info', { msg: 'Your account has been deleted.' })
      res.redirect('/')
    })
  } else {
    req.flash('info', { msg: 'You didn\'t type the required phrase, so your account was not deleted.' })
    res.redirect('back')
  }
}
