const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commandeSchema = new Schema({
    clientName: {
        type: String,
        required: false
    },
    article: {
        type: String,
        required: true
    },
    dansLePanier: {
        type: String,
        required: true
    },
    prixU: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: false
    },
    numTable: {
        type: String,
        required: true
    },
    etatCommande: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Commande', commandeSchema);
