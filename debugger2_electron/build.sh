rm -rf node_modules
rm -rf package.json
rm -rf package-lock.json
rm -rf out

npm install --save-dev electron
npm install --save-dev @electron-forge/cli
npx electron-forge import
npm run make