const { program } = require("commander");
const api = require("./index");

program
  .command("add <tasks...>")
  .description("add a task")
  .action((tasks) => {
    api
      .add(tasks)
      .then(() => {
        console.log("add succeed!");
        api.showAll();
      })
      .catch(() => {
        console.log("add failed!");
      });
  });

program
  .command("clear")
  .description("clear all tasks")
  .action(() => {
    api
      .clear()
      .then(() => {
        console.log("clear succeed!");
      })
      .catch(() => {
        console.log("clear failed!");
      });
  });

program.action(() => {
  api.showAll();
});

program.parse(process.argv);
