const dateformatter = (params) => {
    if (!params.value) return "";

    const d = new Date(params.value);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");

    return `${day}/${month}/${year}`;
};

const columnDefs = [
    { field: "_id", hide: true },
    { field: "num", filter: true, filterParams: { buttons: ['reset'] }, width: 60 },
    { field: "code", width: 50 },
    { field: "forename", width: 150 },
    { field: "surname", width: 150 },
    { field: "dob", width: 100, valueFormatter: dateformatter },
    { field: "nationality", headerName: "Nation", width: 80 },
    { field: "team.name", width: 150 },
    {
        field: "url", width: 400, cellRenderer: function (params) {
            return `<a href="${params.value}" target="_blank">${params.value}</a>`;
        }
    },
];

const myTheme = agGrid.themeBalham.withParams({
    headerTextColor: 'black',
    headerBackgroundColor: 'orange',
    headerColumnBorderHeight: '0%',
});

const gridOptions = {
    columnDefs: columnDefs,
    theme: myTheme,
    pagination: true,
}

let gridApi;

document.addEventListener("DOMContentLoaded", function () {
    const gridDiv = document.querySelector("#myGrid");
    gridApi = agGrid.createGrid(gridDiv, gridOptions);

    fetch('/drivers')
        .then(response => response.json())
        .then((data) => { gridApi.setGridOption("rowData", data); })
});