import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node"
import { redirect, json } from "@remix-run/node"
import { Button, Input, Typography } from "@material-tailwind/react"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { db } from "~/utils/db.server"
import { badRequest } from "~/utils/request.server"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix Todo App" },
    { name: "description", content: "Welcome to Remix Todos!" },
  ]
}

type TodoType = {
  id: string
  content: string
  isComplete: boolean
}

function validateTodo(content: string) {
  if (content.length < 10) {
    return "That Todo is too short"
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const content = form.get("content")
  if (typeof content !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    })
  }
  const fieldErrors = {
    content: validateTodo(content),
  }
  const fields = { content }
  console.log(fields)
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    })
  }

  const todo = await db.todo.create({
    data: fields,
  })
  return redirect("/todos")
}

export const loader: LoaderFunction = async () => {
  const todos = await db.todo.findMany()
  return json(todos)
}

export default function Index() {
  const todos = useLoaderData<TodoType[] | []>()
  const actionData = useActionData<typeof action>()
  return (
    <div>
      <Typography variant="h3" color="blue-gray" className="py-4">
        Todos y'all!
      </Typography>
      <div>
        {todos.map((todo) => (
          <p key={todo.id}>{todo.content}</p>
        ))}
      </div>
      <Form className="space-y-2 py-4" method="POST">
        <Input
          required
          label="Todo"
          name="content"
          error={actionData?.fieldErrors?.content}
          defaultValue={actionData?.fields?.content}
          aria-invalid={Boolean(actionData?.fieldErrors?.content)}
          aria-errormessage={
            actionData?.fieldErrors?.content ? "name-error" : undefined
          }
        />
        {actionData?.fieldErrors?.content ? (
          <p className="text-sm text-red-500" id="name-error" role="alert">
            {actionData.fieldErrors.content}
          </p>
        ) : null}
        <Button type="submit" className="">
          Button
        </Button>
      </Form>
    </div>
  )
}
