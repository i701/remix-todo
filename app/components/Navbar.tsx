import React from "react"
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Collapse,
} from "@material-tailwind/react"
import { Form, Link, NavLink, useLoaderData } from "@remix-run/react"
import { User } from "@prisma/client"

export default function NavbarComponent({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean
  user: Partial<User>
}) {
  const [openNav, setOpenNav] = React.useState(false)

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    )
  }, [])

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <NavLink
          to="/todos"
          className={({ isActive }) =>
            isActive ? "text-blue-500 font-bold" : ""
          }
        >
          Todos
        </NavLink>
      </Typography>
    </ul>
  )

  return (
    <>
      <Navbar className="sticky inset-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-500 font-bold"
                : "mr-4 cursor-pointer py-1.5 font-medium"
            }
          >
            Remix Todo
          </NavLink>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            {isAuthenticated ? (
              <Form method="post" action="/logout">
                <Button
                  name="_action"
                  value="logout"
                  type="submit"
                  className="hidden lg:inline-block"
                >
                  Logout
                </Button>
              </Form>
            ) : (
              <Link to="/login">
                <Button
                  variant="gradient"
                  size="sm"
                  className="hidden lg:inline-block"
                >
                  <span>Login</span>
                </Button>
              </Link>
            )}
            <p className="text-sm">{user && user.email}</p>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={true}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          {navList}
          {isAuthenticated ? (
            <Form method="post" action="/logout">
              <Button name="_action" value="logout" type="submit">
                Logout
              </Button>
            </Form>
          ) : (
            <Link to="/login">
              <Button
                variant="gradient"
                size="sm"
                name="_action"
                value="logout"
              >
                <span>Login</span>
              </Button>
            </Link>
          )}
        </Collapse>
      </Navbar>
    </>
  )
}
