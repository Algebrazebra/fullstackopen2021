import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import CreateNewBlog from './CreateNewBlog'


const blog = {
  title: 'title',
  author: 'author',
  url: 'url.com',
  likes: 0,
}

describe('Blog component', () => {

  test('blog component renders only title and author', () => {
    const component = render(<Blog blog={blog} />)
    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent('title')
    expect(div).toHaveTextContent('author')
    expect(div).not.toHaveTextContent('url.com')
    expect(div).not.toHaveTextContent('0')
  })

  test('blog component renders details after clicking show', () => {
    const component = render(<Blog blog={blog} />)
    const showButton = component.getByText('view')
    fireEvent.click(showButton)
    const div = component.container.querySelector('.blogDetail')
    expect(div).toHaveTextContent('url.com')
    expect(div).toHaveTextContent('0')
  })

  test('clicking the like button twice registers twice with event handler', () => {
      const mockLikeHandler = jest.fn()
      const component = render(<Blog blog={blog} likeHandler={mockLikeHandler} />)
      const showButton = component.getByText('view')
      fireEvent.click(showButton)
      const likeButton = component.getByText('like')
      fireEvent.click(likeButton)
      fireEvent.click(likeButton)
      expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })

})

describe('CreateNewBlog component', () => {

  test('Event handler is called correctly when submitting a new blog', () => {
    const mockCreateHandler = jest.fn()
    const component = render(<CreateNewBlog handleBlogCreation={mockCreateHandler}/>)
    
    const form = component.container.querySelector('form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, {
      target: { value: 'title' }
    })
    fireEvent.change(author, {
      target: { value: 'author' }
    })
    fireEvent.change(url, {
      target: { value: 'url.com' }
    })
    fireEvent.submit(form)
    expect(mockCreateHandler.mock.calls).toHaveLength(1)
    expect(mockCreateHandler.mock.calls[0][1]).toBe('title')
    expect(mockCreateHandler.mock.calls[0][2]).toBe('author')
    expect(mockCreateHandler.mock.calls[0][3]).toBe('url.com')
  })

})
