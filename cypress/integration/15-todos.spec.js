describe('Todo application with forced 404s', () => {
  it('seeds the database', function() {
    cy.task('db:seed', {todos: [], users: []});
  });
});
