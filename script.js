// Contact class to structure the data
class Contact {
    constructor(name, email, phone, address) {
        this.id = Date.now().toString();  // Unique ID using timestamp
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }
}

// Main AddressBook class to handle all operations
class AddressBook {
    constructor() {
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        this.loadContacts();
        this.setupEventListeners();
    }

    // Add new contact
    addContact(name, email, phone, address) {
        const contact = new Contact(name, email, phone, address);
        this.contacts.push(contact);
        this.saveContacts();
        this.loadContacts();
    }

    // Delete contact
    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        this.saveContacts();
        this.loadContacts();
    }

    // Edit contact
    editContact(id, updatedContact) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            this.contacts[index] = { ...this.contacts[index], ...updatedContact };
            this.saveContacts();
            this.loadContacts();
        }
    }

    // Save contacts to localStorage
    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    // Load and display contacts
    loadContacts() {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        this.contacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>${contact.address}</td>
                <td>
                    <button class="edit-btn" data-id="${contact.id}">Edit</button>
                    <button class="delete-btn" data-id="${contact.id}">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Event delegation for edit and delete buttons
        document.querySelector('table').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                if (confirm('Are you sure you want to delete this contact?')) {
                    this.deleteContact(e.target.dataset.id);
                }
            }
            
            if (e.target.classList.contains('edit-btn')) {
                this.showEditForm(e.target.dataset.id);
            }
        });

        // Add contact form submission
        const addForm = document.getElementById('addContactForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(addForm);
                this.addContact(
                    formData.get('name'),
                    formData.get('email'),
                    formData.get('phone'),
                    formData.get('address')
                );
                addForm.reset();
            });
        }
    }

    // Show edit form modal
    showEditForm(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit Contact</h2>
                <form id="editContactForm">
                    <input type="text" name="name" value="${contact.name}" placeholder="Name" required>
                    <input type="email" name="email" value="${contact.email}" placeholder="Email" required>
                    <input type="tel" name="phone" value="${contact.phone}" placeholder="Phone" required>
                    <input type="text" name="address" value="${contact.address}" placeholder="Address" required>
                    <button type="submit">Save Changes</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const editForm = document.getElementById('editContactForm');
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(editForm);
            this.editContact(id, {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address')
            });
            modal.remove();
        });

        // Handle cancel button
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });
    }
}

// Initialize the address book when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const addressBook = new AddressBook();
}); 