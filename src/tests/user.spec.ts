import { Request, Response } from 'express'
import chai from 'chai'
import sinon from 'sinon'
// import sinonChai from 'sinon-chai'
import { userController } from '../controllers/user'
import { IRequest } from '../models/user.interface'
import { Users } from '../models/user'

const expect = chai.expect
// chai.use(sinonChai)

describe('UserController', () => {
  let stubValue = {
    _id: '56cb91bdc3464f14678934ca',
    fullName: 'John Doe',
    password: 'xxx1234',
    email: 'johndoe@example.com',
    phoneNumber: '1234',
  }
  beforeEach(() => {
    sinon.restore()
  })

  it('should get user data', async () => {
    const status = sinon.stub().returnsThis()
    const send = sinon.spy()
    const req = {
      decoded: { id: stubValue._id },
    } as IRequest
    const res = { status, send } as unknown as Response
    status.returns(res)
    //@ts-ignore
    sinon.stub(Users, 'findById').returns(stubValue)
    await userController.view(req, res)
    expect(status.calledOnce).to.be.true
    expect(status.args[0][0]).to.equal(200)
    expect(send.args[0][0].data).to.equal(stubValue)
  })

})
