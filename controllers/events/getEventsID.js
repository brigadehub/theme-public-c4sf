module.exports = {
  method: 'get',
  endpoint: '/events/:eventId',
  middleware: [],
  controller: getEventsID
}

function getEventsID (req, res) {
  res.render(res.locals.brigade.theme.slug + '/views/events/event', {
    view: 'event',
    eventID: req.params.eventID,
    title: 'Events',
    brigade: res.locals.brigade
  })
}
