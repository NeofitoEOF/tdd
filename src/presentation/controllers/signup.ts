import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest  } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
export class SignUpController  implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse{
    const requiredFields = ['name', 'email', 'password','passwordConfirmation']
    for(let fied of requiredFields){
      if(!httpRequest.body[fied]){
        return badRequest (new MissingParamError(fied))
      }
    }
  }
}