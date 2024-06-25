const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorieSchema = new Schema({
    nomCat: {
        type: String,
        required: true
    },
    descriptionCat: {
        type: String,
        required: true
    },
    imageCat: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Categorie', categorieSchema);
