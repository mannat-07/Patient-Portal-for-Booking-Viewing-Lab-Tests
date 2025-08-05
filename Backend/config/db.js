const {connect} = require('mongoose')

const connectToDb = async(url)=>{
    try {
        await connect(url);
        console.log('Connected to DB successfully');
    } catch (error) {
        console.log('Error in connecting to db', error);
    }
}

module.exports = connectToDb;