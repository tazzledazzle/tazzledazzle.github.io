describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the site title', () => {
    cy.get('h1').should('contain', 'Terence Schumacher')
  })

  it('has working navigation links', () => {
    cy.get('nav a').should('have.length.at.least', 1)
    cy.get('nav a').first().click()
    cy.url().should('not.eq', 'about:blank')
  })

  it('loads posts', () => {
    cy.get('.post-list').should('exist')
    cy.get('.post-list li').should('have.length.at.least', 1)
  })
})

describe('Projects', () => {
  beforeEach(() => {
    cy.visit('/projects')
  })

  it('displays project list', () => {
    cy.get('.project-list').should('exist')
  })
})
