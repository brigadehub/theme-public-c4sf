/**
 *  Dependencies
 */

 var markdown = require('markdown-it')
 var mdnh = require('markdown-it-named-headers')
 var md = markdown({ html: true }).use(mdnh)

/**
 *  Exports
 */

 module.exports = {
   method: 'get',
   endpoint: '/blog/post/:blogId',
   middleware: [],
   controller: getBlogID
 }

/**
 *  Controller
 */

 function getBlogID (req, res) {
   var Post = req.models.Posts
   Post.find({slug: req.params.blogId}, function (err, post) {
     if (err) throw err
     post = post[0]
     if (post === undefined) {
       res.sendStatus(404)
       return
     }
     post.content = md.render(post.content)
     res.render(res.theme.public + '/views/blog/post', {
       view: 'blog-post',
       blogId: req.params.blogId,
       title: 'Blog',
       brigade: res.locals.brigade,
       user: res.locals.user,
       post: post
     })
   })
 }
