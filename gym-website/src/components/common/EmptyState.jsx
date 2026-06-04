export default function EmptyState({ title, description }) {
    return (
        <div className ="empty-state">
            <div className ="empty-state__icon">
                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h3 className ="empty-state__title">{title}</h3>
            <p className ="empty-state__description">{description}</p>
        </div>
    )
}