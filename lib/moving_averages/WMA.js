"use strict"
let WMA;
const LinkedList = require('linkedlist');

module.exports = WMA = function(input) {
  var period = input.period;
  var priceArray = input.values;
  var initial = undefined;
  this.result = [];
  this.generator = (function* (initial){
    let data = new LinkedList();
    let denominator = period * (period + 1)/2;

    while (true) {
      if((data.length) < period ){
        data.push(yield)
      }else {
        data.resetCursor();
        let result = 0;
        for(let i=1; i<=period; i++){
          result = result + (data.next() * i/(denominator))
        }
        var next = yield result;
        data.shift();
        data.push(next);
      }
    }
  })(initial);

  this.generator.next();

  priceArray.forEach((tick, index) => {
    var result = this.generator.next(tick)
    if(result.value){
      this.result.push(parseFloat(result.value.toFixed(2)));
    }
  });
};

WMA.calculate = function(input) {
  if(input.reversedInput) {
    input.values.reverse();
  }
  let result = (new WMA(input)).result;
  input.reversedInput ? result.reverse():undefined;
  return result;
};

WMA.prototype.getResult = function () {
  return this.result;
};

WMA.prototype.nextValue = function (price) {
  let result = this.generator.next(price).value;
  return result ? result.toFixed(2) : undefined;
};