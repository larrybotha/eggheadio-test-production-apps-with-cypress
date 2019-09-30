describe('Todo application with forced 404s', () => {
  it('runs a custom plugin', function() {
    cy.task('hello', {name: 'world'});
  });
});
