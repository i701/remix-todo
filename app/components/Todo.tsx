import { Button, Checkbox, Spinner } from "@material-tailwind/react"
import type { Todo } from "@prisma/client"
import { Form, useNavigation, useSubmit } from "@remix-run/react"
import type { ChangeEventHandler } from "react"

type TodoType = Partial<Todo>

export default function TodoItem({ content, id, isComplete }: TodoType) {
  const navigation = useNavigation()
  const isDeletingTodo =
    navigation.state === "submitting" &&
    navigation.formData.get("_action") === "delete" &&
    navigation.formData.get("todoId") === id

  const submit = useSubmit()

  const handleChange: ChangeEventHandler<HTMLFormElement> = (event) => {
    submit(event.currentTarget)
  }
  return (
    <div className="flex justify-between items-center border w-full rounded py-1 px-2">
      <div className="flex gap-1 items-center">
        <Form method="post" onChange={handleChange} className="leading-[0]">
          <Checkbox
            type="checkbox"
            name="isCompleted"
            id="isCompleted"
            checked={isComplete}
            readOnly
            className="w-5 h-5 cursor-pointer"
          />
          <input type="hidden" name="todoId" value={id} />
          <input type="hidden" name="_action" value="complete" />
        </Form>
        <p className={`${isComplete ? "line-through" : null}`}>{content}</p>
      </div>
      <Form method="post">
        <Button
          size="sm"
          color="red"
          type="submit"
          name="_action"
          value="delete"
          variant="gradient"
        >
          {isDeletingTodo ? (
            <Spinner color="red" className="h-4 w-4" />
          ) : (
            "Delete"
          )}
        </Button>
        <input type="hidden" name="todoId" value={id} />
      </Form>
    </div>
  )
}
