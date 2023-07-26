import { useState, Fragment } from "react"
import { Alert } from "@material-tailwind/react"

export default function AlertComponent({ error }: { error: string }) {
  const [open, setOpen] = useState(true)

  return (
    <Fragment>
      <Alert
        color="red"
        open={open}
        onClose={() => setOpen(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        {error}
      </Alert>
    </Fragment>
  )
}
