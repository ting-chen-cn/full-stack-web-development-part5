const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  const promiseArray = helper.initialUsers.map((u) =>
    helper.userSave(u)
  )
  await Promise.all(promiseArray)
  for await (let b of helper.initialBlogs){
  let returned = await api.post('/api/login').send({
    username: b.author,
    password: b.author,
  })
  let decodedToken = jwt.verify(returned.body.token, process.env.SECRET)
  let user = await User.findById(decodedToken.id)
  let blog = new Blog({
    title: b.title,
    url: b.url,
    author: b.author === undefined ? 'unknown' : b.author,
    likes: b.likes === undefined ? 0 : b.likes,
    user: user._id,
  })
  const savedBlogs = await blog.save()
  user.blogs = user.blogs.concat(savedBlogs._id)
  await user.save()
  }
})

describe('tests for GET', () => {
  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific title blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map((r) => r.title)
    expect(contents).toContain('Canonical string reduction')
  })

test('the unique identifier of blogs is named id', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const promiseArray = blogsAtStart.map((r) =>
    api.get(`/api/blogs/${r.id}`)
  )
  await Promise.all(promiseArray)
  const idArray = promiseArray.map((r) => r.response.body.id)
  expect(idArray).toStrictEqual(blogsAtStart.map((r) => r.id))
})
})

describe('tests for POST', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Hello world',
      author: 'Ting Chen',
      url: 'http://localhost:3001/api/blogs',
      likes: 0,
    }
    let returned = await api.post('/api/login').send({
      username: newBlog.author,
      password: newBlog.author,
    })
    let decodedToken = jwt.verify(returned.body.token, process.env.SECRET)
    let user = await User.findById(decodedToken.id)
    newBlog.user = user._id
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${returned.body.token}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    expect(titles).toContain('Hello world')
  })
  test('if the title and url properties are missing, the app will response 400 status', async () => {
    const newBlog1 = {
      author: 'Ting Chen',
      url: 'http://localhost:3001/api/blogs',
      likes: 0,
    }
    let returned = await api.post('/api/login').send({
      username: newBlog1.author,
      password: newBlog1.author,
    })
    let decodedToken = jwt.verify(returned.body.token, process.env.SECRET)
    let user = await User.findById(decodedToken.id)
    newBlog1.user = user._id
    await api.post('/api/blogs').set('Authorization', `bearer ${returned.body.token}`).send(newBlog1).expect(400)
  })
  test('if the likes property is missing, then is set default as 0', async () => {
    const newBlog = {
      title: 'Hello world',
      author: 'Ting Chen',
      url: 'http://localhost:3001/api/blogs',
    }
    let returned = await api.post('/api/login').send({
      username: newBlog.author,
      password: newBlog.author,
    })
    let decodedToken = jwt.verify(returned.body.token, process.env.SECRET)
    let user = await User.findById(decodedToken.id)
    newBlog.user = user._id
    const receiveMessage = await api.post('/api/blogs').set('Authorization', `bearer ${returned.body.token}`).send(newBlog)
    expect(receiveMessage.body.likes).toBe(0)
  })
  
  test('post blog without token will return 401 code', async () => {
    const newBlog = {
      title: 'Hello world',
      author: 'Ting Chen',
      url: 'http://localhost:3001/api/blogs',
    }
    await api.post('/api/blogs').send(newBlog).expect(401)  
  })
})



describe('tests for delete api',()=>{
  test('a blog can be deleted by creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    let returned = await api.post('/api/login').send({
      username: blogToDelete.author,
      password: blogToDelete.author,
    })
    await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `bearer ${returned.body.token}`).expect(204)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    const titles = blogsAtEnd.map((r) => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
  
  test('delete a blog without token will return 401 status code', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)
    
  })
})


afterAll(() => {
  mongoose.connection.close()
})
