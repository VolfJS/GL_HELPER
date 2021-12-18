const fs = require("fs")
const { format } = require('fecha')
const config = require("./config");

let now = () => format(new Date(), 'D.MM.YY')

let getFiles = function (dir){
    
    let files_ = [];
      let files = fs.readdirSync(dir);
      for (let i in files){
          let name = files[i];
              files_.push(name);
      }
      return files_;
  };

      /**
 * Функция создания логов в папке logs.
 * @param {String} text
 */

function create_log(text) {
    if(!getFiles(`${config.dir_log}`).find(x=> x == `${now()}.txt`)) {
        Promise.all([
    fs.writeFile(`${config.dir_log}/${now()}.txt`, `======================= LOGS ${now()} =======================\n`, function (err) {
        if (err) throw err;
        console.log('Logs created!');
      }),
      fs.appendFile(`${config.dir_log}/${now()}.txt`, `\n${text}`, function (err) {
        if (err) throw err;
        console.log('Logs updated!');
      })
    ])
    } else {
        fs.appendFile(`${config.dir_log}/${now()}.txt`, `\n${text}`, function (err) {
            if (err) throw err;
            console.log('Logs updated!');
          })
    }
}

module.exports = create_log;