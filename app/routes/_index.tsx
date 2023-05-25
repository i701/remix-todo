import type {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { Button, Input, Spinner, Typography } from "@material-tailwind/react"
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { db } from "~/utils/db.server"
import { badRequest } from "~/utils/request.server"
import { useEffect, useRef } from "react"
import TodoItem from "~/components/Todo"

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
  const content = form.get("content") as string
  const _action = form.get("_action") as string
  const todoId = form.get("todoId") as string
  console.log({ todoId, _action })

  switch (_action) {
    case "delete": {
      const todoToDelete = await db.todo.delete({
        where: {
          id: todoId,
        },
      })
      return todoToDelete
    }
    case "complete": {
      const isCompleted = !!form.get("isCompleted")
      console.log({ isCompleted })

      const updateTodo = await db.todo.update({
        where: {
          id: todoId,
        },
        data: {
          isComplete: isCompleted,
        },
      })
      return updateTodo
    }
    case "create": {
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

      const newTodo = await db.todo.create({
        data: fields,
      })
      return newTodo
    }
    default:
      return null
  }
}

export const loader: LoaderFunction = async () => {
  const todos = await db.todo.findMany()
  return json(todos)
}

export default function Index() {
  const todos = useLoaderData<TodoType[] | []>()
  const actionData = useActionData<typeof action>()
  const formRef = useRef<HTMLFormElement>(null)
  const todoInputRef = useRef<HTMLInputElement>(null)
  const navigation = useNavigation()
  const isAdding =
    navigation.state === "submitting" &&
    navigation.formData.get("_action") === "create"

  useEffect(() => {
    formRef?.current?.reset()
  }, [isAdding])

  return (
    <div>
      <Typography variant="h3" color="blue-gray" className="py-4">
        Todos y'all!
      </Typography>
      <div className="space-y-1">
        {todos.length > 0
          ? todos.map((todo) => (
              <TodoItem
                content={todo.content}
                key={todo.id}
                id={todo.id}
                isComplete={todo.isComplete}
              />
            ))
          : "No todos yet"}
      </div>
      <Form ref={formRef} className="space-y-2 py-4" method="post">
        <Input
          ref={todoInputRef}
          required
          label="Todo"
          name="content"
          error={Boolean(actionData?.fieldErrors?.content)}
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
        <Button name="_action" value="create" type="submit">
          {isAdding ? <Spinner className="h-4 w-4" /> : "Add"}
        </Button>
      </Form>
    </div>
  )
}
