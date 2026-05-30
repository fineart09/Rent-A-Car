export type SessionUser = {
  user_id?: string | number
  user_name?: string
  name?: string
  email?: string
  roles?: string[] // snake_case roles array (e.g., ['admin'])
  // allow arbitrary additional properties from the session
  [key: string]: any
}
