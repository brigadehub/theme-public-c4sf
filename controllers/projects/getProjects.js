var slug = require('slug')
var markdown = require('markdown-it')
var mdnh = require('markdown-it-named-headers')
var md = markdown({ html: true }).use(mdnh)

module.exports = {
  method: 'get',
  endpoint: '/projects',
  middleware: [],
  controller: getProjects
}

function getProjects (req, res) {
  var Projects = req.models.Projects
  var Users = req.models.Users
  var mongooseQuery = {brigade: res.locals.brigade.slug}
  // var page
  if (req.query.keyword) {
    mongooseQuery.keywords = req.query.keyword
  }
  if (req.query.need) {
    mongooseQuery.needs = req.query.need
  }
  // if (req.query.page) {
  //   page = req.query.page
  // }
  Projects.find({}, function (err, foundProjects) {
    if (err) console.error(err)
    var allKeywords = []
    var allNeeds = []
    foundProjects.forEach(function (project) {
      project.keywords.forEach(function (keyword) {
        if (allKeywords.indexOf(keyword) < 0) {
          allKeywords.push(keyword)
        }
      })
      project.needs.forEach(function (need) {
        if (allNeeds.indexOf(need) < 0) {
          allNeeds.push(need)
        }
      })
    })
    const totalProjects = foundProjects.length
    Projects.find(mongooseQuery, function (err, foundProjects) {
      if (err) console.error(err)
      if (!req.query.showall) {
        foundProjects = foundProjects.filter((project) => {
          return project.active
        })
      }
      res.render(res.locals.brigade.theme.slug + '/views/projects/index', {
        view: 'project-list',
        title: 'Projects',
        brigade: res.locals.brigade,
        projects: foundProjects,
        selectedKeyword: req.query.keyword,
        selectedNeed: req.query.need,
        keywords: allKeywords.sort(),
        needs: allNeeds.sort(),
        showingInactive: req.query.showall,
        totalProjects: totalProjects
      })
    })
  })
}
