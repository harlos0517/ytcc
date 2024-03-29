export type User = {
  email: string
  googleId?: string
}

export type UserResponse = User

export namespace Register {
  export type Request = {
    email: string
    password: string
  }
  export type Response = UserResponse
}

export namespace Login {
  export type Request = {
    email: string
    password: string
  }
  export type Response = UserResponse
}

export namespace LoginGoogle {
  export type Response = UserResponse
}

export namespace Logout {}

export namespace GetMe {
  export type Response = UserResponse
}

export namespace GetSecret {
  export type Response = string
}
