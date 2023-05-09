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
const dirPathAssets = path.join(__dirname, 'project-dist', 'assets')

async function removeDirectory(dirPath) {
  try {
    await fs.promises.rm(dirPath, { recursive: true })
    console.log(`Папка ${dirPath} удалена`);
  } catch (err) {
    console.error(`Ошибка удаления ${dirPath}: ${err}`);
  }
}

async function run() {
  await removeDirectory(dirPath);
  // проверяем существует ли папка project-dist методом access

fs.access(dirPath, (err) => {
  // если папка уже есть такая
  if (!err) {
    console.log('папка project-dist уже есть');
  }
  // если нету, то создаем ее
  fs.mkdir(dirPath, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Папка project-dist создана');
    fs.access(dirPathAssets, (err) => {
      if (!err) {
        return console.log('папка assets уже есть')
      }
      fs.mkdir(dirPathAssets, (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('assets папка создана')
      })
    });
    fs.readdir(assetsPath, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files.forEach((file) => {
        const sourcePath = path.join(assetsPath, file);
        const destPath = path.join(dirPathAssets, file);

;
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
    const createIndexFile = (templatePath, dirComponents, dirPath) => {
      fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
        if (err) {
          return console.error(err);
        }
    
        fs.readdir(dirComponents, (err, files) => {
          if (err) {
            return console.error(err);
          }
    
          const componentsFiles = files.filter(file => path.extname(file) === '.html');
          let updatedContent = templateContent;
    
          componentsFiles.forEach((componentFile, index) => {
            const componentPath = path.join(dirComponents, componentFile);
            fs.readFile(componentPath, 'utf8', (err, componentContent) => {
              if (err) {
                return console.error(err);
              }
    
              const templateTag = `{{${path.basename(componentFile, '.html')}}}`;
              updatedContent = updatedContent.replace(new RegExp(templateTag, 'g'), componentContent);
    
              if (index === componentsFiles.length - 1) {
                fs.mkdir(dirPath, { recursive: true }, (err) => {
                  if (err) {
                    return console.error(err);
                  }
    
                  const indexFile = path.join(dirPath, 'index.html');
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
    };
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
}

run();


