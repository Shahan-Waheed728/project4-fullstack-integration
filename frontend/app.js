const API_URL = 'http://localhost:3000/users'

// ── Load all users when page opens ──
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers()

    document.getElementById('addUserBtn')
        .addEventListener('click', addUser)
})

// ── GET all users from backend ──
async function fetchUsers() {
    const container = document.getElementById('usersContainer')
    const countEl = document.getElementById('userCount')

    try {
        container.innerHTML = '<p class="loading-text">Loading users...</p>'

        const response = await fetch(API_URL)
        const result = await response.json()

        if (result.success) {
            countEl.textContent = `(${result.count})`

            if (result.data.length === 0) {
                container.innerHTML = '<p class="loading-text">No users found. Add one!</p>'
                return
            }

            container.innerHTML = ''
            result.data.forEach(user => {
                container.innerHTML += `
                    <div class="user-card" id="card-${user._id}">
                        <div class="user-info">
                            <h4>${user.name}</h4>
                            <p>${user.email} — ${user.city}</p>
                        </div>
                        <button 
                            class="delete-btn" 
                            onclick="deleteUser('${user._id}')">
                            Delete
                        </button>
                    </div>
                `
            })
        }
    } catch (error) {
        container.innerHTML = '<p class="error-text">Could not connect to server!</p>'
    }
}

// ── POST new user to backend ──
async function addUser() {
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const city = document.getElementById('city').value.trim()
    const message = document.getElementById('formMessage')

    // Frontend validation
    if (!name || !email || !city) {
        showMessage(message, 'Please fill all fields!', 'error')
        return
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, city })
        })

        const result = await response.json()

        if (result.success) {
            showMessage(message, 'User added successfully!', 'success')
            // Clear inputs
            document.getElementById('name').value = ''
            document.getElementById('email').value = ''
            document.getElementById('city').value = ''
            // Refresh users list
            fetchUsers()
        } else {
            showMessage(message, result.message, 'error')
        }
    } catch (error) {
        showMessage(message, 'Could not connect to server!', 'error')
    }
}

// ── DELETE user from backend ──
async function deleteUser(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })

        const result = await response.json()

        if (result.success) {
            // Remove card from page instantly
            document.getElementById(`card-${id}`).remove()
            // Update count
            fetchUsers()
        }
    } catch (error) {
        alert('Could not delete user!')
    }
}

// ── Helper function to show messages ──
function showMessage(element, text, type) {
    element.textContent = text
    element.className = `form-message ${type}`
    // Hide message after 3 seconds
    setTimeout(() => {
        element.textContent = ''
        element.className = 'form-message'
    }, 3000)
}