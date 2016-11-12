const defaultSkills = require('config/defaultSkills.json')
const defaultLocations = require('config/defaultLocations.json')
const defaultReferredBy = require('config/defaultReferredBy.json')
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
  res.render(res.locals.brigade.theme.slug + '/views/checkin/index', {
    title: 'Check in',
    view: 'checkin',
    brigade: res.locals.brigade,
    user: res.locals.user,
    locations: defaultLocations,
    skills: defaultSkills,
    referredBy: defaultReferredBy
  })
}
