
// TODO(therebelrobot): Move these into manage checkin page

/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/checkin',
  middleware: [],
  controller: getCheckin
}

/**
 *  Controller
 */
function getCheckin (req, res, next) {
  const eventId = req.query.eventid || ''
  const defaultSkills = req.config.defaultSkills
  const defaultLocations = req.config.defaultLocations
  const defaultReferredBy = req.config.defaultReferredBy
  res.render(res.theme.public + '/views/checkin/index', {
    title: 'Check in',
    view: 'checkin',
    brigade: res.locals.brigade,
    user: res.locals.user,
    locations: defaultLocations,
    skills: defaultSkills,
    referredBy: defaultReferredBy,
    eventId
  })
}
