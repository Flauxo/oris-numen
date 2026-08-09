import os

css = """
/* Universe Feature Styles */
.universe-message-link:hover {
    color: var(--color-text-primary) !important;
    opacity: 1 !important;
}

#universe-modal-overlay .modal-card {
    max-width: 90%;
    width: 320px;
}

#btn-accept-universe {
    background-color: var(--color-text-primary);
    color: var(--color-bg-main);
    border: none;
    border-radius: var(--radius-pill);
    padding: 12px 24px;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    width: 100%;
    transition: transform 0.2s, opacity 0.2s;
}

#btn-accept-universe:active {
    transform: scale(0.98);
}

#universe-received-container::-webkit-scrollbar {
    width: 6px;
}
#universe-received-container::-webkit-scrollbar-track {
    background: transparent;
}
#universe-received-container::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.1);
    border-radius: 4px;
}
"""

with open('css/style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print("CSS appended.")
