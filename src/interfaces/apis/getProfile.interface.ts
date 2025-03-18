export interface GetProfile {
  id: string
  username: string
  roles: string[]
  email: string
  twoFactor: boolean
  iat: number
  exp: string
}
