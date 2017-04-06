
var _ = require('lodash')

module.exports = {
  method: 'get',
  endpoint: '/projects',
  middleware: [],
  controller: getProjects
}

function getProjects (req, res) {
  var Projects = req.models.Projects
  var mongooseQuery = {}
  // var page
  if (req.query.keywords) {
    if (!_.isArray(req.query.keywords)) req.query.keywords = [req.query.keywords]
    mongooseQuery.keywords = {
      $in: req.query.keywords
    }
  }
  if (req.query.needs) {
    if (!_.isArray(req.query.needs)) req.query.needs = [req.query.needs]
    mongooseQuery.needs = {
      $in: req.query.needs
    }
  }
  let searchTerm = req.query.search
  // if (req.query.page) {
  //   page = req.query.page
  // }
  Projects.find({}, function (err, foundProjects) {
    if (err) console.error(err)
    var allKeywords = []
    var allNeeds = []
    if (searchTerm) foundProjects = filterSearchTerm(foundProjects, searchTerm)
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
    const totalProjects = foundProjects && foundProjects.length
    Projects.find(mongooseQuery, function (err, foundProjects) {
      if (err) console.error(err)
      if (!req.query.showall || req.query.showall === 'false') {
        foundProjects = foundProjects.filter((project) => {
          return project.active
        })
      }
      if (searchTerm) foundProjects = filterSearchTerm(foundProjects, searchTerm)
      res.render(res.theme.public + '/views/projects/index', {
        view: 'project-list',
        title: 'Projects',
        brigade: res.locals.brigade,
        projects: foundProjects,
        selectedKeywords: req.query.keywords || [],
        selectedNeeds: req.query.needs || [],
        keywords: allKeywords.sort(),
        needs: allNeeds.sort(),
        showingInactive: req.query.showall === 'true',
        totalProjects,
        searchTerm
      })
    })
  })
}

function filterSearchTerm (projects, searchTerm) {
  searchTerm = searchTerm.toLowerCase()
  console.log('searchTerm', searchTerm)
  projects = projects.filter((project) => {
    let keywordsContainTerm
    let needsContainTerm
    const titleContainsTerm = project.name.toLowerCase().indexOf(searchTerm) > -1
    const descriptionContainsTerm = project.description.toLowerCase().indexOf(searchTerm) > -1
    console.log('getting here', project.keywords, project.needs)
    _.forEach(project.keywords, function (keyword) {
      if (keyword && keyword.toLowerCase().indexOf(searchTerm) > -1) keywordsContainTerm = true
    })
    _.forEach(project.needs, function (need) {
      if (need && need.toLowerCase().indexOf(searchTerm) > -1) needsContainTerm = true
    })
    console.log('getting here')
    const searchTermPresent = keywordsContainTerm || needsContainTerm || titleContainsTerm || descriptionContainsTerm
    console.log(searchTermPresent)
    return searchTermPresent
  })
  return projects
}
