import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node"
import { Typography } from "@material-tailwind/react"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix Todo App" },
    { name: "description", content: "Welcome to Remix Todos!" },
  ]
}

export default function Index() {
  return (
    <>
      <Typography variant="h2" color="blue-gray" className="py-4">
        Welcome to Remix Todos!
      </Typography>
    </>
  )
}
