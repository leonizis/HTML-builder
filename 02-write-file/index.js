const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filePath = 'text.txt';

// проверяем, существует ли файл
let exists = false;
try {
  fs.accessSync(`./02-write-file/${filePath}`, fs.constants.F_OK);
  exists = true;
} catch (err) {}

if (!exists) {
  // создаем файл, если его нет
  fs.writeFile(`./02-write-file/${filePath}`, '', err => {
    if (err) {
      console.error(err);
    }
  });
}

// функция для записи данных в файл
function appendToFile(data) {
  return new Promise((resolve, reject) => {
    fs.appendFile(`./02-write-file/${filePath}`, data, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// выводим приглашение на ввод текста
rl.setPrompt('Введите текст: ');
rl.prompt();

// обрабатываем ввод текста
rl.on('line', async (input) => {
  if (input.toLowerCase() === 'exit') {
    // если пользователь ввел "exit", завершаем работу программы
    console.log('До свидания!');
    process.exit(0);
  } else {
    // записываем данные в файл
    await appendToFile(`${input}\n`);
    // выводим приглашение на ввод текста
    rl.prompt();
  }
});

// обрабатываем событие завершения программы
rl.on('SIGINT', () => {
  console.log('Программа завершена');
  process.exit(0);
});
