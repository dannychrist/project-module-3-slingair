'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request-promise');

const { flights } = require('./test-data/flightSeating');

const { reservations } = require('./test-data/reservations');

let newUser = {};

const PORT = process.env.PORT || 8000;



const getData = async () => {

        const response = await request('https://journeyedu.herokuapp.com').then(res => {
        return  JSON.parse(res)
        }).then((herokuapp) => {
            console.log(herokuapp);
        }).catch(err => { console.log('Error: ', err);
    throw new error(err)})
    
}

getData();


const handleFlightNumber = async (req, res) => {
    console.log(req.params);
    let currentFlight = req.params.flights;
    console.log(currentFlight);
        


    const getAvailability = async () => {
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
    
    let answer = await getAvailability();


        res.send({
            flightInfo: answer
        })
    
}

// const handleSpecificFlight = (req, res) => {

// }


const handleUser = (req, res) => {
    newUser = req.body;
    console.log(newUser);
    res.send({
        status: 'success'
    })
    // console.log(res);
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

    .get('/slingair/:flights', handleFlightNumber)
    // .get('/slingair/:flights/:flight', handleSpecificFlight)
    .post('/slingair/user', handleUser)

    
    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));