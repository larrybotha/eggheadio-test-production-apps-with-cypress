const {arrayOf, bool, build, fake, incrementingId} = require('test-data-bot');

const todoItemBuilder = build('Todo Item').fields({
  completed: bool(),
  id: incrementingId(),
  text: fake(f => f.lorem.words(3)),
});

const todoItemsBuilder = (n = 3) => {
  const builder = build('Todo Items')
    .fields({array: arrayOf(todoItemBuilder, n)})
    .map(({array}) => array);

  return builder();
};

module.exports = {todoItemsBuilder};
