
/**
 *  Exports
 */

module.exports = {
  method: 'post',
  endpoint: '/checkin',
  middleware: [],
  controller: postCheckin
}

/**
 *  Controller
 */
function postCheckin (req, res, next) {
  const Checkins = req.models.Checkins
  const formResponse = req.body
  formResponse.mailingList = formResponse.mailingList === 'mailingList'
  formResponse.date = new Date()
  const lead = {}
  for (let field in formResponse) {
    if (field.indexOf('expectedAttendance-') > -1) {
      const teamName = field.split('expectedAttendance-')[1]
      lead[teamName] = lead[teamName] || {}
      lead[teamName].expectedAttendance = formResponse[field]
    }
    if (field.indexOf('reserve-') > -1) {
      const teamName = field.split('reserve-')[1]
      lead[teamName] = lead[teamName] || {}
      lead[teamName].reserve = formResponse[field]
    }
  }
  formResponse.lead = lead
  formResponse.event = formResponse.eventId
  delete formResponse.eventId
  const checkin = new Checkins(formResponse)
  checkin.save((err, checkin) => {
    console.log('checked in!', err)
    if (err) {
      console.error(err)
      req.flash('error', { msg: 'An error occured while checkin in. Please notify a core team member.' })
      return res.redirect('/checkin')
    }
    req.flash('success', { msg: 'Thank you for checking in!' })
    res.redirect('/')
  })
}
