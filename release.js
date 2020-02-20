const util = require('util');
const exec = util.promisify(require('child_process').exec);

const level = process.argv[2];

const print = ({stdout, stderr}) => {
  console.log(stdout);
  console.log(stderr);
} ;



if (level === undefined) {
  console.log('Provide a patch-level: [major, minor, patch]');
  process.exit(1);
}

const run = async () => {
  await exec('npx jest').then(print).catch(() => process.exit(1));
  // await exec('npm run build').then(print);
  await exec('git add --all').then(print);
  try {
    await exec('git commit -am "Chore: updating version ' + level + '"').then(print);
  } catch {
  }
  
  await exec('npm version ' + level).then(print);
  await exec('git push --all && git push --tags').then(print);

};


run();
