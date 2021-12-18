const md5 = require('js-md5')

const config = require('./config');

function randomInteger(min, max) {
    let random = min + Math.random() * (max - min);
    return Math.floor(random);
  }

function generate_link(params = {}) {
   this.amount = params.amount;
   this.desc = params.desc;
   this.method = params.method;
 
   let link;
   let rand_num = randomInteger(1, 10000000)
 
   let hash = md5(`${this.amount}|${rand_num}|378|RUB|${this.desc}|dfe5c664006cc61b7eec356ee28786f6`)
 
   this.method == 'none' ? link = `https://payok.io/pay?amount=${this.amount}&payment=${rand_num}&shop=378&desc=${this.desc}&currency=RUB&sign=${hash}` : link = `https://payok.io/pay?amount=${this.amount}&payment=1&shop=${config.shop_id}&desc=${this.desc}&currency=RUB&sign=${hash}&method=${this.method}`
 
   return link;
}   

module.exports = generate_link