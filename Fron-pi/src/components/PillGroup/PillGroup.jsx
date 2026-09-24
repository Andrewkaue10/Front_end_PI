import './PillGroup.css'

function PillGroup({ options, value, onChange, multiple = false, counts }) {
  const isSelected = (opt) => (multiple ? value.includes(opt) : value === opt)

  const handleClick = (opt) => {
    if (multiple) {
      onChange(isSelected(opt) ? value.filter((v) => v !== opt) : [...value, opt])
    } else {
      onChange(opt)
    }
  }

  return (
    <div className="pill-group">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          className={`pill ${isSelected(opt) ? 'pill--active' : ''}`}
          onClick={() => handleClick(opt)}
        >
          {opt}
          {counts && counts[opt] !== undefined && (
            <span className="pill__count">({counts[opt]})</span>
          )}
        </button>
      ))}
    </div>
  )
}

export default PillGroup