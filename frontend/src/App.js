import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { pdfjs } from "react-pdf";
import PdfComp from "./PdfComp";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);
  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    console.log(result.data.data);
    setAllImage(result.data.data);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);
    const result = await axios.post(
      "http://localhost:5000/upload-files",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(result);
    if (result.data.status == "ok") {
      alert("Uploaded Successfully!!!");
      getPdf();
    }
  };
  const showPdf = (pdf) => {
    // window.open(`http://localhost:5000/files/${pdf}`, "_blank", "noreferrer");
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };
  return (
    <div className="App">
      <form className="formStyle" onSubmit={submitImage}>
        <h4>Upload Pdf in React</h4>
        <br />
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="file"
          class="form-control"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button class="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
      <div className="uploaded">
        <h4>Uploaded PDF:</h4>
        <div className="output-div">
          {allImage == null
            ? ""
            : allImage.map((data) => {
                return (
                  <div className="inner-div">
                    <h6>Title: {data.title}</h6>
                    <button
                      className="btn btn-primary"
                      onClick={() => showPdf(data.pdf)}
                    >
                      Show Pdf
                    </button>
                  </div>
                );
              })}
        </div>
      </div>
      <PdfComp pdfFile={pdfFile} />
    </div>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const App = () => {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [uploadMessage, setUploadMessage] = useState("");
//   const [pdfs, setPdfs] = useState([]);

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setFileName(selectedFile.name);
//     }
//   };

//   const handleFileUpload = () => {
//     const formData = new FormData();
//     formData.append("pdf", file);

//     axios
//       .post("http://localhost:5000/upload-files", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((response) => {
//         setUploadMessage(response.data.message);
//         setFile(null);
//         setFileName("");
//         // Refresh the list of PDFs after upload
//         fetchPdfs();
//       })
//       .catch((error) => {
//         setUploadMessage("Error uploading PDF");
//         console.error(error);
//       });
//   };

//   const fetchPdfs = () => {
//     axios
//       .get("http://localhost:5000/get-files") // Replace with the appropriate API endpoint
//       .then((response) => {
//         setPdfs(response.data || []);
//       })
//       .catch((error) => {
//         console.error("Error fetching PDFs:", error);
//       });
//   };

//   useEffect(() => {
//     fetchPdfs();
//   }, []); // Fetch PDFs when the component mounts

//   return (
//     <div>
//       <h2>Upload PDF</h2>
//       <input type="file" accept=".pdf" onChange={handleFileChange} />
//       <br />
//       <input
//         type="text"
//         placeholder="File Name"
//         value={fileName}
//         onChange={(e) => setFileName(e.target.value)}
//       />
//       <br />
//       <button onClick={handleFileUpload}>Upload PDF</button>
//       <p>{uploadMessage}</p>

//       <h2>Uploaded PDFs</h2>
//       <ul>
//         {pdfs.map((pdf) => (
//           <li key={pdf._id}>
//             <a
//               href={`/api/pdf/${pdf._id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {pdf.title}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default App;
