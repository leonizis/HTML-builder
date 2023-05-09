const fs = require('fs');
const path = require('path');

const textPath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(textPath, {encoding: 'utf-8'});

readStream.on('data', (chunk) => {
    console.log(chunk.toString());
})


