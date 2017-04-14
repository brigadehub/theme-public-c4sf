const moment = require('moment')
// const uuid = require('node-uuid')
require('moment-timezone')

module.exports = {
  method: 'get',
  endpoint: '/events/:eventId',
  middleware: [],
  controller: getEventsID
}

function getEventsID (req, res) {
  var Events = req.models.Events
  Events.findOne({
    id: req.params.eventId
  }, function (err, foundEvent) {
    if (err) {
      console.log(err)
      req.flash('errors', {msg: 'Unable to find event something whent wrong'})
      res.redirect('/events/')
      return
    }
    if (foundEvent === null) {
      req.flash('errors', {msg: `Unable to find event with id ${req.params.eventId}`})
      res.redirect('/events/')
      return
    } else {
      foundEvent.convertedStart = moment.unix(foundEvent.start).tz(res.locals.brigade.location.timezone).format('MMMM DD, YYYY ha')
      res.render(res.theme.public + '/views/events/event', {
        view: 'event',
        eventId: req.params.eventId,
        title: foundEvent.title,
        brigade: res.locals.brigade,
        event: foundEvent
      })
    }
  })
}
