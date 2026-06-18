// DOM Manipulation for Dashboard Interactivity
// This script handles the dynamic updates of the dashboard based on user interactions and data changes.

const form = document.getElementById('issue-form');
const tableBody = document.getElementById('table-body');
const filterType = document.getElementById('filter-type');
const filterStatus = document.getElementById('filter-status');
const openCountEl = document.getElementById('open-count');
const resolvedCountEl = document.getElementById('resolved-count');

let issues = [];
let issueIdCounter = 1;

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const deliveryId = document.getElementById('del-id').value.trim();
    const customerName = document.getElementById('customer-name').value.trim();
    const issueType = document.getElementById('issue-type').value;
    const priorityElement = document.querySelector('input[name="priority"]:checked');
    const priority = priorityElement ? priorityElement.value : 'Low';

    // Validation for Delivery ID and Customer Name
    if (!deliveryId) {
        alert('Please enter Delivery ID.');
        return;
    } 

    if (!/^\d+$/.test(deliveryId)) {
        alert('Delivery ID must contain only digits.');
        return;
    }

    if (!customerName) {
        alert('Please enter Customer Name.');
        return;
    } 

    if (!/^[A-Za-z\s.'-]{2,}$/.test(customerName)) {
        alert('Please enter a valid Customer Name.');
        return;
    }
 
    if (issues.some(i => i.deliveryId === deliveryId)) {
        alert('An issue with this Delivery ID already exists.');
        return;
    }

    const newIssue = {
        id: issueIdCounter++,
        deliveryId,
        customerName,
        issueType,
        priority,
        notes: document.getElementById('notes').value.trim(),
        status: 'Open'
    };

    issues.push(newIssue);
    renderRow(newIssue);
    updateMetrics();
    applyFilters();
    form.reset();
});

function renderRow(issue) {
    const tr = document.createElement('tr');
    tr.classList.add('issue-row');
    tr.dataset.id = issue.id;

    if (issue.priority === 'High') {
        tr.classList.add('priority-High');
    }

    tr.innerHTML = `
        <td>${issue.deliveryId}</td>
        <td>${issue.customerName}</td>
        <td>${issue.issueType}</td>
        <td>${issue.priority}</td>
        <td class="status-cell">
            <span class="status-badge badge-open">Open</span>
        </td>
        <td class="action-buttons">
            <button type="button" class="btn btn-resolve resolve-btn">Resolve</button>
            <button type="button" class="btn btn-delete delete-btn">Delete</button>
        </td>
    `;

    tableBody.appendChild(tr);
}

tableBody.addEventListener('click', function(event) {
    const target = event.target;
    const row = target.closest('tr');
    if (!row) return;

    const issueId = parseInt(row.dataset.id, 10);
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    if (target.classList.contains('resolve-btn')) {
        issue.status = 'Resolved';
        row.classList.add('status-Resolved');

        const statusCell = row.querySelector('.status-cell');
        statusCell.innerHTML = `<span class="status-badge badge-resolved">Resolved</span>`;

        target.disabled = true;
        target.classList.add('disabled');

        const resolveBtn = row.querySelector('.resolve-btn');
        if (resolveBtn) {
            resolveBtn.disabled = true;
        }

        updateMetrics();
        applyFilters();
    }

    if (target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this issue record?')) {
            issues = issues.filter(i => i.id !== issueId);
            row.remove();
            updateMetrics();
        }
    }
});

function applyFilters() {
    const typeFilterValue = filterType.value;
    const statusFilterValue = filterStatus.value;

    document.querySelectorAll('.issue-row').forEach(row => {
        const issueId = parseInt(row.dataset.id, 10);
        const issue = issues.find(i => i.id === issueId);
        if (!issue) {
            row.style.display = 'none';
            return;
        }

        const matchesType = typeFilterValue === 'All' || issue.issueType === typeFilterValue;
        const matchesStatus = statusFilterValue === 'All' || issue.status === statusFilterValue;

        row.style.display = matchesType && matchesStatus ? '' : 'none';
    });
}

filterType.addEventListener('change', applyFilters);
filterStatus.addEventListener('change', applyFilters);

function updateMetrics() {
    const openCount = issues.filter(i => i.status === 'Open').length;
    const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

    openCountEl.textContent = openCount;
    resolvedCountEl.textContent = resolvedCount;
}
