// Utility functions for the Pulse application

// Check if user is admin
export function isAdmin(user) {
    return user && user.displayName === "Jah and Co";
}

// Show display name modal
export function showDisplayNameModal(auth, db, onComplete) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'display-name-modal';
    modal.innerHTML = `
        <div class="modal-content card">
            <div class="text-center mb-6">
                <img src="assets/images/sparky-headshot.png" alt="Sparky" class="w-24 h-24 mx-auto mb-4" onerror="this.style.display='none'">
                <h2 class="text-3xl font-bold mb-2">Welcome to Pulse! 🎉</h2>
                <p class="text-gray-300 text-lg">Before you can start exploring, please set your display name.</p>
            </div>
            <form id="set-display-name-form" class="space-y-4">
                <input type="text" id="modal-display-name" placeholder="Enter your display name" class="input-field w-full" required minlength="2" maxlength="30">
                <button type="submit" class="neon-button w-full">
                    <i class="ph ph-check-circle"></i>
                    Set Display Name
                </button>
                <p id="modal-error" class="text-red-400 text-sm text-center h-4"></p>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const form = document.getElementById('set-display-name-form');
    const input = document.getElementById('modal-display-name');
    const errorEl = document.getElementById('modal-error');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const displayName = input.value.trim();
        
        if (!displayName || displayName.length < 2) {
            errorEl.textContent = 'Display name must be at least 2 characters long.';
            return;
        }
        
        try {
            const { updateProfile } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js");
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
            
            const user = auth.currentUser;
            await updateProfile(user, { displayName });
            
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { displayName }, { merge: true });
            
            modal.remove();
            if (onComplete) onComplete();
        } catch (error) {
            console.error("Error setting display name:", error);
            errorEl.textContent = 'Failed to set display name. Please try again.';
        }
    });
    
    // Prevent closing modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            e.stopPropagation();
        }
    });
}

// Check display name and show modal if needed
export function enforceDisplayName(auth, db, onComplete) {
    const user = auth.currentUser;
    if (!user || !user.displayName || user.displayName.trim() === '') {
        showDisplayNameModal(auth, db, onComplete);
        return false;
    }
    return true;
}

// Get admin name HTML with gold styling
export function getAdminNameHTML(authorDisplayName, includeIcon = true) {
    if (authorDisplayName === "Jah and Co") {
        const iconHTML = includeIcon ? `<img src="assets/images/admin-star.png" class="w-5 h-5 ml-2" title="Official Post" onerror="this.style.display='none'">` : '';
        return `<h3 class="font-bold text-xl text-admin-gold">${authorDisplayName}</h3>${iconHTML}`;
    }
    return `<h3 class="font-bold text-xl">${authorDisplayName}</h3>`;
}
