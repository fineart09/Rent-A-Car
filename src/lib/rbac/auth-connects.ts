// Simple role helpers used by components and server code
export function userHasRole(userRoles: string[] | undefined, role: string) {
  if (!userRoles || userRoles.length === 0) return false
  return userRoles.includes(role)
}

export function userHasAnyRole(userRoles: string[] | undefined, allowed: string[]) {
  if (!userRoles || userRoles.length === 0) return false
  return allowed.some((r) => userRoles.includes(r))
}
