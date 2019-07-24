import React from 'react';

class Exchange extends React.Component {


    constructor(props) {
        super(props)
        this.currencies = ["CAD", "HUF", "CZK", "AUD", "JPY", "PLN", "USD", "EUR"]
        this.cached = {}
        this.allowedInput = /^(\d+\.?(\d+)?)$/
        this.state = {
            base: "PLN",
            other: "EUR",
            value: 0,
            converted: 0,
        }
    }
    
    render() {
        return (
            <div>
                <div>
                <select value={this.state.base} onChange={this.handleSelect} name="base"> 
                {this.currencies.map((currency, i) => {
                    return (
                        <option key={i} value={currency}>{currency}</option>
                    )
                })}
                </select>
                <input onChange={this.handleChange} value={this.state.value}/>
                </div>

                <div>
                <select value={this.state.other} onChange={this.handleSelect} name="other"> 
                {this.currencies.map((currency, i) => {
                    return (
                        <option key={i} value={currency}>{currency}</option>
                    )
                })}
                </select>
                <input value={this.state.converted} readOnly={true} />
                </div>
            </div>
        )
    }

    handleSelect = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        }, this.recalculate)
    }

    handleChange = (event) => {
        if (this.allowedInput.test(event.target.value) || event.target.value === "") {
        this.setState({
            value: event.target.value,
            converted: event.target.value !== "" ? "Calculating..." : ""
        }, this.recalculate)
    }
    }

    recalculate = () => {
        const value = parseFloat(this.state.value)
        if (isNaN(value)) {
            return 
        }

        const cached_base = this.cached[this.state.base]
        if (cached_base !== undefined && Date.now() - cached_base.timestamp < 1000 * 60) {
            this.setState({
                converted: cached_base.data.rates[this.state.other] * value
            })
        } else {


        fetch(`https://api.exchangeratesapi.io/latest?base=${this.state.base}`)
        .then(response => response.json())
        .then(data => {

            this.cached[this.state.base] = {
                data: data,
                timestamp: Date.now()
            }

            this.setState({
                converted: data.rates[this.state.other] === undefined ? "Not found" : data.rates[this.state.other] * value
            })
        })
    }
    }
}

export default Exchange