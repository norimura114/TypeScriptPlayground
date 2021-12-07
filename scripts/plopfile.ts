import nodePlop, { ActionType } from "node-plop";
import shell from "shelljs";
import capitalize from "lodash/capitalize";
import camelCase from "lodash/camelCase";

const plop = nodePlop("plop-templates/plopfile.hbs");

interface Answers {
  packageName: string;
}

async function createPackage() {
  plop.setHelper("capitalize", (text) => {
    return capitalize(camelCase(text));
  });

  plop.setGenerator("package", {
    description: "Generates a package",
    prompts: [
      {
        type: "input",
        name: "packageName",
        message: "Enter package name:",
      },
    ],
    actions(answers: any) {
      const actions: ActionType[] = [];

      if (!answers) return actions;

      const { packageName } = answers as Answers;

      actions.push({
        type: "addMany",
        templateFiles: "package/**",
        destination: `../packages/{{dashCase packageName}}`,
        base: "package/",
        data: { packageName },
        abortOnFail: true,
      });

      return actions;
    },
  });

  const { runPrompts, runActions } = plop.getGenerator("package");

  const answers = await runPrompts();
  await runActions(answers);
}

async function run() {
  await createPackage();
  shell.exec("yarn");
}

run();
