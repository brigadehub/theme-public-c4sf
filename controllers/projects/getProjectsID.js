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
    brigade: res.locals.brigade.slug,
    id: req.params.projectId
  }, function (err, foundProject) {
    if (err) console.error(err)
    if (foundProject === null) {
      res.redirect('/projects/')
      return
    }

    foundProject.content = md.render(foundProject.content)
    if (foundProject.contact.length) {
      Projects.fetchGitHubUsers(foundProject.contact, function (contactList) {
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
