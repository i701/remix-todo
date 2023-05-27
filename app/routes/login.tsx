import { ActionFunction, LoaderFunction, json } from "@remix-run/node"
import { Form, Link, useLoaderData } from "@remix-run/react"
import { authenticator } from "~/utils/auth.server"
import { Button, Input, Typography } from "@material-tailwind/react"
import { getSession } from "~/utils/session.server"
import AlertComponent from "~/components/Alert"

export const action: ActionFunction = async ({ request }) => {
  const bruh = await authenticator.authenticate("form", request, {
    successRedirect: "/todos",
    failureRedirect: "/login",
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/todos",
  })

  let session = await getSession(request.headers.get("cookie"))
  let error = session.get(authenticator.sessionErrorKey)
  return json({ error })
}

export default function Login() {
  const data = useLoaderData<typeof loader>()
  console.log(data)
  return (
    <>
      {data.error?.message ? (
        <AlertComponent error={data?.error?.message} />
      ) : null}
      <Form method="post" className="space-y-2">
        <Typography variant="h3">
          Welcome to Remix Todos! Please login.
        </Typography>

        <Typography variant="paragraph" className="flex gap-2">
          Need to make an account?
          <Link to="/signup">Sign up</Link>
        </Typography>

        <Input required type="email" name="email" label="Email" />
        <Input required type="password" name="password" label="Password" />
        <Button type="submit">Login</Button>
      </Form>
    </>
  )
}
