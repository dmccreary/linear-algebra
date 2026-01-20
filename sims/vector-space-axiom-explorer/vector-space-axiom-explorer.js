// Vector Space Axiom Explorer
// Tracks which axioms have been viewed and handles card interactions

const viewedAxioms = new Set();

document.querySelectorAll('.axiom-card').forEach(card => {
    card.addEventListener('click', () => {
        // Toggle expanded state
        const wasExpanded = card.classList.contains('expanded');

        // Close all other cards
        document.querySelectorAll('.axiom-card').forEach(c => {
            c.classList.remove('expanded');
        });

        // Toggle this card
        if (!wasExpanded) {
            card.classList.add('expanded');
            card.classList.add('viewed');

            // Track viewed
            const axiom = card.dataset.axiom;
            viewedAxioms.add(axiom);
            updateProgress();
        }
    });
});

function updateProgress() {
    const progress = document.getElementById('progress');
    progress.textContent = `${viewedAxioms.size} / 10 axioms viewed`;

    if (viewedAxioms.size === 10) {
        progress.style.background = '#27ae60';
        progress.textContent = '\u2713 All 10 axioms viewed!';
    }
}
