import { Button } from "./button";

export function Pagination({
  page,
  hasNext,
  hasPrev,
  onPrev,
  onNext,
}: {
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="pagination">
      <Button disabled={!hasPrev} onClick={onPrev}>
        Prev
      </Button>
      <span className="pagination-label">Page {page}</span>
      <Button disabled={!hasNext} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
