const moment = require('moment')
require('moment-timezone')

module.exports = {
  method: 'get',
  endpoint: '/events',
  middleware: [],
  controller: getEvents
}

function getEvents (req, res) {
  const Events = req.models.Events
  Events.find({}, function (err, foundEvents) {
    if (err) console.error(err)
    const mappedEvents = foundEvents.filter(function (event) {
      return event.start > moment().unix()
    }).map(function (event) {
      event.convertedstart = moment.unix(event.start).tz(res.locals.brigade.location.timezone).format('MMMM DD, YYYY ha z')
      return event
    })
    res.render(res.theme.public + '/views/events/index', {
      view: 'event-list',
      events: mappedEvents,
      upcomingevents: mappedEvents.slice(0, 10),
      title: 'Events',
      brigade: res.locals.brigade
    })
  }).sort({start: 1})
}
