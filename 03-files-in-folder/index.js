const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

// читаем содержимое директории асинхронно
fs.readdir(dirPath, (err, files) => {
  if (err) {
    console.error(`Ошибка чтения директории: ${err}`);
    return;
  }

  // фильтруем только файлы
  const promises = files.map(fileName => {
    const filePath = path.join(dirPath, fileName);
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Ошибка чтения файла: ${err}`);
          resolve(false);
        }
        resolve(stats.isFile() && path.extname(filePath) !== '');
      });
    });
  });

  Promise.all(promises).then(results => {
    const filteredFiles = files.filter((fileName, index) => results[index]);

    // выводим информацию о каждом файле
    filteredFiles.forEach(fileName => {
      const filePath = path.join(dirPath, fileName);
      const fileExt = path.extname(filePath).slice(1);
      const fileSizeInBytes = fs.statSync(filePath).size;
      const fileSizeInKb = fileSizeInBytes / 1024;
      console.log(`${path.basename(filePath, path.extname(filePath))} - ${fileExt} - ${fileSizeInKb} Kb`);
    });
  }).catch(err => {
    console.error(`Ошибка при фильтрации файлов: ${err}`);
  });
});
