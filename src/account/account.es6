export default class Account {
  constructor(options) {
    this._amount = this._parseAmount(options.amount);
    //in production code, config be retreived at library initialization
    this._config = {
      exchangeRate: {
        RUB: {
          USD: 0.014
        },
        USD: {
          RUB: 68
        }
      }
    };
  }

  _parseAmount(amount) {
    if (amount.charAt[0] === '$') {
      this._currency = 'USD';
    } else {
      this._currency = 'RUB';
    }

    amount = amount.replace('$', '').replace('руб.', '').replace(',','.');
    this._amount = parseFloat(amount);
  }

  convertToUSD() {
    //for production code, I move literal constants to special contants file
    this._convertTo('USD');
  }

  convertToRUB() {
    this._convertTo('RUB');
  }

  _convertTo(currency) {
    const rate = this._config.exchangeRate[this._currency][currency];
    this._amount = this._amount * rate;
  }

  add(amount, currency) {
    this._modify(amount, currency, 'add');
  }

  subtract(amount, currency) {
    this._modify(amount, currency, 'subtract');
  }

  divide(amount, currency) {
    this._modify(amount, currency, 'divide');
  }

  multiply(amount, currency) {
    this._modify(amount, currency, 'multiply');
  }

  _modify(amount, currency, operation) {    
    if (this._currency !== currency) {
      this._convertTo(currency);
    }

    switch(operation) {
      case 'add':
        this._amount += amount;
        break;
      case 'subtract':
        if (amount >= this._amount) {
          //in production code, it will be special error type
          throw new Error('Amount to subtract is bigger then account amount');
        }
        this._amount -= amount;
        break;
      case 'divide':
        if (amount === 0) {
          //in production code, it will be special error type
          throw new Error('Cannot divide by zero');
        }
        this._amount /= amount;
        break;
      default: //multiply
        this._amount *= amount;
        break;
    }

    return this._amount;
  }

  format(currency) {
    const formatter = new Intl.NumberFormat({ currency });
    return formatter.format(this._amount);
  }
}