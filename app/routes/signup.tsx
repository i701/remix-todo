import type { ActionFunction, LoaderArgs } from "@remix-run/node"
import { Form, Link } from "@remix-run/react"
import { authenticator } from "~/utils/auth.server"
import bcrypt from "bcryptjs"
import { db } from "~/utils/db.server"
import { Button, Input, Typography } from "@material-tailwind/react"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const email = form.get("email") as string
  const password = form.get("password") as string

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await db.user.create({
    data: { email: email, passwordHash: hashedPassword },
  })

  return await authenticator.authenticate("form", request, {
    successRedirect: "/todos",
    failureRedirect: "/login",
    context: { formData: form },
  })
}

export default function Signup() {
  return (
    <Form method="post" className="space-y-2">
      <Typography variant="h3">
        Welcome to Remix Todos! Sign up to create todos.
      </Typography>

      <Typography variant="paragraph" className="flex gap-2">
        Already have an account?
        <Link to="/login">Login</Link>
      </Typography>

      <Input required type="email" name="email" label="Email" />
      <Input required type="password" name="password" label="Password" />
      <Button type="submit">Sign up</Button>
    </Form>
  )
}
