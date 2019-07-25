// Exhange.js written using Hooks.

import React, { useState, useEffect } from 'react';

function ExchangeHook(props) {

    const currencies = ["CAD", "HUF", "CZK", "AUD", "JPY", "PLN", "USD", "EUR"]
    const allowedInput = /^(\d+\.?(\d+)?)$/

    const [cached, setCached] = useState({})
    const [base, setBase] = useState("PLN")
    const [other, setOther] = useState("EUR")
    const [value, setValue] = useState(0)
    const [converted, setConverted] = useState(0)

    useEffect(() => {
    function recalculate() {
        const val = parseFloat(value)
        if (isNaN(val)) {
            return 
        }

        const cached_base = cached[base]

        if (cached_base !== undefined && Date.now() - cached_base.timestamp < 1000 * 60) {
            setConverted(cached_base.data.rates[other] * val)
        } else {

        fetch(`https://api.exchangeratesapi.io/latest?base=${base}`)
        .then(response => response.json())
        .then(data => {

            setCached({[base]: {data: data, timestamp: Date.now()}})

            setConverted(data.rates[other] === undefined ? "Not found" : data.rates[other] * val)
        })
    }
    }
        recalculate()
    }, [base, other, value, cached])

    function handleChange(event) {
        if (allowedInput.test(event.target.value) || event.target.value === "") {
            setValue(event.target.value)
            setConverted(event.target.value !== "" ? "Calculating..." : "")
    }
    }

    return (
        <div>
            <div>
            <select value={base} onChange={(e) => setBase(e.target.value)} name="base"> 
            {currencies.map((currency, i) => {
                return (
                    <option key={i} value={currency}>{currency}</option>
                )
            })}
            </select>
            <input onChange={handleChange} value={value}/>
            </div>

            <div>
            <select value={other} onChange={(e) => setOther(e.target.value)} name="other"> 
            {currencies.map((currency, i) => {
                return (
                    <option key={i} value={currency}>{currency}</option>
                )
            })}
            </select>
            <input value={converted} readOnly={true} />
            </div>
        </div>
    )
}

export default ExchangeHook