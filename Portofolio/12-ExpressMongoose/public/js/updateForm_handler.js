(function () {
    const numInput = document.getElementById('numU');
    const searchBtn = document.getElementById('searchBtn');
    const updateBtn = document.getElementById('updateBtn');
    const form = document.getElementById('updateDriverForm');
    const offcanvasElement = document.getElementById('UpdateDriver');

    // If canas is closed, reset the form
    offcanvasElement.addEventListener('hidden.bs.offcanvas', function () {
        form.reset(); // Resets the form to its initial state
        setEnabled(false);
        numInput.disabled = false;
        numInput.focus();
        searchBtn.disabled = false;
        updateBtn.disabled = true;
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

    //change event to enable/disable buttons based on input
    function setEnabled(value) {
        if (value) {
            document.getElementById('codeU').disabled = false;
            document.getElementById('nameU').disabled = false;
            document.getElementById('lnameU').disabled = false;
            document.getElementById('dobU').disabled = false;
            document.getElementById('urlU').disabled = false;
            document.getElementById('nationU').disabled = false;
            document.getElementById('teamU').disabled = false;

        } else {
            document.getElementById('codeU').disabled = true;
            document.getElementById('nameU').disabled = true;
            document.getElementById('lnameU').disabled = true;
            document.getElementById('dobU').disabled = true;
            document.getElementById('urlU').disabled = true;
            document.getElementById('nationU').disabled = true;
            document.getElementById('teamU').disabled = true;
        }
    }

    // Prevent the native form submit (we handle submit via the button)
    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    // Search record, find by num and populate form
    searchBtn.addEventListener('click', async function () {
        searchBtn.disabled = false;
        updateBtn.disabled = true;

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
                alert('Driver with number ' + num + ' does not exist.');
                numInput.focus();

                return;
            }

            // Populate form fields
            searchBtn.disabled = true;
            updateBtn.disabled = false;
            document.getElementById('numU').disabled = true;

            setEnabled(true);

            document.getElementById('codeU').value = driver[0].code || '';
            document.getElementById('nameU').value = driver[0].forename || '';
            document.getElementById('lnameU').value = driver[0].surname || '';
            document.getElementById('dobU').value = driver[0].dob ? new Date(driver[0].dob).toISOString().slice(0, 10) : '';
            document.getElementById('urlU').value = driver[0].url || '';
            document.getElementById('nationU').value = driver[0].nationality || '';
            document.getElementById('teamU').value = (driver[0].team && (driver[0].team.name || driver[0].team)) || '';

        } catch (err) {
            console.error(err);
            alert('Failed to lookup driver. See console for details.');
        }
    });

    // Update driver record
    updateBtn.addEventListener('click', async function () {
        const num = document.getElementById('numU').value.trim();

        // Build payload from form
        const payload = {
            code: document.getElementById('codeU').value.trim(),
            forename: document.getElementById('nameU').value.trim(),
            surname: document.getElementById('lnameU').value.trim(),
            dob: document.getElementById('dobU').value || null,
            url: document.getElementById('urlU').value.trim(),
            nationality: document.getElementById('nationU').value,
            team: document.getElementById('teamU').value
        };

        payload.team = {
            name: document.getElementById('teamU').value,
            nationality: document.getElementById('nationU').value,
            url: document.getElementById('urlU').value.trim(),
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

            setTimeout(() => {
                // Close the offcanvas
                const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                    form.reset();
                    searchBtn.disabled = false;
                    updateBtn.disabled = true;
                }
            }, 600);

            // refresh grid and reset form/editing state
            await loadGridData();

            form.reset();
            document.getElementById('numU').disabled = false;

        } catch (err) {
            console.error(err);
            alert('Failed to save driver. See console for details.');
        }
    });

    window.__refreshDriversGrid = loadGridData;
})();