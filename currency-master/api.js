var rest = require('restler');

var self = module.exports = {

	ver002: (data, res) => {

		if (typeof data.base === 'undefined' || data.base === '') {
			self.sendResponse(res, 403, 'Please supply a base currency symbol');
			return;
		}

		const base = data.base.toUpperCase();

		let symbols,
			date;

		let url = `https://api.fixer.io/latest?symbols=${data.symbol.from},${data.symbol.to}`;

		if (typeof data.symbol === 'undefined' || data.symbol === '') {
			self.sendResponse(res, 403, 'Please supply a currency symbol to convert to');
			return;
		}

		if (typeof data.amount === 'undefined' || data.amount === '') {
			self.sendResponse(res, 403, 'Please supply an amount to convert');
			return;
		}

		if (typeof data.symbol === 'object') {

			let str = '';
			const symbolArray = data.symbol;

			for (let i = symbolArray.length - 1; i >= 0; i--) {
				str += symbolArray[i].toUpperCase() + ',';
			}

			symbols = str;

		} else {

			symbols = data.symbol.toUpperCase();

		}

		if (typeof data.date !== 'undefined') {
			if (typeof data.date !== 'string') {
				self.sendResponse(res, 403, 'Please provide the date as a string');
				return;
			}

			if (new Date(data.date) < new Date('2000-01-02')) {
				self.sendResponse(res, 403, 'Please do not use date earlier than year 2000');
				return;
			}
			date = data.date;
		} else {
			date = 'latest';
		}

		url = `http://api.fixer.io/${date}?base=${base}&symbols=${symbols}`;

        rest.get(url).on('complete', function(err, response) {

            if (response.statusCode == 200) {

            	const returns = {
            		base: data.base,
            		amount: data.amount,
            		results: self.convertAmount(data.amount, JSON.parse(response.rawEncoded)),
            		dated: data.date
            	};

            	self.sendResponse(res, 200, returns);
            }
            if (response.statusCode == 401) {
                callback('Not Authorized');
            }
            if (response.statusCode == 502) {
                callback('API Error');
            }

        });

	},

	convertAmount: (amount, data) => {

		const rates = data.rates;
		let returns = [];

		for (let r in rates) {

			if (rates.hasOwnProperty(r)) {

				const convert = (amount * rates[r]);
				returns.push({from: data.base, to: r, roundedResult: convert.toFixed(2), fullResult: convert, rate: rates[r]})

			}

		}

		return returns;
	},

	sendResponse: (res, status, response) => {

        if(typeof response === 'object'){
            response = JSON.stringify(response);
        }
	    res.status(status);
	    res.write(response);
	    res.end();
	    return

	}
}