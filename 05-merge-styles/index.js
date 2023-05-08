const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

// Получаем список файлов в папке styles
const files = fs.readdirSync(stylesDir);

// Фильтруем файлы по расширению .css
const cssFiles = files.filter(file => path.extname(file) === '.css');

// Собираем содержимое всех файлов в одну строку
const cssContent = cssFiles.reduce((acc, file) => {
  const filePath = path.join(stylesDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return acc + fileContent;
}, '');

// Создаем папку dist, если ее еще нет
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Записываем содержимое в файл bundle.css в папке dist
fs.writeFileSync(path.join(distDir, 'bundle.css'), cssContent);


console.log('записано');
