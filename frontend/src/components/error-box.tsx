export function ErrorBox({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="banner banner-danger" role="alert">
      <div className="banner-text">{message}</div>
    </div>
  );
}
