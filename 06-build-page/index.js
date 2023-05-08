const fs = require('fs');
const path = require('path');
const glob = require('glob');


//записываем пути
const dirPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const dirComponents = path.join(__dirname, 'components');
const indexFile = path.join(__dirname, 'project-dist', 'index.html');
const stylesPath = path.join(__dirname, 'styles', '**/*.css');
const assetsPath = path.join(__dirname,  'assets');



// проверяем существует ли папка project-dist методом access
fs.access(dirPath, (err) => {
    // если папка уже есть такая
    if (!err) {
      return console.log('Такая папка уже есть');
    }
    // если нету, то создаем ее
    fs.mkdir(dirPath, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Папка создана');
      fs.readdir(assetsPath, (err, files) => {
        if (err) {
          console.error(err);
          return;
        }
      
        files.forEach((file) => {
          const sourcePath = path.join(assetsPath, file);
          const destPath = path.join(dirPath, file);
      
          fs.stat(sourcePath, (err, stats) => {
            if (err) {
              console.error(err);
              return;
            }
      
            if (stats.isDirectory()) {
              fs.mkdir(destPath, (err) => {
                if (err) {
                  console.error(err);
                  return;
                }
                console.log(`Файл ${file} успешно скопирован в папку ${destPath}`);
            });
              copyDir(sourcePath, destPath);
            } else {
              copyFile(sourcePath, destPath);
            }
          });
        });
      });
      
      function copyFile(source, target) {
        const rd = fs.createReadStream(source);
        rd.on('error', (err) => {
          console.error(err);
          return;
        });
        const wr = fs.createWriteStream(target);
        wr.on('error', (err) => {
          console.error(err);
          return;
        });
        wr.on('close', (ex) => {
          console.log(`Файл ${target} успешно записан`);
        });
        rd.pipe(wr);
      }
      
      function copyDir(source, target) {
        fs.readdir(source, (err, files) => {
          if (err) {
            console.error(err);
            return;
          }
      
          files.forEach((file) => {
            const sourcePath = path.join(source, file);
            const destPath = path.join(target, file);
      
            fs.stat(sourcePath, (err, stats) => {
              if (err) {
                console.error(err);
                return;
              }
      
              if (stats.isDirectory()) {
                fs.mkdir(destPath, { recursive: true }, (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  console.log(`Создана папка ${destPath}`);
                  copyDir(sourcePath, destPath); // добавляем рекурсивный вызов copyDir для вложенных папок
                });
              } else {
                fs.copyFile(sourcePath, destPath, (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  console.log(`Файл ${file} успешно скопирован в папку ${destPath}`);
                });
              }
            });
          });
        });
      }
      // читаем что внутри файла
      fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
        if (err) {
          return console.error(err);
        }
  
        // получаем список всех файлов в папке components
        const componentsFiles = fs.readdirSync(dirComponents).filter(file => path.extname(file) === '.html')
  
        // копируем файл темплейт и заменяем содержимое на нужные блоки
        let updatedContent = templateContent;
        componentsFiles.forEach(componentFile => {
          const componentPath = path.join(dirComponents, componentFile);
          fs.readFile(componentPath, 'utf8', (err, componentContent) => {
            if (err) {
              return console.error(err);
            }
  
            const templateTag = `{{${path.basename(componentFile, '.html')}}}`;
            updatedContent = updatedContent.replace(new RegExp(templateTag, 'g'), componentContent);
  
            // если это последний компонент, то сохраняем файл index.html
            if (componentsFiles.indexOf(componentFile) === componentsFiles.length - 1) {
              // записываем обновленный шаблон в файл index.html в папке project-dist
              fs.mkdir(dirPath, { recursive: true }, (err) => {
                if (err) {
                  return console.error(err);
                }
                fs.writeFile(indexFile, updatedContent, (err) => {
                  if (err) {
                    return console.error(err);
                  }
                  console.log('Файл успешно создан');
                });
              });
            }
          });
        });
      });
    });
  });
  

// ищем css файлы и записываем все в один файл style.css
glob(stylesPath, (err, files) => {
    if (err) {
      return console.error(err);
    }
    const stylesArray = [];
    files.forEach(file => {
      fs.readFile(file, 'utf8', (err, content) => {
        if (err) {
          return console.error(err);
        }
        stylesArray.push(content);
        if (stylesArray.length === files.length) {
          const stylesContent = stylesArray.join('\n');
          const stylesDistPath = path.join(__dirname, 'project-dist', 'style.css');
          fs.writeFile(stylesDistPath, stylesContent, err => {
            if (err) {
              return console.error(err);
            }
            console.log('Все записано в project-dist/style.css');
          });
        }
      });
    });
  });

  