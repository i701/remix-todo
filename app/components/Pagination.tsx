import { Button, IconButton } from "@material-tailwind/react"
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Link, useSearchParams } from "@remix-run/react"

type PaginationProps = {
  totalPages: number
  currentPage: number
}

export default function Pagination({
  totalPages,
  currentPage,
}: PaginationProps) {
  const [searchParams] = useSearchParams()
  const activePage = searchParams.get("page")
  const previousPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < totalPages ? currentPage + 1 : null

  return (
    <div className="flex items-center justify-between gap-4 my-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Link key={i} to={`?page=${i + 1}`}>
            <IconButton variant={activePage === `${i + 1}` ? "filled" : "text"}>
              {i + 1}
            </IconButton>
          </Link>
        ))}
      </div>
      {previousPage && (
        <Link to={`?page=${previousPage}`}>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
          </Button>
        </Link>
      )}
      {nextPage && (
        <Link to={`?page=${nextPage}`}>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2"
          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  )
}
