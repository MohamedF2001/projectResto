const mongoose = require('mongoose')
const dbConfig = require('./dbconfig')

//const uri = "mongodb+srv://MoussF:mohamed2001@cluster0.rde6y.mongodb.net/authflutter?retryWrites=true&w=majority";
//const uri = "mongodb+srv://MoussF:mouss2001@lesrestos.rde6y.mongodb.net/restoApi?retryWrites=true&w=majority";
const uri = "mongodb+srv://MoussF:mohamed2001@cluster0.rde6y.mongodb.net/imgApi?retryWrites=true&w=majority";

// Remplacez ces valeurs par vos propres informations de connexion
const dbUsername = 'MoussF';
const dbPassword = 'mouss2001';
const dbName = 'restoApi';
const clusterName = 'lesrestos';
const atlasUrl = `mongodb+srv://${dbUsername}:${dbPassword}@${clusterName}.mongodb.net/${dbName}`;

// Options de configuration pour la connexion
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
};

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            /*atlasUrl,*/
            uri,
            /*dbConfig.database,*/
            {
                //useNewUrlParser: true,
                //useUnifiedTopology: true,
                //useFindAndModify: false
            })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB