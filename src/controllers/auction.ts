import { Response, Request } from 'express'
import { Logger } from '../logger/logger'
import { responsesHelper } from '../utils/responses'
const logging = new Logger()
const logger = logging.log('auction-service')
import { auctionContract as contract } from '../utils/interact'

class AuctionController {
  /**
   * history
   * @desc users should be able to get auction history
   * Route: GET: '/api/v1/auction/history'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async history(req: Request, res: Response) {
    try {
      const bids = await contract.getAuctionHistory()
      return res
        .status(200)
        .send(
          responsesHelper.success(
            200,
            { bids: bids.toHexString() },
            'Auction history retrieved successfully',
          ),
        )
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error occured ${JSON.stringify(error)}`)
        const status = 500
        return res
          .status(status)
          .send(responsesHelper.error(status, error.message))
      }
    }
  }
  /**
   * submitBid
   * @desc users should be able to submit a bid
   * Route: POST: '/api/v1/auction/submit-bid'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async submitBid(req: Request, res: Response) {
    try {
      const data = req.body
      const { bid, sender } = data
      const responseData = await contract.submitBid(bid, sender)
      return res
        .status(200)
        .send(
          responsesHelper.success(
            200,
            { bid: responseData },
            'Auction bid successfully',
          ),
        )
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error occured ${JSON.stringify(error)}`)
        const status = 500
        return res
          .status(status)
          .send(responsesHelper.error(status, error.message))
      }
    }
  }
  /**
   * highestBid
   * @desc users should be able to get auction highest-bid
   * Route: GET: '/api/v1/auction/highest-bid'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async highestBid(req: Request, res: Response) {
    try {
      const highestBid = await contract.highestBid()
      return res
        .status(200)
        .send(
          responsesHelper.success(
            200,
            { highestBid: highestBid.toHexString() },
            'Auction highest bid retrieved successfully',
          ),
        )
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error occured ${JSON.stringify(error)}`)
        const status = 500
        return res
          .status(status)
          .send(responsesHelper.error(status, error.message))
      }
    }
  }
  /**
   * auctionStatus
   * @desc users should be able to get auction status
   * Route: GET: '/api/v1/auction/status'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async auctionStatus(req: Request, res: Response) {
    try {
      const highestBid = await contract.highestBid()
      const auctionStatus = await contract.auctionStatus()
      return res
        .status(200)
        .send(
          responsesHelper.success(
            200,
            { highestBid: highestBid.toHexString(), auctionStatus },
            'Auction status retrieved successfully',
          ),
        )
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error occured ${JSON.stringify(error)}`)
        const status = 500
        return res
          .status(status)
          .send(responsesHelper.error(status, error.message))
      }
    }
  }
  /**
   * statistics
   * @desc users should be able to get auction statistics
   * Route: GET: '/api/v1/auction/statistics'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async statistics(req: Request, res: Response) {
    try {
      const statistics = await contract.totalEthVolume()
      const totalBids = await contract.totalBids()
      return res.status(200).send(
        responsesHelper.success(
          200,
          {
            statistics: statistics.toHexString(),
            totalBids: totalBids.toString(),
          },
          'Auction statistics retrieved successfully',
        ),
      )
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`error occured  ${JSON.stringify(error)}`)
        const status = 500
        return res
          .status(status)
          .send(responsesHelper.error(status, error.message))
      }
    }
  }
}

export const auctionController = new AuctionController()
