(function () {
    const numInput = document.getElementById('num');
    const submitBtn = document.getElementById('submitBtn');
    const form = document.querySelector('form[action="/drivers"]');
    const offcanvasElement = document.getElementById('NewDriver');

    // If canas is closed, reset the form
    offcanvasElement.addEventListener('hidden.bs.offcanvas', function () {
        form.reset(); // Resets the form to its initial state
    });

    // When the offcanvas is shown, focus on the num input
    offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
      numInput.focus();
    });

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

    // Prevent the native form submit (we handle submit via the button)
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    // Handle create when Enviar is pressed
    submitBtn.addEventListener('click', async function () {
        const num = document.getElementById('num').value.trim();

        if (!num) {
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
                numInput.focus();
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

                setTimeout(() => {
                    // Close the offcanvas
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                        form.reset();
                    }
                }, 600);
            }


            // refresh grid and reset form/editing state
            await loadGridData();
            form.reset();
        } catch (err) {
            console.error(err);
            alert('Failed to save driver. See console for details.');
        }
    });
    window.__refreshDriversGrid = loadGridData;
})();