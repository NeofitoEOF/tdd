import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError, InvalidParamError,  } from '../erros/index'
import { badRequest, serverError  } from '../helpers/http-helper'
import { Controller, EmailValidator } from '../protocols/'

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
     const isValid =  this.emailValidator.isValid(httpRequest.body.email)
     if (!isValid) {
        return badRequest(new InvalidParamError('email'))
     } 
    } catch (error) {
      return serverError()
    }
  }
}