const util = require('util');
const exec = util.promisify(require('child_process').exec);

const level = process.argv[2];

if (level === undefined) {
  console.log('Provide a patch-level: [major, minor, patch]');
  process.exit(1);
}

const run = async () => {
  await exec('npx jest').then(console.log).catch(() => process.exit(1));
  await exec('npm run build').then(console.log);
  try {
    await exec('git commit -am "Chore: updating version ' + level + '"').then(console.log);
  } catch {

  }
  await exec('npm version ' + level).then(console.log);
  await exec('git add --all').then(console.log);
  await exec('git push --all && git push --tags').then(console.log);

};


run();