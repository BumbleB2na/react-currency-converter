import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const IS_INTERNAL = false;
const _apiInternal = 'http://localhost:8888/api/0.2/';
const _apiExternal = 'https://react-currency-converter-api.herokuapp.com:8888/api/0.2';  //TODO: set example.com:8888
  
class Currency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRateActive: true
        }
        this.handleClickNavButton = this.handleClickNavButton.bind(this);
    }
    handleClickNavButton(value) {
        this.setState({
            isRateActive: value
        });
    }
    render() {
        return (
            <div>
                <h1>CURRENCY</h1>
                <Nav onClickNavButton={this.handleClickNavButton} isRateActive={this.state.isRateActive} />
                <GetRate isRateActive={this.state.isRateActive} />
                <ThirtyDayHistory isRateActive={this.state.isRateActive} />
            </div>
        );
    }
}

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.handleClickRate = this.handleClickRate.bind(this);
        this.handleClickHistory = this.handleClickHistory.bind(this);
    }
    handleClickRate(e) {
        this.props.onClickNavButton(true);
    }
    handleClickHistory(e) {
        this.props.onClickNavButton(false);
    }
    render() {
        const activeRate = (this.props.isRateActive) ? 'active' : '';
        const activeHistory = (this.props.isRateActive) ? '' : 'active';
        return (
            <nav>
                <button onClick={this.handleClickRate} className={activeRate}>GET RATE</button>
                <button onClick={this.handleClickHistory} className={activeHistory}>RATE 30 DAY HISTORY</button>
            </nav>
        );
    }
}

class GetRate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            from: '',
            to: '',
            results: [],
            resultMessage: '',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
    }
    handleFromChange(value) {
        this.setState({
            from: value
        });
    }
    handleToChange(value) {
        this.setState({
            to: value
        });
    }
    handleAmountChange(value) {
        this.setState({
            amount: value
        });
    }
    handleSubmit(e) {
        if(!this.state.amount || !this.state.from || !this.state.to) {
            this.setState({
                resultMessage: `Please ensure no input fields are empty to get rates`
            });
            return;
        }
        if(this.state.from === this.state.to) {
            this.setState({
                resultMessage: `${this.state.amount} ${this.state.from} = ${this.state.amount} ${this.state.to}`
            });
            return;
        }
        this.getRateAsync();
    }
    getRateAsync() {
        postToApi({
            base: this.state.from,
            amount: this.state.amount,
            symbol: this.state.to
        })
        .then((result) => {
            const r = result.results[0];
            this.setState({
                results: result.results,
                resultMessage: `${result.amount} ${result.base} = ${r.roundedResult} ${r.to}`
            });
        }, (err) => {
            console.log('Error', err);
        })
    }
    render() {
        const activeRate = (this.props.isRateActive) ? 'view active' : 'view';
        return (
            <div id="getRate" className={activeRate}>
                <InputFormGetRate 
                    amount={this.state.amount} 
                    from={this.state.from} 
                    to={this.state.to} 
                    onAmountInput={this.handleAmountChange}
                    onFromChange={this.handleFromChange}
                    onToChange={this.handleToChange}
                    onCurrencyFormSubmit={this.handleSubmit} 
                />
                <ResultTable message={this.state.resultMessage} />
            </div>
        );
    }
}
class InputFormGetRate extends React.Component {
    constructor(props) {
        super(props);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleAmountChange(e) {
        this.props.onAmountInput(e.target.value);
    }
    handleFromChange(value) {
        this.props.onFromChange(value);
    }
    handleToChange(value) {
        this.props.onToChange(value);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.onCurrencyFormSubmit(e);
    }
    render() {
        return (
            <section>
                <form onSubmit={this.handleSubmit}>
                    <input type="currency" placeholder="Amount" defaultValue={this.props.amount} onChange={this.handleAmountChange} />
                    <DropDownFrom from={this.props.from} onFromChange={this.handleFromChange} />
                    <DropDownTo to={this.props.to} onToChange={this.handleToChange} />
                    <input type="submit" value="GO" />
                </form>
            </section>
        );
    }
}
class ResultTable extends React.Component {
    render() {
        return (
            <section>
                {this.props.message}
            </section>
        );
    }
}


class ThirtyDayHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            from: '',
            to: '',
            results: [],
            resultDateRange: '',
            resultGraphData: []
        }
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleFromChange(value) {
        this.setState({
            from: value
        });
    }
    handleToChange(value) {
        this.setState({
            to: value
        });
    }
    handleSubmit(e) {
        if(this.state.from === this.state.to) {
            this.setState({
                resultDateRange: 'Please choose different From and To currency types',
                resultGraphData: []
            });
            return;
        }
        this.getDollarHistoryAsync();
    }
    //get last 30 days beginning with today
    getDollarHistoryAsync() {
        const today = new Date();
        const thirtyDaysAgo = new Date( new Date().setDate(today.getDate() - 30) );
        let graphDay = thirtyDaysAgo;
        let thirtyPromises = new Array(30);
        for(let i=0; i < 30; i++) {
            graphDay = new Date( new Date(thirtyDaysAgo).setDate(thirtyDaysAgo.getDate() + i) );
            const graphDateForApi = formatDate(graphDay);
            thirtyPromises[i] = 
                postToApi({
                    base: this.state.from,
                    symbol: this.state.to,
                    amount: '1',
                    date: graphDateForApi
                })
                .catch((err) => {
                    console.log('Error', err);
                });
        }
        Promise.all(thirtyPromises)
        .then(results => {
            console.log('promises all returned');

            const resultDateRange = `${results[0].dated} - ${results[results.length - 1].dated}`;
            let resultGraphData = new Array(30);
            for(let i = 0; i < results.length; i++) {
                const roundedAmount = results[i].results[0].roundedResult;
                resultGraphData[i] = {
                    date: results[i].dated,
                    amount: roundedAmount
                };
            }

            this.setState({
                resultDateRange: resultDateRange,
                resultGraphData: resultGraphData
            });
        })
        .catch((err) => {
            console.log('Error', err);
        });
    }
    render() {
        const activeHistory = (this.props.isRateActive) ? 'view ' : 'view active';
        return (
            <div id="thirtyDayHistory" className={activeHistory}>
                <InputFormGetHistory
                    from={this.state.from} 
                    to={this.state.to}
                    onFromChange={this.handleFromChange}
                    onToChange={this.handleToChange}
                    onCurrencyFormSubmit={this.handleSubmit}
                />
                <ResultGraph
                    dateRange={this.state.resultDateRange}
                    graphData={this.state.resultGraphData}
                />
            </div>
        );
    }
}
class InputFormGetHistory extends React.Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleFromChange(value) {
        this.props.onFromChange(value);
    }
    handleToChange(value) {
        this.props.onToChange(value);
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.onCurrencyFormSubmit(e);
    }
    render() {
        return (
            <section>
                <form onSubmit={this.handleSubmit}>
                    <DropDownFrom from={this.props.from} onFromChange={this.handleFromChange} />
                    <DropDownTo to={this.props.to} onToChange={this.handleToChange} />
                    <input type="submit" value="GO" />
                </form>
            </section>
        );
    }
}
class ResultGraph extends React.Component {
    render() {
        let rows = new Array(30);
        for(let i = 0; i < this.props.graphData.length; i++) {
            rows[i] = <tr key={i}><td>{this.props.graphData[i].date}</td><td>{this.props.graphData[i].amount}</td></tr>;
        }
        return (
            <section>
                <div>{this.props.dateRange}</div>
                <table>
                    <thead>
                        <th>Date</th>
                        <th>Amount</th>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </section>
        );
    }
}

class DropDownFrom extends React.Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
    }
    handleFromChange(e) {
        this.props.onFromChange(e.target.value);
    }
    render() {
        return (
            <select defaultValue={this.props.from} onChange={this.handleFromChange}>
                <option className="select-option-hidden">From</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
            </select>
        );
    }
}
class DropDownTo extends React.Component {
    constructor(props) {
        super(props);
        this.handleToChange = this.handleToChange.bind(this);
    }
    handleToChange(e) {
        this.props.onToChange(e.target.value);
    }
    render() {
        return (
            <select defaultValue={this.props.to} onChange={this.handleToChange}>
                <option className="select-option-hidden">To</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
            </select>
        );
    }
}


//TODO: Move mock input to test specs:
const postDataA = {
    base: 'CAD',
    amount: '10',
    symbol: ['USD', 'EUR']
};
const postDataB = {
    base: 'USD',
    amount: '10',
    symbol: 'EUR'
};
const postDataC = {
    base: 'CAD',
    amount: '10',
    symbol: ['USD', 'EUR'],
    date: '2985-03-15'
};

function postToApi(objPost) {
    const apiUrl = (IS_INTERNAL) ? _apiInternal : _apiExternal;
    return new Promise(function(resolve, reject) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( objPost )
        })
        .then((result) => {
            console.log(result);
            result.json()
            .then((items) => {
                console.log(items);
                resolve(items);
            }, (err) => {
                reject(err);
            })
        }, (err) => {
            reject(err);
        })
    });
}

//Accepts javascript Date object
//@returns string representing date in yyyy-mm-dd format
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
  
// ========================================

ReactDOM.render(
    <Currency />,
    document.getElementById('root')
);
  