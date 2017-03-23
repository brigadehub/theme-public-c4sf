/**
 *  Dependencies
 */

var moment = require('moment')
require('moment-timezone') // shim moment with the timezone functions
var _ = require('lodash')

/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/',
  middleware: [],
  controller: getIndex
}

/**
 *  Controller
 */

function getIndex (req, res) {
  var Projects = req.models.Projects
  var Events = req.models.Events
  var Posts = req.models.Posts
  const ctx = { req, res }
  getEvents(Events, ctx)
    .then((results) => getProjects(Projects, results, ctx))
    .then((results) => getPosts(Posts, results, ctx))
    .then(({ foundEvents, currentEvents, allKeywords, foundProjects, foundPosts, posts }) => {
      // adjust project count to reflect active projects
      var projectDisplay = _.find(res.locals.brigade.displayedstats, {'caption': 'Active Projects'})
      if (projectDisplay) {
        projectDisplay.stat = foundProjects.length
      }

      res.render(res.theme.public + '/views/home', {
        view: 'home',
        title: 'Home',
        checkin: (moment().tz(res.locals.brigade.location.timezone).format('dddd') === res.locals.brigade.checkIn.day),
        brigade: res.locals.brigade,
        projectcount: foundProjects.length,
        postcount: posts,
        projects: foundProjects,
        events: foundEvents.slice(0, 3),
        posts: foundPosts,
        nowTime: moment(new Date()).unix(),
        currentEvents
      })
    })
    .catch((err) => {
      console.log(err, 'ERROR')
      res.status(500).send({error: err})
    })
}

function getEvents (Events, ctx) {
  const res = ctx.res
  return new Promise((resolve, reject) => {
    Events.find({}, function (err, foundEvents) {
      if (err) reject(err)
      foundEvents = _.sortBy(foundEvents, 'start')
      foundEvents = foundEvents.filter(function (event) {
        return event.end >= moment().unix()
      }).map(function (event) {
        event.startDate = moment.unix(event.start).tz(res.locals.brigade.location.timezone).format('MMM DD')
        return event
      })
      var currentEvents = foundEvents.filter(function (event) {
        return event.start <= moment().unix() && event.end >= moment().unix()
      }).length
      resolve({ foundEvents, currentEvents })
    })
  })
}
function getProjects (Projects, { foundEvents, currentEvents }, ctx) {
  return new Promise((resolve, reject) => {
    Projects.find({active: true}).limit(3).exec(function (err, foundProjects) {
      if (err) reject(err)
      var allKeywords = []
      foundProjects.forEach(function (project) {
        project.keywords.forEach(function (keyword) {
          if (allKeywords.indexOf(keyword) < 0) {
            allKeywords.push(keyword)
          }
        })
      })
      resolve({ foundEvents, currentEvents, allKeywords, foundProjects })
    })
  })
}
function getPosts (Posts, { foundEvents, currentEvents, allKeywords, foundProjects }, ctx) {
  return new Promise((resolve, reject) => {
    Posts.find({}).sort({ date: -1 }).limit(3).exec(function (err, foundPosts) {
      if (err) reject(err)
      var posts = foundPosts.length
      resolve({ foundEvents, currentEvents, allKeywords, foundProjects, foundPosts, posts })
    })
  })
}
