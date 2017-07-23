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
            results: []
        }
    }
    componentDidMount() {     
        postToApi( postDataC )
        .then((result) => {
            this.setState({
                results: result.results
            });
        }, (err) => {
            console.log('Error', err);
        })
    }

    render() {
        return (
            <div>
                <h1>CURRENCY</h1>
                <Nav getRateActive={true} />
                <GetRate />
                <ThirtyDayHistory />
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
    render() {
        return (
            <div id="getRate">
                <InputFormGetRate />
                <ResultTable />
            </div>
        );
    }
}
class InputFormGetRate extends React.Component {
    render() {
        return (
            <section>
                <form>
                    <input type="currency" placeholder="Amount" />
                    <DropDownFrom />
                    <DropDownTo />
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
                1 USD = 11.8374 CAD
            </section>
        );
    }
}


class ThirtyDayHistory extends React.Component {
    render() {
        return (
            <div id="thirtyDayHistory">
                <InputFormGetRate />
                <ResultTable />
            </div>
        );
    }
}
class InputFormGetHistory extends React.Component {
    render() {
        return (
            <section>
                <form>
                    <DropDownFrom />
                    <DropDownTo />
                    <ButtonGo />
                </form>
            </section>
        );
    }
}
class ResultGraph extends React.Component {
    render() {
        return (
            <section>
                GRAPH
            </section>
        );
    }
}

function DropDownFrom() {
    return (
        <select>
            <option className="select-option-hidden">From</option>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
        </select>
    );
}
function DropDownTo() {
    return (
        <select>
            <option className="select-option-hidden">To</option>
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
        </select>
    );
}
function ButtonGo() {
    return (
        <input type="submit" value="GO" />
    );
}
  
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

  
// ========================================

ReactDOM.render(
    <Currency />,
    document.getElementById('root')
);
  