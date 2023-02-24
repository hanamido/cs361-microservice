import mongoose from 'mongoose'; 
import 'dotenv/config'; 
const Schema = mongoose.Schema; 

mongoose.connect(
    process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,}
); 

const db = mongoose.connection; 

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose");
});

// Create a new help message entry
const createHelpMsg = async (helpMsg) => {
    const help = new HelpMsg({ helpMsg: helpMsg });
    return help.save(); 
};

// Receive/retrieve all help entries in the db
const findHelpMsgs = async (filter) => {
    const query = HelpMsg.find(filter);
    // debug: console.log(query); 
    return query.exec(); 
};

// Retrieve a specific help message in the db
const findHelpMsg = async(_id) => {
    const query = HelpMsg.findOne( {_id: _id } );
    return query.exec(); 
};

const HelpMsgSchema = new Schema(
    {
        helpMsg: {
            type: String,
            required: true,
        }
    }
);

const HelpMsg = mongoose.model("helpMsgs", HelpMsgSchema); 

export { createHelpMsg, findHelpMsg, findHelpMsgs }; 