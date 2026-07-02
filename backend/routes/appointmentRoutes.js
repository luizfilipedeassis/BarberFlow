const express = require('express');
const {
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment
} = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', listAppointments);
router.get('/:id', getAppointment);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);

module.exports = router;
