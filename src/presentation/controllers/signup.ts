import { HttpResponse, HttpRequest, Controller, EmailValidator } from '../protocols/'
import { MissingParamError, InvalidParamError,  } from '../erros/index'
import { badRequest, serverError  } from '../helpers/http-helper'

export class SignUpController  implements Controller {
  private readonly emailValidator: EmailValidator
  
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }
  handle (httpRequest: HttpRequest): HttpResponse{
    const requiredFields = ['name', 'email', 'password','passwordConfirmation']
    try {
      for(let fied of requiredFields){
        if(!httpRequest.body[fied]){
          return badRequest (new MissingParamError(fied))
        }
      }
      const { email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation){
          return badRequest(new InvalidParamError('passwordConfirmation'))
      }
     const isValid =  this.emailValidator.isValid(email)
     if (!isValid) {
        return badRequest(new InvalidParamError('email'))
     } 
    } catch (error) {
      return serverError()
    }
  }
}