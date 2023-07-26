import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  json,
} from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"
import { PropsWithChildren, useEffect } from "react"

import stylesheet from "~/tailwind.css"
import NavbarComponent from "./components/Navbar"
import { getUser } from "./utils/session.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet, as: "style" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    as: "font",
  },
]

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return user
}

export const action: ActionFunction = async ({ request }) => {
  return null
}

function Document({
  children,
  title = "Remix: So great, it's funny!",
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export default function App() {
  const authenticatedUser = useLoaderData<typeof loader>()
  return (
    <Document>
      <NavbarComponent
        isAuthenticated={authenticatedUser ? true : false}
        user={authenticatedUser}
      />
      <div className="p-4 max-w-lg mx-auto">
        <Outlet />
      </div>
    </Document>
  )
}
