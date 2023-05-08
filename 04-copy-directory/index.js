const fs = require('fs');
const path = require('path');

const copyDir = (src, dest) => {
  // Создаем папку назначения, если её еще нет
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  
  // Получаем список файлов в директории
  const files = fs.readdirSync(src);
  
  // Рекурсивно копируем каждый файл и папку внутри указанной директории
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);
    
    if (stat.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    } else if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    }
  });
};

const srcDir = './04-copy-directory/files';
const destDir = './04-copy-directory/files-copy';

copyDir(srcDir, destDir);


