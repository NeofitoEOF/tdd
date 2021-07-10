import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../erros/missing-param-error'
import { badRequest  } from '../helpers/http-helper'
export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse{
    const requiredFields = ['name', 'email']
    for(let fied of requiredFields){
      if(!httpRequest.body[fied]){
        return badRequest (new MissingParamError(fied))
      }
    }
  }
}