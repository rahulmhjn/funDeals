/* {
state1:
{city1:["area1","area2"],city2:["area1","area2"]},
state2:
{city1:["area1","area2"],city2:["area1","area2"]}

} */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    identifier:{type:String},    
    model:{type:Object}

});

module.exports = mongoose.model('state', stateSchema);
