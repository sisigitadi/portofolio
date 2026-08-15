/** Link hash-sederhana (tanpa react-router) — cocok untuk galeri konsep. */
export function Link({ href, className, children, onClick }) {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  )
}

export default Link
