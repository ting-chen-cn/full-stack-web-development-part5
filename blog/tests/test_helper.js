const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
]
const initialUsers = [
  {
    username: 'Michael Chan',
    name: 'Michael Chan',
    password: 'Michael Chan',
  },
  {
    username: 'Edsger W. Dijkstra',
    name: 'Edsger W. Dijkstra',
    password: 'Edsger W. Dijkstra',
  },
  {
    username: 'Robert C. Martin',
    name: 'Robert C. Martin',
    password: 'Robert C. Martin',
  },
  {
    username: 'Ting Chen',
    name: 'Ting Chen',
    password: 'Ting Chen',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: '1 wars',
    author: '1 C. Martin',
    url: 'http://1.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 1,
  })
  await blog.save()
  await blog.remove()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}
const userSave = async (user) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(user.password, saltRounds)
  const userHandle = new User({
    username: user.username,
    name: user.name,
    passwordHash,
  })
  await userHandle.save()
  // return userHandle
}

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
  userSave,
}
