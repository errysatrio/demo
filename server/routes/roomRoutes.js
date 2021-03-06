const roomController = require('../controllers/roomController.js')
const { authentication } = require('../middlewares/auth.js')
const upload = require("../helpers/googleStorage")

const express = require('express')
const router = express.Router()

router.get('/', roomController.getAllRoom)
router.get('/:RoomId', roomController.getOneRoom)
router.post('/:BuildingId', upload.single("image"), authentication, roomController.addRoom)
router.put('/:RoomId', authentication, roomController.updateRoom)
router.delete('/:BuildingId/:RoomId', authentication, roomController.deleteRoom)
module.exports = router
