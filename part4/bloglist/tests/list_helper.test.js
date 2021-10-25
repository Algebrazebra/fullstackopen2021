const listHelper = require('../utils/list_helper')
const testBlogs = require('./test_blog_list')

const emptyBlogList = []
const listWithOneBlog = [testBlogs[0]]
const listWithManyBlogs = testBlogs

test('dummy returns one', () => {
  const result = listHelper.dummy(emptyBlogList)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has many blogs, correctly sums likes', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(36)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(7)
  })
  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes(emptyBlogList)
    expect(result).toBe(0)
  })
})

describe('favorite blog', () => {
  test('when list has many blogs, selects most liked one', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    expect(result).toEqual(testBlogs[2])
  })
  test('when list has one blog, select that one', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual = listWithOneBlog[0]
  })
  test('when list is empty, returns empty object', () => {
    const result = listHelper.favoriteBlog(emptyBlogList)
    expect(result).toEqual({})
  })
})

describe('most blogs', () => {
  test('finds author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    expect(result).toEqual({
      'author': 'Robert C. Martin',
      'blogs': 3
    })
  })
  test('when list is empty, returns empty object', () => {
    const result = listHelper.mostBlogs(emptyBlogList)
    expect(result).toEqual({})
  })
})

describe('most likes', () => {
  test('finds author with most likes', () => {
    const result = listHelper.mostLikes(listWithManyBlogs)
    expect(result).toEqual({
      'author': 'Edsger W. Dijkstra',
      'likes': 17
    })
  })
  test('when list is empty, returns empty object', () => {
    const result = listHelper.mostLikes(emptyBlogList)
    expect(result).toEqual({})
  })
})