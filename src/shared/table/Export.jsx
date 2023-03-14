import { CSVLink } from "react-csv";

// jspdf
import jsPDF from "jspdf"

// jspdf-autotable
import autoTable from "jspdf-autotable";

// xlsx
import * as XLSX from 'xlsx';

const Export = ({data, label, disabled, ...props}) => {

    // function to export to pdf
    const exportPDF = () => {
        const doc = new jsPDF('landscape')

        //doc.autoTable({ html: "#react-table"})

        //doc.save(`${label}.pdf`)
        autoTable(doc, {html: '#react-table',tableWidth: 'wrap',horizontalPageBreak: true})
        doc.save(`${label}.pdf`)

    }

    // function to download excel file
    const downloadExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook =  XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet,'Sheet1');
        XLSX.writeFile(workbook, `${label}.xlsx`)
    }
    return (
        <>
            <div className="dropdown me-md-3">
                <div className="btn-group" style={{float: 'right'}}>
                    {/* export data main button */}
                    <button type="button" className="btn btn-dark  dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" disabled={disabled}>
                        <i className="fa fa-file me-2"  data-bs-toggle="tooltip" data-bs-placement="top" title="Export data"></i> Export 
                    </button>
                    {/* end export data main button */}
                    <ul className="dropdown-menu">
                        {/* Export to CSV  */}
                        <li>
                            <CSVLink  className="dropdown-item" data={data} filename={`${label}.csv`}><i className="bi bi-filetype-csv"></i> Export to CSV</CSVLink>
                        </li>
                        {/* End Export to CSV */}
                        {/* Start export to Excel */}
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => downloadExcel(data)}><i className="bi bi-file-earmark-excel"></i> Export to Excel</a>
                        </li>
                        {/* End export to Excel */}
                        {/* Start export to PDF */}
                        <li>
                            <a className="dropdown-item" href="#" onClick={() => exportPDF()}><i className="bi bi-filetype-pdf"></i> Export to PDF</a>
                        </li>
                        {/* End export to PDF */}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Export;