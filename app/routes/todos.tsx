import {
  ActionFunction,
  LoaderFunction,
  V2_MetaFunction,
  redirect,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { Button, Input, Spinner, Typography } from "@material-tailwind/react"
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react"
import { db } from "~/utils/db.server"
import { badRequest } from "~/utils/request.server"
import { useEffect, useRef } from "react"
import TodoItem from "~/components/Todo"
import {
  getUserId,
  requireAuthRole,
  requireUserId,
} from "~/utils/session.server"
import Pagination from "~/components/Pagination"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Todos" },
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
  const userId = (await getUserId(request)) as string
  const form = await request.formData()
  const content = form.get("content") as string
  const _action = form.get("_action") as string
  const todoId = form.get("todoId") as string

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
      if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
          fieldErrors,
          fields,
          formError: null,
        })
      }

      const newTodo = await db.todo.create({
        data: { userId, ...fields },
      })
      return newTodo
    }
    default:
      return null
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  await requireAuthRole(request, "ADMIN")
  const userId = (await getUserId(request)) as string

  const url = new URL(request.url)
  let page = Number(url.searchParams.get("page")) || 1
  if (page < 2) {
    if (!url.searchParams.has("page")) {
      url.searchParams.set("page", "1")
      const newUrl = url.toString()
      return Response.redirect(newUrl, 302)
    }
  }
  const limit = 5
  const offset = (page - 1) * limit

  const todos = await db.todo.findMany({
    where: {
      userId,
    },
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  })

  const totalTodos = await db.todo.count({
    where: {
      userId,
    },
  })

  return json({ todos, userId, totalTodos, page })
}

export default function Index() {
  const { todos, userId, totalTodos, page } = useLoaderData<typeof loader>()
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

  const totalPages = Math.ceil(totalTodos / 5)

  return (
    <div>
      <div className="space-y-1">
        {todos.length > 0 ? (
          todos.map((todo: TodoType) => (
            <TodoItem
              content={todo.content}
              key={todo.id}
              id={todo.id}
              isComplete={todo.isComplete}
            />
          ))
        ) : (
          <Typography variant="paragraph">No todos yet</Typography>
        )}
      </div>
      {userId && (
        <Form
          ref={formRef}
          className="gap-4 my-4 flex items-center"
          method="post"
        >
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
            <p className="text-xs text-red-500" id="name-error" role="alert">
              {actionData.fieldErrors.content}
            </p>
          ) : null}
          <Button
            disabled={isAdding}
            name="_action"
            value="create"
            type="submit"
            className="text-right"
          >
            {isAdding ? <Spinner className="h-4 w-4" /> : "Add"}
          </Button>
        </Form>
      )}

      {/* Pagination  */}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div className="rounded bg-red-100 p-2">
        <h1 className="font-bold text-red-900">{error.status}</h1>
        <p>{error.statusText}</p>
        <p className="text-red-400">{error.data}</p>
      </div>
    )
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    )
  } else {
    return <h1>Unknown Error</h1>
  }
}
