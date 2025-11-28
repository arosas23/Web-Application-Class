document.addEventListener('DOMContentLoaded', function () {
    const nationSelect = document.getElementById('nation');
    const nationUSelect = document.getElementById('nationU');
    const teamSelect = document.getElementById('team');
    const teamUSelect = document.getElementById('teamU');

    // Populate nationalities
    fetch('/teams/nationalities')
        .then(res => res.json())
        .then(list => {
            nationSelect.innerHTML = '';
            if (!Array.isArray(list) || list.length === 0) {
                nationSelect.innerHTML = '<option value="">(no nationalities)</option>';
                return;
            }
            list.forEach(n => {
                const opt = document.createElement('option');
                opt.value = n;
                opt.textContent = n;
                nationSelect.appendChild(opt);
                nationUSelect.appendChild(opt.cloneNode(true));
            });
        })
        .catch(err => {
            nationSelect.innerHTML = '<option value="">(failed to load)</option>';
            console.error('Failed to load nationalities', err);
        });

    // Populate teams
    fetch('/teams')
        .then(res => res.json())
        .then(list => {
            teamSelect.innerHTML = '';
            if (!Array.isArray(list) || list.length === 0) {
                teamSelect.innerHTML = '<option value="">(no teams)</option>';
                return;
            }
            list.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                teamSelect.appendChild(opt);
                teamUSelect.appendChild(opt.cloneNode(true));
            });
        })
        .catch(err => {
            teamSelect.innerHTML = '<option value="">(failed to load)</option>';
            console.error('Failed to load teams', err);
        });
});