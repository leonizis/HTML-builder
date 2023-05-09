const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = 'text.txt';

// проверяем, существует ли файл
fs.promises.access(`./02-write-file/${filePath}`, fs.constants.F_OK)
  .catch(() => {
    // создаем файл, если его нет
    return fs.promises.writeFile(`./02-write-file/${filePath}`, '');
  });

// функция для записи данных в файл
function appendToFile(data) {
  return fs.promises.appendFile(`./02-write-file/${filePath}`, data);
}

// выводим приглашение на ввод текста
rl.setPrompt('Введите текст: ');
rl.prompt();

// обрабатываем ввод текста
rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    // если пользователь ввел "exit", завершаем работу программы
    console.log('До свидания!');
    process.exit(0);
  } else {
    // записываем данные в файл
    appendToFile(`${input}\n`).then(() => {
      // выводим приглашение на ввод текста
      rl.prompt();
    }).catch(err => {
      console.error(err);
      rl.close();
    });
  }
});

// обрабатываем событие завершения программы
rl.on('SIGINT', () => {
  console.log('Программа завершена');
  process.exit(0);
});
