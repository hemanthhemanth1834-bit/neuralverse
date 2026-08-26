export default function Background() {
  return (
    <div className="bg-layers" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-blob b1" />
      <div className="bg-blob b2" />
      <div className="bg-blob b3" />
      <div className="bg-noise" />
    </div>
  )
}
