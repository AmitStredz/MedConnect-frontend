import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

import AddPatientModal from "../components/addPatientModal";
import AddReportModal from "../components/addReportModal";

import { FiExternalLink } from "react-icons/fi";

export default function Patient() {
  const navigate = useNavigate();

  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [addPatientModal, setAddPatientModel] = useState(false);
  const [addReportModel, setAddReportModel] = useState(false);
  const [searchPatient, setSearchPatient] = useState("");
  const [patientDetails, setPatientDetails] = useState([]);

  const [patientSummary, setPatientSummary] = useState("");
  const [patientTags, setPatientTags] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchPatients = async (searchQuery = "") => {
    if (isLoading) return;
    setIsLoading(true);
    const key = localStorage.getItem("key");

    if (!key) {
      alert("Key not found...");
      setIsLoading(false);
      return;
    }
    console.log("patient fetching...");
    

    try {
      const response = await axios.get(
        `https://sea-turtle-app-k7x99.ondigitalocean.app/api/patients/?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      console.log("patient response: ", response);
      

      if (response?.data) {
        setPatientList(response?.data);
      } else {
        setPatientList([]);
      }
    } catch (error) {
      console.log("Error occurred: ", error);
      alert("No Patient data found...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => fetchPatients(searchQuery), 500),
    []
  );

  useEffect(() => {
    if (searchPatient) {
      debouncedSearch(searchPatient);
    } else {
      fetchPatients();
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchPatient, debouncedSearch]);

  const fetchPatientSummary = async (patientId) => {
    setSummaryLoading(true);
    const key = localStorage.getItem("key");

    console.log("key: ", key);

    const data = {
      id: patientId,
    };
    console.log("data: ", data);

    try {
      const response = await axios.get(
        `https://sea-turtle-app-k7x99.ondigitalocean.app/api/records/${patientId}`, // Passing patient_id as a query parameter
        {
          headers: {
            Authorization: `Token ${key}`, // Include the Authorization header
          },
        }
      );

      console.log("response:", response);

      console.log("responseData: ", response?.data);

      if (response?.data) {
        const data = response.data;
        setPatientDetails(data);
      }

      console.log("PatientDetails: ", patientDetails);

      setPatientSummary(response.data[0]?.summary || "Summary not available");
      setPatientTags(response?.data[0]?.tags);
    } catch (error) {
      console.log("Error fetching patient summary: ", error);
      setPatientSummary("Failed to fetch summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handlePatientClick = async (index) => {
    // try {
    //   const response = await axios.get(
    //     "https://sea-turtle-app-k7x99.ondigitalocean.app/api/records/",
    //     { id: "1" }
    //   );

    //   console.log("response: ", response);
    //   if (response) {
    //     console.log("summary: ", response?.data[0].summary);
    //   }
    // } catch (error) {
    //   console.log("error: ", error);
    // }
    const selectedPatient = patientList[index];
    setSelectedPatient(selectedPatient);
    fetchPatientSummary(selectedPatient.id);
  };

  // Function to highlight matched text
  const highlightMatch = (name, query) => {
    if (!query) return name;
    const parts = name.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-blue-300 p-1">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="page2 flex flex-col gap-3 max-sm:w-screen p-10">
      <span className="text-[20px] font-serif font-semibold">
        Patients Details
      </span>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-10">
        <input
          placeholder="Search Patient"
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
          className="p-1 px-2 sm:w-96 rounded-lg border border-slate-400"
        />
        <button
          className="p-1 sm:p-2 sm:px-4 rounded-lg bg-gradient-to-r from-[#aae090be] to-[#48ba4acf]"
          onClick={() => setAddPatientModel(true)}
        >
          Add Patient
        </button>
      </div>
      <div className="container flex flex-col sm:flex-row gap-10">
        <div className="left">
          <div className="flex flex-col gap-2 sm:w-96">
            {patientList.length > 0 ? (
              patientList?.map((patient, index) => (
                <div
                  key={index}
                  className="bg-slate-200 p-3 rounded-lg cursor-pointer hover:bg-slate-300 transition-all"
                  onClick={() => handlePatientClick(index)}
                >
                  <span>{highlightMatch(patient.name, searchPatient)}</span>
                </div>
              ))
            ) : (
              <>{!isLoading && <span>No Patient Data</span>}</>
            )}
          </div>
          <div>{isLoading && <span>Fetching Data...</span>}</div>
        </div>
        {selectedPatient && (
          <div className="flex flex-col gap-3 p-2 sm:p-5 border border-gray-300 rounded-lg w- h-full  text-[12px] sm:text-[16px]">
            <div className="flex justify-between items-center">
              <h3 className="text-sm sm:text-lg font-semibold">
                Patient Details
              </h3>
              <button
                className="p-2 px-4 rounded-lg bg-gradient-to-r from-[#aae090be] to-[#48ba4acf]"
                onClick={() => setAddReportModel(true)}
              >
                Add Report
              </button>
            </div>
            <p>
              <strong>Name:</strong> {selectedPatient.name}
            </p>
            <p>
              <strong>Age:</strong> {selectedPatient.age}
            </p>
            <p>
              <strong>Sex:</strong> {selectedPatient.gender}
            </p>
            {/* <p>
              <strong>Doctor:</strong> {selectedPatient.doctor}
            </p> */}

            <strong className="flex sm:justify-center">
              <span className="max-sm:hidden">
                ****************************
              </span>
              {/* <span className="sm:hidden">*****</span> */}
              Patient Records
              <span className="max-sm:hidden">
                ****************************
              </span>
              {/* <span className="sm:hidden">*****</span> */}
            </strong>

            <div>
              {patientDetails ? (
                <div className="flex flex-col gap-3">
                  {patientDetails.map((patient, index) => (
                    <div className="flex flex-col gap-3 bg-slate-200 p-3 rounded-md">
                      <div>
                        <strong>ReportType:</strong>
                        <span>{patient.name}</span>
                      </div>
                      <div>
                        <strong>Date:</strong>
                        <span>{patient.date}</span>
                      </div>
                      <div>
                        <strong>Summary:</strong>
                        {patient?.summary}
                      </div>
                      <span>
                        <strong className="pt-10">Tags:</strong>
                      </span>
                      {patient.tags ? (
                        <div className="flex gap-2 flex-wrap">
                          {patient.tags.map((name, index) => (
                            <span className="p-1 px-2 text-[10px] sm:text-[13px] rounded-lg bg-gradient-to-tr from-[#69ef69ab] to-[#6095e6a1]">
                              {name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <>No Tags...</>
                      )}
                      <div className="w-full">
                        <a
                          className="flex items-center w-24 gap-1 p-1 px-2 rounded-md bg-gradient-to-r from-[#5e99ebc0] to-[#2a39e2a3] cursor-pointer"
                          href={`${patient.url}`}
                          target="_blank"
                        >
                          Report
                          <FiExternalLink />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>No Records...</>
              )}
            </div>
          </div>
        )}
      </div>
      {addPatientModal && (
        <AddPatientModal onClose={() => setAddPatientModel(false)} />
      )}
      {addReportModel && (
        <AddReportModal
          id={selectedPatient?.id}
          onClose={() => setAddReportModel(false)}
        />
      )}
    </div>
  );
}
