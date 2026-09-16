import './StepCard.css'

function StepCard({ number, title, description }) {
    return (
        <div className="step-card">
            <span className="step-card__badge">{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    )
}

export default StepCard