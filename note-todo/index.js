const db = require("./db");
const inquirer = require("inquirer");

const add = async (tasks) => {
  let list = await db.read();
  tasks.forEach((task) => {
    list.push({
      name: task,
      done: false,
    });
  });
  await db.write(list);
};

const clear = async () => {
  await db.write([]);
};

const showAll = async () => {
  let list = await db.read();
  inquirer
    .prompt({
      type: "list",
      message: "choose your task:",
      name: "index",
      choices: [
        ...list.map((task, index) => ({
          key: index,
          name: `${task.done ? "[x]" : "[_]"} ${index + 1}. ${task.name}`,
          value: index,
        })),
        {
          key: -1,
          name: "+ add new task",
          value: -1,
        },
        {
          key: -2,
          name: "quit",
          value: -2,
        },
      ],
    })
    .then((answer) => {
      const index = answer.index;
      if (index > -1) {
        askForAction(list, index);
      } else if (index === -1) {
        askForNewTask(list);
      }
    });
};
function askForNewTask(list) {
  inquirer
    .prompt({
      type: "input",
      message: "input new task name:",
      name: "name",
    })
    .then((answer) => {
      list.push({ name: answer.name, done: false });
      return db.write(list);
    });
}
function askForAction(list, index) {
  const operations = {
    markDone: markDone,
    markUndone: markUndone,
    remove: remove,
    updateTitle: updateTitle,
  };
  inquirer
    .prompt({
      type: "list",
      message: "choose your operation",
      name: "action",
      choices: Object.keys(operations).map((name) => ({
        key: name,
        name,
        value: name,
      })),
    })
    .then((answer) => {
      operations[answer.action](list, index);
    });
}
function markDone(list, index) {
  list[index].done = true;
  return db.write(list);
}
function markUndone(list, index) {
  list[index].done = false;
  return db.write(list);
}
function remove(list, index) {
  list.splice(index, 1);
  return db.write(list);
}
function updateTitle(list, index) {
  inquirer
    .prompt({
      type: "input",
      message: "input task name:",
      name: "name",
    })
    .then((answer) => {
      list[index].name = answer.name;
      return db.write(list);
    });
}

module.exports = {
  add,
  clear,
  showAll,
};
