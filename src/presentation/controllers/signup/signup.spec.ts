import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../erros'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error()
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SgnUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
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
    const { sut } = makeSut()

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
    const { sut } = makeSut()
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

test('Should return 400 if no password confirmation fails', () => {
  const { sut } = makeSut()
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'invalid_password'
    }
  }
  const HttpResponse = sut.handle(httpRequest)
  expect(HttpResponse.statusCode).toBe(400)
  expect(HttpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
})


test('Should return 55 if an invalid email is provided', () => {
  const { sut, emailValidatorStub } = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
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

test('Should call EmailValidator with correct email', () => {
  const { sut, emailValidatorStub } = makeSut()
  const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  sut.handle(httpRequest)
  expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
})

test('Should return 500 if EmailValidator throws', () => {
  const emailValidatorStub = makeEmailValidatorWithError()
  const sut = new SignUpController(emailValidatorStub)
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  const HttpResponse = sut.handle(httpRequest)
  expect(HttpResponse.statusCode).toBe(500)
  expect(HttpResponse.body).toEqual(new ServerError())
})

test('Should return 500 if AddAccount throws', () => {
  const { sut, addAccountStub } = makeSut()
  jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
    throw new Error()
  })
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'invalid_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  const HttpResponse = sut.handle(httpRequest)
  expect(HttpResponse.statusCode).toBe(500)
  expect(HttpResponse.body).toEqual(new ServerError() )
})



test('Should call AddAccount with correct values', () => {
  const { sut, addAccountStub } = makeSut()
  const addSpy = jest.spyOn(addAccountStub, 'add')
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }
  sut.handle(httpRequest)
  expect(addSpy).toHaveBeenCalledWith({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  })
})