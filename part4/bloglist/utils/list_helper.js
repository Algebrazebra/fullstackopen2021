const _ = require('lodash')

const totalLikes = (blogs) => {
  return blogs
    .reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? {}
    : blogs.reduce((favorite, blog) => favorite.likes > blog.likes ? favorite : blog)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    const blogsByAuthor = _.countBy(blogs, 'author')
    const mostBlogsAuthor = Object.keys(blogsByAuthor)
      .reduce((a, b) =>
        blogsByAuthor[a] > blogsByAuthor[b]
          ? a
          : b
      , {})
    return {'author': mostBlogsAuthor, 'blogs': blogsByAuthor[mostBlogsAuthor]}
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {}
  } else {
    const groups = _.groupBy(blogs, 'author')
    const result = _.map(groups, (value, key) => {
      return {
        'author': key,
        'likes': _.reduce(value, (total, blog) => total + blog.likes, 0)
      }
    })
    return result.reduce((max, item) => max.likes > item.likes ? max : item)
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}