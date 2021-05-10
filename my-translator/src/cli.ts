#!/usr/bin/env node
import { program } from "commander";
import { translate } from "./main";
const packageJson = require("./package.json");

program
  .version(packageJson.version)
  .usage("fy <English>")
  .command("fy <English>")
  .action((English) => {
    translate(English);
  });

program.parse(process.argv);
