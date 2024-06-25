const express = require('express')
const router = express.Router()
const actions = require('../methods/actions')
const multer = require('multer');
const path = require('path')
const fs = require('fs');

const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

var upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
})

router.get('/', (req, res) => {
    res.send('Hello World')
})

//@route POST /addCat
//router.post('/addCat', actions.addCat)
router.post('/postCat', upload.single('imageCat'), actions.add_cat)

router.post('/ajouter_produit', upload.single('imageProd'), actions.add_pro)

// Route pour ajouter une commande
router.post('/addCommande', actions.addCommande);

router.get('/allProd', actions.listeProd)

router.get('/allCat', actions.listeCat)

// Route pour mettre à jour l'état de la commande
router.put('/updateEtatCommande', actions.updateEtatCommande);

// Routes pour les catégories
router.delete('/deleteCat/:id', actions.delete_cat);
router.put('/updateCat/:id', actions.update_cat);

// Routes pour les produits
router.delete('/deleteProd/:id', actions.delete_pro);
router.put('/updatePro/:id', actions.update_pro);

// Routes pour les commandes
router.delete('/deleteCom/:id', actions.deleteCommande);

module.exports = router

