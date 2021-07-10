import {SignUpController} from './signup'
import { MissingParamError } from '../erros/missing-param-error'
describe('SgnUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
   const httpRequese = sut.handle(httpRequest)
   expect(httpRequese.statusCode).toBe(400)  
   expect(httpRequese.body).toEqual(new MissingParamError('name'))  
  })

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        passwordConfirmation: 'any_password'
      }
    }
   const httpRequese = sut.handle(httpRequest)
   expect(httpRequese.statusCode).toBe(400)  
   expect(httpRequese.body).toEqual(new MissingParamError('password'))  
  })

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
   const httpRequese = sut.handle(httpRequest)
   expect(httpRequese.statusCode).toBe(400)  
   expect(httpRequese.body).toEqual(new MissingParamError('email'))  
  })
})