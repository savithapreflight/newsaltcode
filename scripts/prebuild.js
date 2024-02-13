const path = require('path');
const { exec } = require('child_process');
const fs = require('fs-extra');

module.exports = () => {
  const projectPath = path.resolve(process.cwd(), './node_modules/.bin/react-scripts');
  const buildFolderPath = path.resolve(__dirname, '../build/');
  const outputFolderPath = path.join(__dirname, '../www/');

  return new Promise((resolve, reject) => {
    exec(`${projectPath} build`, (error) => {
      if (error) {
        console.error(error);
        reject(error);
        return;
      }

      fs.emptyDir(outputFolderPath, (err) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        fs.copy(buildFolderPath, outputFolderPath, (err) => {
          if (err) {
            console.error(err);
            reject(err);
            return;
          }

          console.log('Successfully built!');
          resolve('Successfullyyy built!');
        });
      });
    });
  });
};
