'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request-promise');

const { flights } = require('./test-data/flightSeating');

const { reservations } = require('./test-data/reservations');

let newUser = {};

const PORT = process.env.PORT || 8000;

const getAvailability = async (currentFlight) => {
    try {
        const options = {
            uri: `https://journeyedu.herokuapp.com/slingair/flights/${currentFlight}`,
            headers: {
                'Accept': 'application/json'
            }
        }
        const obj = await request(options);
        const parsedObj = JSON.parse(obj)
        return parsedObj;
    } catch (err) { console.log(err) }
}

const handleFlightNumber = async (req, res) => {
    console.log(req.params);
    let currentFlight = req.params.flights;
    console.log(currentFlight);
        

    let answer = await getAvailability(currentFlight);
        res.send({
            flightInfo: answer[currentFlight]
        })
}

const handleUser = (req, res) => {
    newUser = req.body;
    console.log(newUser);
    res.send({
        status: 'success'
    })
    // console.log(res);
}

const handleGetFlights = async (req, res) => {
    const getFlights = async () => {
        try {
            const options = {
                uri: 'https://journeyedu.herokuapp.com/slingair/flights/',
                headers: {
                    'Accept': 'application/json'
                }
            }
            const obj = await request(options);
            const parsedObj = JSON.parse(obj)
            return parsedObj;
        } catch (err) { console.log(err) }
    }
    
    let answer = await getFlights();
    console.log(answer);

        res.send({
            flights: answer
        })
    
}



express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('dev'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    
    // endpoints

    
    .get('/slingair/getTheFlight/flights', handleGetFlights)
    .get('/slingair/:flights', handleFlightNumber)
    .post('/slingair/user', handleUser)



    
    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));