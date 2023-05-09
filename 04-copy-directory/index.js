const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

const copyDir = async (src, dest) => {
  try {
    // Проверяем, существует ли папка-копия
    try {
      await fs.access(dest);
      // Если папка существует, удаляем ее
      await fs.rmdir(dest, { recursive: true });
    } catch (error) {
      // Если папка не существует, игнорируем ошибку
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Создаем папку назначения
    await fs.mkdir(dest, { recursive: true });

    // Получаем список файлов в директории
    const files = await fs.readdir(src);

    // Рекурсивно копируем каждый файл и папку внутри указанной директории
    for (const file of files) {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);

      const stat = await fs.stat(srcPath);

      if (stat.isFile()) {
        await fs.copyFile(srcPath, destPath);
        console.log(`Файл ${file} успешно скопирован в папку ${dest}`);
      } else if (stat.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

copyDir(dirPath, dirCopy);
