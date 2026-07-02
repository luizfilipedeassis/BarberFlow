const express = require('express');
const {
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', listAppointments);
router.get('/:id', getAppointment);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;
