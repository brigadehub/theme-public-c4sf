var slug = require('slug')
var markdown = require('markdown-it')
var mdnh = require('markdown-it-named-headers')
var md = markdown({ html: true }).use(mdnh)

module.exports = {
  method: 'get',
  endpoint: '/projects/:projectId',
  middleware: [],
  controller: getProjectsID
}

function getProjectsID (req, res) {
  var Projects = req.models.Projects
  var Users = req.models.Users
  Projects.findOne({
    id: req.params.projectId
  }, function (err, foundProject) {
    if (err) console.error(err)
    if (foundProject === null) {
      req.flash('errors', {msg: `Unable to find project with id ${req.params.projectId}`})
      res.redirect('/projects/')
      return
    }
    foundProject.repositories = foundProject.repositories || []
    foundProject.content = md.render(foundProject.content)
    if (foundProject.contact.length) {
      Projects.fetchGithubUsers(foundProject.contact, function (contactList) {
        res.render(res.theme.public + '/views/projects/project', {
          view: 'project',
          projectId: req.params.projectId,
          title: foundProject.name,
          brigade: res.locals.brigade,
          project: foundProject,
          contacts: contactList
        })
      })
    } else {
      res.render(res.theme.public + '/views/projects/project', {
        view: 'project',
        projectId: req.params.projectId,
        title: foundProject.name,
        brigade: res.locals.brigade,
        project: foundProject,
        contacts: []
      })
    }
  })
}
