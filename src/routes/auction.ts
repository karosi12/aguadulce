import * as express from 'express'
import { auctionController } from '../controllers/auction'
import { authenticate } from '../middlewares/authenticate'

const router = express.Router()

router.post('/auction/submit-bid', authenticate, auctionController.submitBid)
router.get('/auction/status', authenticate, auctionController.auctionStatus)
router.get('/auction/highest-bid', authenticate, auctionController.highestBid)
router.get('/auction/history', authenticate, auctionController.history)
router.get('/auction/statistics', authenticate, auctionController.statistics)

export const auctionsRoute = router
