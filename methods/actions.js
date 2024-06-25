const Categories = require('../models/categorie');
const Produits = require('../models/produit');
const { bucket } = require('../firebase-config'); // Importation du bucket Firebase
const Commande = require('../models/commande');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://restauapi.adaptable.app/';

var functions = {
    // fonction pour ajouter les catégories
    add_cat: function (req, res) {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const localFilePath = path.join(__dirname, '../uploads', req.file.filename);

        // Upload le fichier sur Firebase Storage
        const blob = bucket.file(Date.now() + '-' + req.file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('Something went wrong.');
        });

        blobStream.on('finish', async () => {
            try {
                const [url] = await blob.getSignedUrl({
                    action: 'read',
                    expires: '03-17-2100' // Date d'expiration très lointaine pour rendre l'URL pratiquement non expirante
                });

                const x = new Categories({
                    nomCat: req.body.nomCat,
                    descriptionCat: req.body.descriptionCat,
                    imageCat: url
                });

                x.save()
                    .then(result => {
                        console.log(result);
                        res.json({ result });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send('Error storing the URL in MongoDB.');
                    });
            } catch (err) {
                console.error(err);
                res.status(500).send('Error generating signed URL.');
            } finally {
                // Supprimer le fichier local après l'upload
                fs.unlinkSync(localFilePath);
            }
        });

        fs.createReadStream(localFilePath).pipe(blobStream);
    },

    // fonction pour ajouter les produits
    add_pro: function (req, res) {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const localFilePath = path.join(__dirname, '../uploads', req.file.filename);

        // Upload le fichier sur Firebase Storage
        const blob = bucket.file(Date.now() + '-' + req.file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        blobStream.on('error', (err) => {
            console.error(err);
            res.status(500).send('Something went wrong.');
        });

        blobStream.on('finish', async () => {
            try {
                const [url] = await blob.getSignedUrl({
                    action: 'read',
                    expires: '03-17-2100' // Date d'expiration très lointaine pour rendre l'URL pratiquement non expirante
                });

                const p = new Produits({
                    nom: req.body.nom,
                    description: req.body.description,
                    prix: req.body.prix,
                    categorie: req.body.categorie,
                    quantite: req.body.quantite,
                    qtePanier: req.body.qtePanier,
                    imageProd: url
                });

                p.save()
                    .then(result => {
                        console.log(result);
                        res.json({ result });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send('Error storing the URL in MongoDB.');
                    });
            } catch (err) {
                console.error(err);
                res.status(500).send('Error generating signed URL.');
            } finally {
                // Supprimer le fichier local après l'upload
                fs.unlinkSync(localFilePath);
            }
        });

        fs.createReadStream(localFilePath).pipe(blobStream);
    },

    addCommande: function (req, res) {
        const nouvelleCommande = new Commande({
            clientName: req.body.clientName, // Nom du client
            article: req.body.article, // Nom de l'article
            dansLePanier: req.body.dansLePanier, // Indique si l'article est dans le panier
            prixU: req.body.prixU, // Prix unitaire de l'article
            tel: req.body.tel, // Numéro de téléphone du client
            numTable: req.body.numTable, // Numéro de table
            etatCommande: req.body.etatCommande || false // État de la commande, par défaut false
        });

        nouvelleCommande.save()
            .then((commande) => {
                console.log('Nouvelle commande ajoutée :', commande);
                res.json({ success: true, msg: 'Nouvelle commande ajoutée avec succès', result: commande });
            })
            .catch((err) => {
                console.error('Erreur lors de l\'ajout de la commande :', err);
                res.status(500).json({ success: false, msg: 'Erreur lors de l\'ajout de la commande' });
            });
    },

    updateEtatCommande: function (req, res) {
        const commandeId = req.body.commandeId; // Identifiant de la commande
        const nouvelEtat = req.body.etatCommande; // Nouvel état de la commande

        Commande.findByIdAndUpdate(
            commandeId,
            { etatCommande: nouvelEtat },
            { new: true } // Pour retourner le document mis à jour
        )
            .then((commande) => {
                if (!commande) {
                    return res.status(404).json({ success: false, msg: 'Commande non trouvée' });
                }
                console.log('État de la commande mis à jour :', commande);
                res.json({ success: true, msg: 'État de la commande mis à jour avec succès', result: commande });
            })
            .catch((err) => {
                console.error('Erreur lors de la mise à jour de la commande :', err);
                res.status(500).json({ success: false, msg: 'Erreur lors de la mise à jour de la commande' });
            });
    },

    // fonction pour afficher les catégories
    listeCat: function (req, res) {
        Categories.find()
            .then(result => {
                console.log(result);
                res.json({ result });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error storing the URL in MongoDB.');
            });
    },

    // fonction pour afficher les produits
    listeProd: function (req, res) {
        Produits.find()
            .populate('categorie') // Popule la référence 'categorie' avec les détails du modèle 'Categorie'
            .then(result => {
                console.log(result);
                res.json({ result });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error retrieving products.');
            });
    },

    // fonction pour supprimer une catégorie (et ses produits associés)
    delete_cat: function (req, res) {
        const categoryId = req.params.id; // ID de la catégorie à supprimer

        Categories.findByIdAndDelete(categoryId)
            .then(async (deletedCategory) => {
                if (!deletedCategory) {
                    return res.status(404).json({ success: false, msg: 'Catégorie non trouvée' });
                }
                // Supprimer tous les produits associés à cette catégorie
                await Produits.deleteMany({ categorie: categoryId });
                console.log('Catégorie et ses produits associés supprimés avec succès');
                res.json({ success: true, msg: 'Catégorie et ses produits associés supprimés avec succès' });
            })
            .catch((err) => {
                console.error('Erreur lors de la suppression de la catégorie :', err);
                res.status(500).json({ success: false, msg: 'Erreur lors de la suppression de la catégorie' });
            });
    },

    // fonction pour mettre à jour une catégorie
    update_cat: function (req, res) {
        const categoryId = req.params.id; // ID de la catégorie à mettre à jour

        Categories.findByIdAndUpdate(
            categoryId,
            {
                nomCat: req.body.nomCat,
                descriptionCat: req.body.descriptionCat
            },
            {
                new: true
            } // Pour retourner le document mis à jour
        )
            .then((updatedCategory) => {
                if (!updatedCategory) {
                    return res.status(404).json({ success: false, msg: 'Catégorie non trouvée' });
                }
                console.log('Catégorie mise à jour :', updatedCategory);
                res.json({ success: true, msg: 'Catégorie mise à jour avec succès', result: updatedCategory });
            })
            .catch((err) => {
                console.error('Erreur lors de la mise à jour de la catégorie :', err);
                res.status(500).json({ success: false, msg: 'Erreur lors de la mise à jour de la catégorie' });
            });
    },

    // fonction pour supprimer un produit
    delete_pro: function (req, res) {
        const productId = req.params.id; // ID du produit à supprimer

        Produits.findByIdAndDelete(productId)
            .then((deletedProduct) => {
                if (!deletedProduct) {
                    return res.status(404).json({ success: false, msg: 'Produit non trouvé' });
                }
                console.log('Produit supprimé :', deletedProduct);
                res.json({ success: true, msg: 'Produit supprimé avec succès' });
            })
            .catch((err) => {
                console.error('Erreur lors de la suppression du produit :', err);
                res.status(500).json({ success: false, msg: 'Erreur lors de la suppression du produit' });
            });
    },

    // fonction pour mettre à jour un produit
    update_pro: function (req, res) {
        const productId = req.params.id; // ID du produit à mettre à jour

        Produits.findByIdAndUpdate(
            productId,
            {
                nom: req.body.nom,
                description: req.body.description,
                prix: req.body.prix,
                categorie: req.body.categorie,
                quantite: req.body.quantite,
                qtePanier: req.body.qtePanier
            },
            { 
                new: true 
            } // Pour retourner le document mis à jour
        )
            .then((updatedProduct) => {
                if (!updatedProduct) {
                    return res.status(404).json({ success: false, msg: 'Produit non trouvé' });
                }
                console.log('Produit mis à jour :', updatedProduct);
                res.json({ success: true, msg: 'Produit mis à jour avec succès', result: updatedProduct });
            })
            .catch((err) => {
                console.error('Erreur lors de la mise à jour du produit :', err);
                res.status(500).json({ success: false, msg: 'Erreur lors de la mise à jour du produit' });
            });
    },

    // fonction pour supprimer une commande
    deleteCommande: function (req, res) {
        const commandeId = req.params.id; // ID de la commande à supprimer

        Commande.findByIdAndDelete(commandeId)
            .then((deletedCommande) => {
                if (!deletedCommande) {
                    return res.status(404).json({ success: false, msg: 'Commande non trouvée' });
                }
                console.log('Commande supprimée :', deletedCommande);
                res.json({ success: true, msg: 'Commande supprimée avec succès' });
            })
            .catch((err) => {
                console.error('Erreur lors de la suppression de la commande :', err);
                res.status(500).json({ success: false, msg: 'Erreur lors de la suppression de la commande' });
            });
    },



};

module.exports = functions;
