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
                const titleCell = row.insertCell(0);
                titleCell.textContent = target.title;
                titleCell.style.backgroundColor = target.buttonColor;
                titleCell.style.color = target.textColor;

                row.insertCell(1).textContent = target.template;

                const actionsCell = row.insertCell(2);
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'flex-row';

                const editLink = document.createElement('a');
                editLink.textContent = 'Edit';
                editLink.href = '#';
                editLink.className = 'action-link edit-link';
                editLink.addEventListener('click', () => editTarget(target));
                actionsContainer.appendChild(editLink);

                const deleteLink = document.createElement('a');
                deleteLink.textContent = 'Delete';
                deleteLink.href = '#';
                deleteLink.className = 'action-link delete-link';
                deleteLink.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this target?')) {
                        deleteTarget(target.id);
                    }
                });
                actionsContainer.appendChild(deleteLink);

                actionsCell.appendChild(actionsContainer);
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

    const openWithForm = document.getElementById('openWithForm');
    const openWithTable = document.getElementById('openWithTable').getElementsByTagName('tbody')[0];
    let editingOpenWithId = null;

    openWithForm.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log('Open With Form submitted');
        const title = openWithForm.title.value;
        const urlTemplate = openWithForm.urlTemplate.value;

        const newOpenWithTarget = {
            id: editingOpenWithId || generateId(),
            title,
            urlTemplate
        };

        console.log('New Open With target:', newOpenWithTarget);
        saveOpenWithTarget(newOpenWithTarget, updateOpenWithTable);
        openWithForm.reset();
        editingOpenWithId = null;
    });

    function saveOpenWithTarget(target, callback) {
        chrome.storage.local.get({ openWithTargets: [] }, (result) => {
            let openWithTargets = result.openWithTargets;
            const targetIndex = openWithTargets.findIndex(t => t.id === target.id);
            if (targetIndex > -1) {
                openWithTargets[targetIndex] = target; // Override existing target
            } else {
                openWithTargets.push(target); // Add new target
            }
            chrome.storage.local.set({ openWithTargets }, () => {
                console.log('Open With target saved');
                if (callback) callback();
            });
        });
    }

    function updateOpenWithTable() {
        console.log('Updating Open With table');
        openWithTable.innerHTML = '';
        chrome.storage.local.get({ openWithTargets: [] }, (result) => {
            const openWithTargets = result.openWithTargets;
            console.log('Loaded Open With targets:', openWithTargets);
            openWithTargets.forEach(target => {
                const row = openWithTable.insertRow();
                row.insertCell(0).textContent = target.title;
                row.insertCell(1).textContent = target.urlTemplate;

                const actionsCell = row.insertCell(2);
                const actionsContainer = document.createElement('div');
                actionsContainer.className = 'flex-row';

                const editLink = document.createElement('a');
                editLink.textContent = 'Edit';
                editLink.href = '#';
                editLink.className = 'action-link edit-link';
                editLink.addEventListener('click', () => editOpenWithTarget(target));
                actionsContainer.appendChild(editLink);

                const deleteLink = document.createElement('a');
                deleteLink.textContent = 'Delete';
                deleteLink.href = '#';
                deleteLink.className = 'action-link delete-link';
                deleteLink.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this target?')) {
                        deleteOpenWithTarget(target.id);
                    }
                });
                actionsContainer.appendChild(deleteLink);

                actionsCell.appendChild(actionsContainer);
            });
        });
    }

    function editOpenWithTarget(target) {
        openWithForm.title.value = target.title;
        openWithForm.urlTemplate.value = target.urlTemplate;
        editingOpenWithId = target.id;
    }

    function deleteOpenWithTarget(id) {
        chrome.storage.local.get({ openWithTargets: [] }, (result) => {
            const openWithTargets = result.openWithTargets.filter(t => t.id !== id);
            chrome.storage.local.set({ openWithTargets }, () => {
                console.log('Open With target deleted');
                updateOpenWithTable();
            });
        });
    }

    updateOpenWithTable();
});
