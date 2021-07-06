import { Task } from './task';

it('should stop after automatically', (done) => {
  let counter = 0;
  const task = new Task(async () => {
    if (counter >= 5) {
      return false;
    }
    counter++;
    return true;
  }, 10);
  expect(counter).toBe(0);
  task.start(() => {
    expect(counter).toBe(5);
    done();
  });
});