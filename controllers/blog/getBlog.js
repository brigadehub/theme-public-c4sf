/**
 *  Dependencies
 */

 var markdown = require('markdown-it')
 var mdnh = require('markdown-it-named-headers')
 var md = markdown({ html: true }).use(mdnh)
 var _ = require('lodash')
 var moment = require('moment')
 var slugify = require('slugify')

/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/blog',
  middleware: [],
  controller: getBlog
}

/**
 *  Controller
 */

function getBlog (req, res) {
  var Post = req.models.Posts
  var User = req.models.Users
   var POSTS_PER_PAGE = 9
   var page = 1

   var mongooseQuery = {}
   if (req.query.tag) {
     mongooseQuery.tags = req.query.tag
   }
   if (req.query.page) {
     page = req.query.page
   }
   var user = res.locals.user
   Post.find({ published: true }, function (err, posts) {
     if (err) console.error(err)
     var tags = _.uniq(_.flatMap(posts, 'tags'))
     Post.find(mongooseQuery, function (err, posts) {
       if (err) console.error(err)
       if (user && user.isBlogger()) {
         if (!user.isAdmin()) {
           posts = _.filter(posts, function (post) { return post.published || (user && post.author === user.username) })
         }
       } else {
         // most users only see published posts
         posts = _.filter(posts, function (post) { return post.published })
       }
       posts = _.sortBy(posts, 'date')
       posts = posts.reverse()
       var postStart = (page - 1) * POSTS_PER_PAGE
       var totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
       var pagePosts = posts.splice(postStart, POSTS_PER_PAGE)

       var currentUrl = '/blog'
       if (req.query.tag) {
         currentUrl += '?tag=' + req.query.tag + '&' + 'page='
       } else {
         currentUrl += '?' + 'page='
       }

       res.render(res.theme.public + '/views/blog/index', {
         title: 'Blog',
         view: 'blog-list',
         brigade: res.locals.brigade,
         user: user,
         posts: pagePosts,
         tags: tags,
         selectedTag: req.query.tag,
         page: page,
         totalPages: totalPages,
         currentUrl: currentUrl
       })
     })
   })
 }
