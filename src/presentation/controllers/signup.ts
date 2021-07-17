import { HttpResponse, HttpRequest, Controller, EmailValidator } from '../protocols/'
import { MissingParamError, InvalidParamError,  } from '../erros/index'
import { badRequest, serverError  } from '../helpers/http-helper'
import { AddAccount } from '../../domain/usercasses/add-account'

export class SignUpController  implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount : AddAccount
  
  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
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
      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError()
    }
  }
}