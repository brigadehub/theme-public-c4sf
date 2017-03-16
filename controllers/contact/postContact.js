
module.exports = {
  method: 'post',
  endpoint: '/contact',
  middleware: [],
  controller: postContact
}

function postContact (req, res) {
  var Users = req.models.Users
  var uniquecheck = {}
  for (var key in req.body) {
    if (req.body[key].contactrank) {
      if (!uniquecheck[req.body[key].contactrank]) {
        uniquecheck[req.body[key].contactrank] = 'present'
      } else {
        req.flash('errors', {msg: 'Changes failed. Please enter unique values for contact page ranks'})
        res.redirect('/contact/edit')
        return
      }
    }
  }
  Users.find({$or: [{'roles.core': true}, {'roles.coreLead': true}, {'roles.superAdmin': true}]}, function (err, foundUsers) {
    if (err) console.error(err)
    foundUsers.forEach(function (user) {
      var thisUser = new Users(user)
      thisUser.profile.contactpagerank = req.body[thisUser.username].contactrank
      if (req.body[thisUser.username].showcontact) {
        thisUser.profile.showcontact = true
      } else {
        thisUser.profile.showcontact = false
      }
      thisUser.save(function (err) {
        if (err) console.error(err)
      })
    })
  })
  res.redirect('/contact/edit')
}
