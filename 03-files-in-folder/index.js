const fs = require('fs');
const pach = require('path');

const dirPach = pach.join(__dirname, 'secret-folder');
console.log(dirPach);

// объявляем переменную filterFiles до функции fs.readdir
let filterFiles;

// считываем информацию с директории secret-folder
fs.readdir(dirPach, (err, files) => {
    if (err) {
        console.error(`Ошибка чтения дериктории: ${err}`);
        return;
    }
    //фильтруем файлы по расширению
    filterFiles = files.filter((fileName) => {
        const filePach = pach.join(dirPach, fileName);
        return fs.statSync(filePach).isFile() && pach.extname(filePach) !== '';
    });

    // проходимся по каждому отфильтрованному файлу и выводим информацию о нем
    filterFiles.forEach(fileName => {
        const name = pach.basename(fileName, pach.extname(fileName))
        const filePach = pach.join(dirPach, fileName);
        const fileInBt = fs.statSync(filePach).size;
        const fileInKb = fileInBt / 1024.0;
        console.log(`${name} - ${pach.extname(filePach).slice(1)} - ${fileInKb}Kb`);
    });
});
