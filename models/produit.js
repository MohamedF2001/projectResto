const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const produitSchema = new Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    categorie: {
        type: Schema.Types.ObjectId,
        ref: 'Categorie'
    },
    imageProd: {
        type: String,
        required: true
    },
    quantite: {
        type: Number,
        required: false
    },
    qtePanier: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Produit', produitSchema);
