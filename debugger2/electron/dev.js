const { execSync } = require('child_process');

delete process.env.ELECTRON_RUN_AS_NODE;

const isBuild = process.argv.includes('--build');
const cmd = isBuild ? 'npx electron-builder' : 'npx electron .';

execSync(cmd, { stdio: 'inherit' });
