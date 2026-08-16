/** Simple hash link (no react-router) — suitable for the concept gallery. */
export function Link({ href, className, children, onClick }) {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

export default Link
