import {SignUpController} from './signup'
import { MissingParamError } from '../erros/missing-param-error'
import { InvalidParamError } from '../erros/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
 const makeSut = (): SignUpController => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return new SignUpController(emailValidatorStub)
}

describe('SgnUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
   const HttpResponse = sut.handle(httpRequest)
   expect(HttpResponse.statusCode).toBe(400)  
   expect(HttpResponse.body).toEqual(new MissingParamError('name'))  
  })

  test('Should return 400 if no email is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
   const HttpResponse = sut.handle(httpRequest)
   expect(HttpResponse.statusCode).toBe(400)  
   expect(HttpResponse.body).toEqual(new MissingParamError('email'))  
  })

  test('Should return 400 if no password is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
   const HttpResponse = sut.handle(httpRequest)
   expect(HttpResponse.statusCode).toBe(400)  
   expect(HttpResponse.body).toEqual(new MissingParamError('password'))  
  })

  test('Should return 400 if no password confirmation is provided', () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      }
    }
   const HttpResponse = sut.handle(httpRequest)
   expect(HttpResponse.statusCode).toBe(400)  
   expect(HttpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))  
  })
})
test('Should return 400 if an invalid email is provided', () => {
  const sut = makeSut()
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'invalid_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
 const HttpResponse = sut.handle(httpRequest)
 expect(HttpResponse.statusCode).toBe(400)  
 expect(HttpResponse.body).toEqual(new InvalidParamError('email'))  
})