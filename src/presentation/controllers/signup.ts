import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest  } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../erros/invalid-param-error'
import { ServerError } from '../erros/server-error'

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
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}