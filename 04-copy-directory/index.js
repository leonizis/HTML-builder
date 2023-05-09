const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

const copyDir = (src, dest) => {
  // Создаем папку назначения, если её еще нет
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    // Получаем список файлов в директории
    fs.readdir(src, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      // Рекурсивно копируем каждый файл и папку внутри указанной директории
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        fs.stat(srcPath, (err, stat) => {
          if (err) {
            console.error(err);
            return;
          }

          if (stat.isFile()) {
            fs.copyFile(srcPath, destPath, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log(`Файл ${file} успешно скопирован в папку ${dest}`);
            });
          } else if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
          }
        });
      });
    });
  });
};


copyDir(dirPath, dirCopy);
