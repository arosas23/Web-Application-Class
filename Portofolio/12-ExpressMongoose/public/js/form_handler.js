(function () {
    const consultarBtn = document.getElementById('consultarBtn');
    const submitBtn = document.getElementById('submitBtn');
    const actualizarBtn = document.getElementById('actualizarBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');
    const form = document.querySelector('form[action="/drivers"]');

    // Helper to fetch all drivers
    async function fetchAllDrivers() {
        const res = await fetch('/drivers');
        if (!res.ok) throw new Error('Failed to fetch drivers');
        return res.json();
    }

    // Helper to (re)load grid data
    async function loadGridData() {
        try {
            const data = await fetchAllDrivers();
            if (gridApi && typeof gridApi.setGridOption === 'function') {
                gridApi.setGridOption("rowData", data);
            } else if (gridApi && gridApi.api && typeof gridApi.api.setRowData === 'function') {
                gridApi.api.setRowData(data);
            }
        } catch (err) {
            console.error('Failed to refresh grid', err);
        }
    }

    // Cancelar button: reset form and state
    cancelarBtn.addEventListener('click', function () {
        form.reset();
        submitBtn.disabled = false;
        consultarBtn.disabled = false;
        actualizarBtn.hidden = true;
        cancelarBtn.hidden = true;
        document.getElementById('num').disabled = false;
    });

    // Editar button: find by num and populate form
    consultarBtn.addEventListener('click', async function () {
        submitBtn.disabled = true;
        consultarBtn.disabled = true;
        actualizarBtn.hidden = false;
        cancelarBtn.hidden = false;
        const numInput = document.getElementById('num');
        const num = numInput.value.trim();
        if (!num) {
            alert('Please enter a driver number to search.');
            numInput.focus();
            return;
        }

        try {
            const driver = await fetch('/drivers/' + encodeURIComponent(num))
                .then(res => {
                    return res.json();
                });

            if (!driver || driver.length === 0) {
                form.reset();
                submitBtn.disabled = false;
                consultarBtn.disabled = false;
                actualizarBtn.hidden = true;
                cancelarBtn.hidden = true;

                alert('Driver with number ' + num + ' does not exist.');
                return;
            }

            // Populate form fields
            document.getElementById('num').disabled = true;
            document.getElementById('code').value = driver[0].code || '';
            document.getElementById('name').value = driver[0].forename || '';
            document.getElementById('lname').value = driver[0].surname || '';
            document.getElementById('dob').value = driver[0].dob ? new Date(driver[0].dob).toISOString().slice(0, 10) : '';
            document.getElementById('url').value = driver[0].url || '';
            document.getElementById('nation').value = driver[0].nationality || '';
            document.getElementById('team').value = (driver[0].team && (driver[0].team.name || driver[0].team)) || '';

        } catch (err) {
            console.error(err);
            alert('Failed to lookup driver. See console for details.');
        }
    });

    // Prevent the native form submit (we handle submit via the button)
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    // Handle create when Enviar is pressed
    submitBtn.addEventListener('click', async function () {
        const num = document.getElementById('num').value.trim();

        if (!num) {
            alert('Number is required.');
            document.getElementById('num').focus();
            return;
        }

        // Build payload from form
        const payload = {
            num: num,
            code: document.getElementById('code').value.trim(),
            forename: document.getElementById('name').value.trim(),
            surname: document.getElementById('lname').value.trim(),
            dob: document.getElementById('dob').value || null,
            url: document.getElementById('url').value.trim(),
            nationality: document.getElementById('nation').value,
            team: document.getElementById('team').value
        };

        try {
            const conflict = await fetch('/drivers/' + encodeURIComponent(num))
                .then(res => {
                    return res.json();
                });

            if (conflict.length > 0) {
                alert('A driver with that number already exists.');
                form.reset();
                return;
            } else {
                const res = await fetch('/drivers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error('Create failed: ' + txt);
                }
                alert('Driver created successfully.');
            }


            // refresh grid and reset form/editing state
            await loadGridData();
            form.reset();
        } catch (err) {
            console.error(err);
            alert('Failed to save driver. See console for details.');
        }
    });

    // Handle create when Enviar is pressed
    actualizarBtn.addEventListener('click', async function () {
        const num = document.getElementById('num').value.trim();

        // Build payload from form
        const payload = {
            code: document.getElementById('code').value.trim(),
            forename: document.getElementById('name').value.trim(),
            surname: document.getElementById('lname').value.trim(),
            dob: document.getElementById('dob').value || null,
            url: document.getElementById('url').value.trim(),
            nationality: document.getElementById('nation').value,
            team: document.getElementById('team').value
        };

        payload.team = {
            name: document.getElementById('team').value,
            nationality: document.getElementById('nation').value,
            url: document.getElementById('url').value.trim(),
        };

        try {
            // UPDATE existing driver (PUT)
            const res = await fetch('/drivers/' + encodeURIComponent(num), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error('Update failed: ' + txt);
            }
            alert('Driver updated successfully.');

            // refresh grid and reset form/editing state
            await loadGridData();
            form.reset();
            submitBtn.disabled = false;
            consultarBtn.disabled = false;
            actualizarBtn.hidden = true;
            cancelarBtn.hidden = true;
            document.getElementById('num').disabled = false;

        } catch (err) {
            console.error(err);
            alert('Failed to save driver. See console for details.');
        }
    });

    window.__refreshDriversGrid = loadGridData;
})();