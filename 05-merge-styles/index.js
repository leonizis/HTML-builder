const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

// Получаем список файлов в папке styles
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  
  // Фильтруем файлы по расширению .css
  const cssFiles = files.filter(file => path.extname(file) === '.css');

  // Собираем содержимое всех файлов в одну строку
  let cssContent = '';
  let count = 0;
  cssFiles.forEach(file => {
    const filePath = path.join(stylesDir, file);
    fs.readFile(filePath, 'utf-8', (err, fileContent) => {
      if (err) {
        console.error(err);
        return;
      }
      
      cssContent += fileContent;
      count++;
      
      // Проверяем, что все файлы прочитаны, прежде чем записывать содержимое в файл
      if (count === cssFiles.length) {
        // Создаем папку dist, если ее еще нет
        fs.mkdir(distDir, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          
          // Записываем содержимое в файл bundle.css в папке dist
          fs.writeFile(path.join(distDir, 'bundle.css'), cssContent, (err) => {
            if (err) {
              console.error(err);
              return;
            }
            
            console.log('записано');
          });
        });
      }
    });
  });
});
