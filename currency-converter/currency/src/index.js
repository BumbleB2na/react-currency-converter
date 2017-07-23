import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const IS_INTERNAL = true;
const _apiInternal = 'http://localhost:8888/api/0.2/';
const _apiExternal = 'http://example.com:8888/api/0.2';  //TODO: set example.com:8888
  
class CurrencyConverter extends React.Component {
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
            <h1>Currency converter</h1>
        );
    }
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
    <CurrencyConverter />,
    document.getElementById('root')
);
  