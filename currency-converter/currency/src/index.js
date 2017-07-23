import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const IS_INTERNAL = true;
const _apiInternal = 'http://localhost:8888/api/0.2/';
const _apiExternal = 'http://example.com:8888/api/0.2';  //TODO: set example.com:8888
  
class Currency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getRateActive: true
        }
    }
    render() {
        const activeRate = (this.state.getRateActive) ? 'active' : '';
        const activeHistory = (this.state.getRateActive) ? '' : 'active';
        return (
            <div>
                <h1>CURRENCY</h1>
                <Nav getRateActive={true} />
                <GetRate className={activeRate} />
                <ThirtyDayHistory className={activeHistory} />
            </div>
        );
    }
}

class Nav extends React.Component {
    render() {
        const activeRate = (this.props.getRateActive) ? 'active' : '';
        const activeHistory = (this.props.getRateActive) ? '' : 'active';
        return (
            <nav>
                <button className={activeRate}>GET RATE</button>
                <button className={activeHistory}>RATE 30 DAY HISTORY</button>
            </nav>
        );
    }
}

class GetRate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '1',
            from: 'USD',
            to: 'CAD',
            results: [],
            resultMessage: '',
        };
    }
    //TODO move getRateAsync call within handleSubmit
    componentDidMount() {
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
                resultMessage: `${result.amount} ${r.from} = ${r.fullResult} ${r.to}`
            });
        }, (err) => {
            console.log('Error', err);
        })
    }
    render() {
        const activeRate = (this.props.getRateActive) ? 'active' : '';
        const activeHistory = (this.props.getRateActive) ? '' : 'active';
        return (
            <div id="getRate">
                <InputFormGetRate 
                    amount={this.state.amount} 
                    from={this.state.from} 
                    to={this.state.to} 
                />
                <ResultTable message={this.state.resultMessage} />
            </div>
        );
    }
}
class InputFormGetRate extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <section>
                <form>
                    <input type="currency" placeholder="Amount" value={this.props.amount} />
                    <DropDownFrom from={this.props.from} />
                    <DropDownTo to={this.props.to} />
                    <ButtonGo />
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
            from: 'USD',
            to: 'CAD',
            results: [],
            resultDateRange: '',
            resultGraphData: []
        }
    }
    //TODO move getDollarHistoryAsync call within handleSubmit
    componentDidMount() {
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
        const activeRate = (this.props.getRateActive) ? 'active' : '';
        const activeHistory = (this.props.getRateActive) ? '' : 'active';
        return (
            <div id="thirtyDayHistory">
                <InputFormGetHistory
                    from={this.state.from} 
                    to={this.state.to}
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
    }
    render() {
        return (
            <section>
                <form>
                    <DropDownFrom from={this.props.from} />
                    <DropDownTo to={this.props.to} />
                    <ButtonGo />
                </form>
            </section>
        );
    }
}
class ResultGraph extends React.Component {
    render() {
        let rows = new Array(30);
        for(let i = 0; i < this.props.graphData.length; i++) {
            rows[i] = <tr><td>{this.props.graphData[i].date}</td><td>{this.props.graphData[i].amount}</td></tr>;
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
    render() {
        return (
            <select value={this.props.from}>
                <option className="select-option-hidden">From</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
            </select>
        );
    }
}
class DropDownTo extends React.Component {
    render() {
        return (
            <select value={this.props.to}>
                <option className="select-option-hidden">To</option>
                <option value="USD">USD</option>
                <option value="CAD">CAD</option>
            </select>
        );
    }
}
function ButtonGo() {
    return (
        <input type="submit" value="GO" />
    );
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
  