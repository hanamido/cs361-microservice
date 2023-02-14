import express from 'express'; 
import bodyParser from 'body-parser'; 
import 'dotenv/config';  

import * as HelpMsgs from './HelpModel.mjs'; 

const app = express(); 
app.set('view engine', 'pug');
const PORT = process.env.PORT || 3001; 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true})); 

app.listen(PORT, () => {
    console.log(`Help Microservice listening on port ${PORT}...`); 
});

// log errors just in case
app.use((err, req, res, next) => {
    console.error(err.status); 
    res.status(500).send({ error: 'Something went wrong!' }); 
}); 

app.get('/', (req, res) => {
    res.render('index', { title: "Help Microservice", start: "Begin with the following routes below:", message: "Routes supported: /add-help to add help messages, /get-all to view all help messages, and /id to get a specific help message."}); 
})

// Add help messages to the db
app.post('/add-help', (req, res) => {
    HelpMsgs.createHelpMsg(req.body.helpMsg)
    // if successful
    .then (helpMsg => {
        res.status(201).json(helpMsg); 
    })
    // else catch the error
    .catch(error => {
        console.error(error); 
        res.status(400).json({ Error: 'Invalid request' }); 
    }); 
}); 

// Request/get all help messages in the db
app.get("/get-all", (req, res) => {
    let filter = {}; 
    HelpMsgs.findHelpMsgs(filter)
        .then(helpMsg => {
            if (helpMsg !== null) {
                // debug: console.log(helpMsg);
                res.status(200).json(helpMsg); 
            } else {
                res.status(404).json({ Error: "No Help Messages available." }); 
            }
        })
        .catch(error => {
            console.error(error); 
            res.status(400).json({ Error: "Request failed." }); 
        }); 
}); 

// Finds one help message and return its contents
app.get('/:id', (req, res) => {
    const helpMsgId = req.params.id; 
    HelpMsgs.findHelpMsg(helpMsgId)
    .then(helpMsg => {
        if (helpMsg !== null) {  // if the help message exists
            // res.status(200).json(helpMsg); 
            res.render('index', { title: 'Matching Help Message', message: helpMsg.helpMsg }); 
        } else {
            res.status(404).json({ Error: "Help message not found." }); 
        }
    })
    .catch(error => {
        console.error(error);
        res.status(404).json({ Error: "Invalid request" }); 
    }); 
}); 

