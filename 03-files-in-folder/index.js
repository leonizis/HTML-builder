const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath)
  .then(files => {
    // фильтруем только файлы
    const promises = files.map(fileName => {
      const filePath = path.join(dirPath, fileName);
      return fs.stat(filePath)
        .then(stats => stats.isFile() && path.extname(filePath) !== '');
    });

    return Promise.all(promises)
      .then(results => files.filter((fileName, index) => results[index]));
  })
  .then(filteredFiles => {
    // выводим информацию о каждом файле
    filteredFiles.forEach(async fileName => {
      const filePath = path.join(dirPath, fileName);
      const fileExt = path.extname(filePath).slice(1);
      try {
        const stats = await fs.stat(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInKb = fileSizeInBytes / 1024;
        console.log(`${path.basename(filePath, path.extname(filePath))} - ${fileExt} - ${fileSizeInKb} Kb`);
      } catch (err) {
        console.error(`Ошибка чтения файла: ${err}`);
      }
    });
  })
  .catch(err => {
    console.error(`Ошибка чтения директории: ${err}`);
  });
