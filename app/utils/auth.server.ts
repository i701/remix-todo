import { Authenticator, AuthorizationError } from "remix-auth"
import { sessionStorage } from "./session.server"
import { FormStrategy } from "remix-auth-form"
import bcrypt from "bcryptjs"
import { User } from "@prisma/client"
import { db } from "./db.server"

const authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
})

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string
  const password = form.get("password") as string

  const user = await db.user.findFirst({
    where: {
      email: email,
    },
  })

  if (!user) {
    console.error("Email does not exist")
    throw new AuthorizationError("Email combination not found")
  }

  const passwordsMatch = bcrypt.compare(password, user.passwordHash)
  if (!passwordsMatch) {
    throw new AuthorizationError("Passwords do not match")
  }

  return user
})

authenticator.use(formStrategy, "form")

export { authenticator }

export async function getUserId(request: Request) {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    return null
  }
  return user?.id
}
