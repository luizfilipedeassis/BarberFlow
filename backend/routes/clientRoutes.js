const express = require('express');
const { listClients, createClient, deleteClient } = require('../controllers/clientController');

const router = express.Router();

router.get('/', listClients);
router.post('/', createClient);
router.delete('/:id', deleteClient);

module.exports = router;
