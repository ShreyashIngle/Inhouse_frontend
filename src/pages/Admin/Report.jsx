// Import necessary dependencies
import Box from "@mui/material/Box";
import Header from "../../components/AModule/Header";
import { useState, useEffect } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Checkbox, Input } from "@material-tailwind/react";
import moment from "moment";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import {
  getAllRecordsAchievements,
  getAllRecordsAttended,
  getAllRecordsBook,
  getAllRecordsCertificate,
  getAllRecordsConference,
  getAllRecordsConsultancy,
  getAllRecordsContribution,
  getAllRecordsExtension,
  getAllRecordsFaculty,
  getAllRecordsGrants,
  getAllRecordsIndustrial,
  getAllRecordsMous,
  getAllRecordsPatent,
  getAllRecordsProfessional,
  getAllRecordsResearch,
  getAllRecordsResource,
  getAllRecordsTechnical,
  getAllRecordsWebinar,
} from "../../components/TModule/API_Routes";
import {
  getAllRecordsInternship,
  getAllRecordsResearchStud,
  getAllRecordsConferenceStud,
  getAllRecordsCertificateStud,
  getAllRecordsSport,
  getAllRecordsParticipation,
  getAllRecordsOrganized,
  getAllRecordsTechnicalStud,
  getAllRecordsHigherEdu,
} from "./../../components/SModule/API_Routes";
import { Option, Select } from "@material-tailwind/react";
import html2pdf from "html2pdf.js";
import ExcelJS from "exceljs";

// Define the Report component
const Report = () => {
  let tablename = "";

  const tableMapping = {
    'mous': "number-of_mous",
    "certificate_courses": "cert-courses",
    "professional_affiliation": "prof-aff",
    "resource_person": "facultyresource",
    "extension_activity": "extension-act",
    "technical_competition_fest": "techfest-org",
    "faculty_achievements": "faculty-achievement",
    "industrial_fields_tour": "visit-tours",
    "contribution_to_bos": "contribution-bos",
    "student_internship_details": "internship-details",
    "research_publication": "research-pb",
    "student_research_publication": "research-pb",
    "book_publication": "book-pb",
    "student_conference_publication": "conference-pb",
    "faculty_conference_publication": "faculty-pb",
    "student_certificate_course": "certificate-courses",
    "grants": "grants",
    "student_sports_data": "sports-data",
    "consultancy_report": "cons-rep",
    "student_event_participated": "event-participation",
    "patent_publication": "patent-pb",
    "student_event_organized": "event-org",
    "conference_seminar_workshops": "con-sem",
    "student_technical_events": "tech-events",
    "sttp_fdp_conference_attended": "sf-ws",
    "student_higher_education": "higher-edu",
    "webinar_guest_lectures": "web-guest",
  };

  const tableRoutesMapping = (table) => {
    const tableRoute = {
      "research_publication": getAllRecordsResearch,
      "book_publication": getAllRecordsBook,
      "faculty_conference_publication": getAllRecordsFaculty,
      "grants": getAllRecordsGrants,
      "consultancy_report": getAllRecordsConsultancy,
      "patent_publication": getAllRecordsPatent,
      "conference_seminar_workshops": getAllRecordsConference,
      "sttp_fdp_conference_attended": getAllRecordsAttended,
      "webinar_guest_lectures": getAllRecordsWebinar,
      "mous": getAllRecordsMous,
      "certificate_courses": getAllRecordsCertificate,
      "professional_affiliation": getAllRecordsProfessional,
      "resource_person": getAllRecordsResource,
      "extension_activity": getAllRecordsExtension,
      "technical_competition_fest": getAllRecordsTechnical,
      "faculty_achievements": getAllRecordsAchievements,
      "industrial_fields_tour": getAllRecordsIndustrial,
      "contribution_to_bos": getAllRecordsContribution,
      "student_internship_details": getAllRecordsInternship,
      "student_research_publication": getAllRecordsResearchStud,
      "student_conference_publication": getAllRecordsConferenceStud,
      "student_certificate_course": getAllRecordsCertificateStud,
      "student_sports_data": getAllRecordsSport,
      "student_event_participated": getAllRecordsParticipation,
      "student_event_organized": getAllRecordsOrganized,
      "student_technical_events": getAllRecordsTechnicalStud,
      "student_higher_education": getAllRecordsHigherEdu,
    };
    console.log("Returned table:", tableRoute[table]);
    return tableRoute[table];
  };

  const [tableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableNames, setTableNames] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [formFilters, setFormFilters] = useState({});
  const [apiUrl, setApiUrl] = useState(
    "http://localhost:5000/api/v1/general/allcolumns"
  );
  const [tableRows, setTableRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumns, setSelectedColumns] = useState([]); // New state to track selected columns

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 },
    (_, index) => currentYear - index
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //get all records
  const getAllRecords = async () => {
    try {
      const apiurl = tableRoutesMapping(selectedTable);
      console.log("Table Name: ", selectedTable);
      console.log("apiRoute in getAllRecords:", apiurl);

      const response = await axios.get(apiurl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data.data);
      setTableRows(response.data.data);
    } catch (error) {
      console.error("Error fetching records:", error.message);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      getAllRecords();
    }
  }, [selectedTable]);

  // Function to fetch all tables
  const getAllTables = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/general/alltables"
      );
      const fetchedTableNames = response.data.data;
      setTableNames(fetchedTableNames);
      // console.log("table names are : ", fetchedTableNames);
    } catch (error) {
      console.log("error is : \n", error.message);
    }
  };

  useEffect(() => {
    getAllTables();
  }, []);

  const getAllColumns = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/general/allcolumns?tablename=${tablename}`
      );
      return response.data; // Returning the data for further processing
    } catch (error) {
      console.log("error is: ", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const columnsData = await getAllColumns();
      // console.log("Return value of columns: ", columnsData.data);
      setColumnNames(columnsData.data);
    } catch (error) {
      console.error("Error fetching columns data:", error.message);
    }
  };

  const handleInputChange = (Field, value) => {
    setFormFilters({
      ...formFilters,
      [Field]: value,
    });
  };

  const updateApiUrl = () => {
    var queryParameters = Object.entries(formFilters)
      .filter(([key, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const includesDate = Object.keys(formFilters).some((key) =>
      key.toLowerCase().includes("date")
    );

    // Add dateColumn parameter if any key includes "date" as a substring
    if (includesDate) {
      const dateColumn = columnNames.find((column) =>
        column.Field.toLowerCase().includes("date")
      );

      console.log("Date column is : ", dateColumn);
      if (dateColumn) {
        queryParameters += `&dateColumn=${encodeURIComponent(
          dateColumn.Field
        )}`;
      }
    }
    // console.log(selectedTable);
    const tablePrefix = selectedTable.startsWith("student")
      ? "student"
      : "teacher";

    setApiUrl(
      `http://localhost:5000/api/v1/${tablePrefix}/${tableMapping[selectedTable]}/filter?${queryParameters}`
    );

    console.log("form filter is : ", formFilters);
    console.log("Update api url is : ", apiUrl);
  };

  useEffect(() => {
    updateApiUrl();
  }, [formFilters]);

  //via html2pdf

  const generatePDF = () => {
    const tableContainer = document.getElementById("table-container");

    html2pdf(tableContainer, {
      margin: 10,
      filename: "report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    });
  };

  //Table format
  // const generatePDF = () => {
  //   const doc = new jsPDF('landscape');

  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(16);
  //   doc.text("PUNE INSTITUTE OF COMPUTER TECHNOLOGY", 20, 20);

  //   doc.setFontSize(14);
  //   doc.text(`Report on ${selectedTable}`, 20, 30);

  //   doc.setFontSize(10);

  //   const tableRow = [];
  //   let headersAdded = false;

  //   tableRows.forEach((row) => {
  //     const rowData = columnNames.map((columnName) => row[columnName.Field]);
  //     tableRow.push(rowData);

  //     if (!headersAdded) {
  //       const tableHeader = columnNames.map((header) => {
  //         const headerLines = doc.splitTextToSize(header.Field, 25);
  //         return headerLines.join('\n');
  //       });
  //       tableRow.unshift(tableHeader);
  //       headersAdded = true;
  //     }
  //   });

  //   const columnWidths = tableRow[0].map(() => 25);

  //   // Rotate headers
  //   const rotatedHeaders = columnNames.map((header) => {
  //     const headerLines = doc.splitTextToSize(header.Field, 15);
  //     return headerLines.join('\n');
  //   });

  //   doc.autoTable({
  //     head: [rotatedHeaders],
  //     body: tableRow.slice(1),
  //     startY: 40,
  //     columnStyles: Object.fromEntries(columnWidths.map((width, index) => [index, { cellWidth: width }])),
  //     headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0], fontStyle: 'bold', angle: 90 },
  //     theme: "striped",
  //     styles: { overflow: "linebreak" },
  //     didDrawPage: function (data) {
  //       doc.setFontSize(8);
  //       doc.text("Page " + data.pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 5);
  //     },
  //   });

  //   doc.save("report.pdf");
  // };

  //via keyvalue

  // const generatePDF = () => {
  //   const doc = new jsPDF();

  //   // Set background color to cream
  //   doc.setFillColor(255, 255, 255);
  //   doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");
  //   // Set font and styles
  //   doc.setFont("helvetica", "bold");
  //   doc.setFontSize(16);

  //   // Add a header with the institute name
  //   doc.text("PUNE INSTITUTE OF COMPUTER TECHNOLOGY", 20, 20);

  //   // Add a title for the report
  //   doc.setFontSize(14);
  //   doc.text(`Report on ${selectedTable}`, 20, 30);

  //   // Set font size and style for the report content
  //   doc.setFontSize(12);

  //   // Loop through each row in the table data
  //   tableRows.forEach((row, rowIndex) => {
  //     const keyValues = columnNames.map((column) => ({
  //       key: column.Field,
  //       value: row[column.Field],
  //     }));

  //     if (rowIndex > 0) {
  //       doc.addPage(); // Add a new page for each row after the first row
  //     }

  //     // Loop through key-value pairs and add them to the PDF
  //     keyValues.forEach(({ key, value }, index) => {
  //       const yPosition = 40 + index * 10; // Adjust the vertical spacing as needed

  //       // Add background color to alternate rows
  //       if (index % 2 === 0) {
  //         doc.setFillColor(240, 240, 240); // Light gray background color
  //         doc.rect(10, yPosition - 2, 190, 10, "F"); // Rectangle to fill background
  //       }

  //       // Add key and value to the PDF
  //       doc.text(`${key}: ${value}`, 20, yPosition);
  //     });
  //   });

  //   // Save the PDF with a filename
  //   doc.save("report.pdf");
  // };
  const generateExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    // Add headers
    const headerRow = worksheet.addRow(
      selectedColumns.map((column) => column.Field)
    );

    // Add data rows
    tableRows.forEach((row) => {
      const dataRow = selectedColumns.map((column) => row[column.Field]);
      worksheet.addRow(dataRow);
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const setTable = async (e) => {
    const selectedTableName = e.target.value;
    console.log("Selected Table is: ", selectedTableName);
    tablename = selectedTableName;
    setSelectedTable(selectedTableName);
    fetchData();
  };

  const handleSubmit = () => {
    console.log("form filters are : ", formFilters);
    console.log("API URL is : ", apiUrl);

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data retrieved successfully", data);
        // Update the table rows state with the fetched data
        setTableRows(data.data);
      })
      .catch((error) => console.error("Error retrieving data", error));
  };

  //render columns
  const renderInputFields = () => {
    return columnNames.map((column) => (
      <div key={column.Field}>
        {!column.Field.includes("Upload") && !column.Field.includes("Link") && (
          <>
            <label>{column.Field}</label>
            {renderInputField(column)}
          </>
        )}
      </div>
    ));
  };

  const renderInputField = (column) => {
    const { Field, Type } = column;

    if (Type.includes("varchar") && Field.includes("Year")) {
      const startYear = formFilters["Start_Year"] || currentYear;
      const endYear = formFilters["End_Year"] || currentYear;
      const startYearOptions = years.map((year) => (
        <Option key={year} value={year}>
          {year}
        </Option>
      ));
      const endYearOptions = years
        .filter((year) => year >= startYear)
        .map((year) => (
          <Option key={year} value={year}>
            {year}
          </Option>
        ));

      return (
        <div key={Field} className="flex items-center gap-3 mt-3">
          <div className="w-full md:w-1/2">
            <Select
              size="lg"
              label="Start Year"
              color="light-gray"
              name="Start_Year"
              value={startYear}
              onChange={(value) => {
                handleInputChange("Start_Year", value);
              }}
            >
              {startYearOptions}
            </Select>
          </div>

          <div className="w-full md:w-1/2  ">
            <Select
              size="lg"
              label="End Year"
              color="light-gray"
              name="End_Year"
              value={endYear}
              onChange={(value) => {
                handleInputChange("End_Year", value);
              }}
            >
              {endYearOptions}
            </Select>
          </div>
        </div>
      );
    } else if (
      Type.includes("varchar") &&
      Field.includes("Upload") == false &&
      Field.includes("Link") == false
    ) {
      return (
        <div key={Field} className="mb-4 py-3 bg-white rounded-lg">
          {/* <label className="block mb-2">{Enter ${Field}}</label> */}
          <Input
            type="text"
            label={`Enter ${Field}`}
            value={formFilters[Field] || ""}
            onChange={(e) => handleInputChange(Field, e.target.value)}
            className="w-full  py-2 border rounded-md "
          />
        </div>
      );
    } else if (Type.includes("int")) {
      return (
        <div key={Field} className="mb-4 py-3 bg-white rounded-lg">
          {/* <label className="block mb-2">{Enter ${Field}}</label> */}
          <Input
            type="number"
            value={formFilters[Field] || ""}
            label={`Enter ${Field}`}
            onChange={(e) => handleInputChange(Field, e.target.value)}
            className="w-full py-2 border border-black rounded-md "
          />
        </div>
      );
    } else if (Type === "date") {
      //  setApiUrlapi + dateColumn=${Field}
      return (
        <div key={Field} className="mb-4 py-3 bg-white rounded-lg flex gap-3">
          {/* <label className="block mb-2">{${Field} Start Date}</label> */}
          <Input
            type="date"
            value={formFilters["startDate"] || ""}
            label={`Enter ${Field}`}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="w-full mb-2  py-2 border border-black rounded-md "
          />
          {/* <label className="block mb-2">{${Field} End Date}</label> */}
          <Input
            type="date"
            value={formFilters["endDate"] || ""}
            label={`Enter ${Field}`}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            className="w-full  py-2 border border-black rounded-md "
          />
        </div>
      );
    }

    return null;
  };
  const handleColumnSelection = (selectedColumns) => {
    setSelectedColumns(selectedColumns);
  };

  return (
    <>
      <Box>
        <div className="flex justify-start mx-2 w-32 absolute">
          <Header category="Page" title="Report" />
        </div>
        <div className="flex flex-col justify-center items-center gap-4 m-2 ">
          <label className="block text-gray-700 text-md font-bold  m-2">
            Select Table:
          </label>
          <select
            onChange={(e) => setTable(e)}
            className="border border-gray-300 rounded-md p-2 w-200 focus:outline-none focus:ring focus:border-blue-300 transition-all duration-300 ease-in-out custom-select"
          >
            {tableNames.map((table, index) => (
              <option
                className="py-2 hover:bg-blue-100"
                key={index}
                value={table.Tables_in_inhouse_hod}
              >
                {table.Tables_in_inhouse_hod}
              </option>
            ))}
          </select>

          <label className="block text-gray-700 text-md font-bold  m-2">
            Select Filters:
          </label>

          <div className="flex flex-col justify-end align-items-center m-2 p-4">
            <div className="flex   gap-4 flex-wrap  p-3 w-full">
              {renderInputFields()}
            </div>
            <Button
              variant="contained"
              className="w-25 p-3"
              onClick={handleSubmit}
              endIcon={<FilterAltIcon />}
            >
              Filter
            </Button>
          </div>

          {/* New component for column selection */}
          <ColumnSelection
            columns={columnNames}
            onSelectColumns={handleColumnSelection}
          />

          <TableContainer id="table-container" component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {selectedColumns.map((column) => (
                    <TableCell key={column.Field}>{column.Field}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows &&
                  tableRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {selectedColumns.map((column) => (
                          <TableCell key={column.Field}>
                            {column.Type === "date"
                              ? moment(row[column.Field]).format("DD-MM-YYYY")
                              : row[column.Field]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={tableRows ? tableRows.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          <TableContainer component={Paper}></TableContainer>

          <Button variant="contained" onClick={generatePDF}>
            Generate PDF
          </Button>

          <Button variant="contained" onClick={generateExcel}>
            Generate Excel
          </Button>
        </div>
      </Box>
    </>
  );
};

// New component for column selection
const ColumnSelection = ({ columns, onSelectColumns }) => {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleColumnToggle = (column) => {
    if (column.Field === "selectAll") {
      setSelectAll(!selectAll);
      setSelectedColumns(selectAll ? [] : columns);
    } else {
      const isSelected = selectedColumns.some(
        (selectedColumn) => selectedColumn.Field === column.Field
      );

      if (isSelected) {
        setSelectedColumns((prevSelected) =>
          prevSelected.filter(
            (selectedColumn) => selectedColumn.Field !== column.Field
          )
        );
      } else {
        setSelectedColumns((prevSelected) => [...prevSelected, column]);
      }
    }
  };

  useEffect(() => {
    onSelectColumns(selectedColumns);
  }, [selectedColumns, onSelectColumns]);

  return (
    <div className="m-4">
      <label className="block text-gray-700 text-md font-bold  m-2">
        Select Columns:
      </label>
      <div className="flex gap-4 flex-wrap justify-left">
        <Checkbox
          id="selectAllCheckbox"
          checked={selectAll}
          onChange={() => handleColumnToggle({ Field: "selectAll" })}
          label="Select All"
        />

        {columns?.map((column) => (
          <Checkbox
            key={column.Field}
            id={column.Field}
            checked={selectedColumns.some(
              (selectedColumn) => selectedColumn.Field === column.Field
            )}
            onChange={() => handleColumnToggle(column)}
            label={column.Field}
          />
        ))}
      </div>
    </div>
  );
};

export default Report;
