describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const initialUsers = {
      username: 'Michael Chan',
      name: 'Michael Chan',
      password: 'Michael Chan',
    }
    cy.request(
      'POST',
      'http://localhost:3001/api/users/',
      initialUsers
    )
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
    cy.get('button').should('contain', 'login')
    cy.get('button').should('not.contain', 'logout')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('Michael Chan')
      cy.get('#password').type('Michael Chan')
      cy.get('#login-button').click()
      cy.get('button').should('not.contain', 'login')
      cy.get('button').should('contain', 'logout')
      cy.contains('Michael Chan logged in')
      cy.get('.notification')
        .should('contain', 'You have successfully logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('Michael Chan')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.errorNotification')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Michael Chan logged in')
    })

    describe('when logged in', function () {
      beforeEach(function () {
        cy.login({
          username: 'Michael Chan',
          password: 'Michael Chan',
        })
      })
      it('a new blog can be created', function () {
        cy.contains('create new blog').click()
        cy.get('#title').type('a note created by cypress')
        cy.get('#author').type('Ting Chen')
        cy.get('#url').type('http://localhost:3000/')
        cy.get('#create-button').click()
        cy.contains('a note created by cypress')
        cy.contains('http://localhost:3000/')
        cy.contains('Ting Chen')
      })

      describe('and a note exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'first note cypress',
            author: 'Ting Chen',
            url: 'http://localhost:3000/',
          })
        })

        it('it can be shown in detail by click view button', function () {
          cy.get('.basicContent').contains('view').click()
          cy.contains('url')
        })
        it('user can like a blog', function () {
          cy.get('.basicContent').contains('view').click()
          cy.get('#likeButton').click()
          cy.get('.likeDiv').contains(1)
        })
        it('a blog can be deleted by creator', function () {
          cy.get('.basicContent').contains('view').click()
          cy.get('#removeButton').click()
          cy.contains('Blog removed!')
        })
        it('a blog cannot be deleted by other users', function () {
          const User = {
            username: 'Michael',
            name: 'Michael',
            password: 'Michael',
          }
          cy.request('POST', 'http://localhost:3001/api/users/', User)
          cy.login({
            username: 'Michael',
            password: 'Michael',
          })
          cy.get('.basicContent').contains('view').click()
          cy.get('#removeButton', { timeout: 10000 })
        })
        it('blogs are ordered according to likes ', function () {
          cy.createBlog({
            title: 'second note cypress',
            author: 'Ting Chen',
            url: 'http://localhost:3000/',
          })
          cy.createBlog({
            title: 'third note cypress',
            author: 'Ting Chen',
            url: 'http://localhost:3000/',
          })
          cy.likeBlog('first note cypress', 0)
          cy.likeBlog('second note cypress', 1)
          cy.likeBlog('third note cypress', 4)
          cy.get('.detailedContent').then((blogs) => {
            cy.wrap(blogs[0]).contains('third note cypress')
            cy.wrap(blogs[1]).contains('second note cypress')
            cy.wrap(blogs[2]).contains('first note cypress')
          })
        })
      })
    })
  })
})
