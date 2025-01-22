document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('targetForm');
    const targetsTable = document.getElementById('targetsTable').getElementsByTagName('tbody')[0];
    let editingTargetId = null;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Form submitted');
        const title = form.title.value;
        const template = form.template.value;
        const buttonColor = form.buttonColor.value;
        const textColor = form.textColor.value;

        const newTarget = {
            id: editingTargetId || generateId(),
            title,
            template,
            buttonColor,
            textColor
        };

        console.log('New target:', newTarget);
        saveTarget(newTarget, updateTable);
        form.reset();
        editingTargetId = null;
    });

    function generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function saveTarget(target, callback) {
        chrome.storage.local.get({ customTargets: [] }, (result) => {
            let customTargets = result.customTargets;
            const targetIndex = customTargets.findIndex(t => t.id === target.id);
            if (targetIndex > -1) {
                customTargets[targetIndex] = target; // Override existing target
            } else {
                customTargets.push(target); // Add new target
            }
            chrome.storage.local.set({ customTargets }, () => {
                console.log('Target saved');
                if (callback) callback();
            });
        });
    }

    function updateTable() {
        console.log('Updating table');
        targetsTable.innerHTML = '';
        chrome.storage.local.get({ customTargets: [] }, (result) => {
            const customTargets = result.customTargets;
            console.log('Loaded custom targets:', customTargets);
            customTargets.forEach(target => {
                const row = targetsTable.insertRow();
                row.insertCell(0).textContent = target.title;
                row.insertCell(1).textContent = target.template;
                row.insertCell(2).textContent = target.buttonColor;
                row.insertCell(3).textContent = target.textColor;
                const actionsCell = row.insertCell(4);
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => editTarget(target));
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this target?')) {
                        deleteTarget(target.id);
                    }
                });
                actionsCell.appendChild(deleteButton);
            });
        });
    }

    function editTarget(target) {
        form.title.value = target.title;
        form.template.value = target.template;
        form.buttonColor.value = target.buttonColor;
        form.textColor.value = target.textColor;
        editingTargetId = target.id;
    }

    function deleteTarget(id) {
        chrome.storage.local.get({ customTargets: [] }, (result) => {
            const customTargets = result.customTargets.filter(t => t.id !== id);
            chrome.storage.local.set({ customTargets }, () => {
                console.log('Target deleted');
                updateTable();
            });
        });
    }

    updateTable();
});
