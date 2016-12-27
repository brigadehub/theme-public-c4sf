var nodemailer = require('nodemailer')
module.exports = {
  method: 'get',
  endpoint: '/contact',
  middleware: [],
  controller: getContact
}

function getContact (req, res) {
  var Users = req.models.Users
  Users.find({$or: [{'roles.core': true}, {'roles.coreLead': true}, {'roles.superAdmin': true}]}, function (err, foundUsers) {
    if (err) console.error(err)
    res.render(res.theme.public + '/views/contact/index', {
      view: 'contact',
      users: foundUsers,
      title: 'Contact',
      brigade: res.locals.brigade
    })
  }).sort({'profile.contactpagerank': 1})
}
