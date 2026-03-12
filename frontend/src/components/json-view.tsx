export function JsonView({ value }: { value: any }) {
  return <pre className="json-view">{JSON.stringify(value, null, 2)}</pre>;
}
