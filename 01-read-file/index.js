const fs = require('fs');
const pach = require('path');

const failPach = pach.join(__dirname, 'text.txt');

fs.readFile(failPach, 'utf8', (err, data) => {
    if (!err){
        console.log(data)
    }
})


