import axios from "axios";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const CreatePostModal = ({ onClose, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handleCreatePost = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const key = localStorage.getItem("key");
    if (!key) {
      alert("Key not found...");
      setIsLoading(false);
      return;
    }

    const data = {
      title: title,
      desc: description,
    };

    try {
      const response = await axios.post(
        "https://sea-turtle-app-k7x99.ondigitalocean.app/api/posts/",
        data,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      console.log("response: ", response);

      if (response) {
        console.log("id: ", response?.data?.id);
        setSuccessModal(true);
        fetchData();
        setTimeout(() => {
          setSuccessModal(false);
          onClose();
        }, 2000);
        // onLogin(); // Call the onLogin function to update the authentication state
      } else {
        console.error("Invalid response data:", response.data);
        alert("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.log("Error occurred: ", error);
      alert("Invalid credentials. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="flex justify-center w-full fixed top-0 left-0 px-3 backdrop-blur-md z-[100] h-screen"
      data-aos="fade-in"
    >
      {!successModal ? (
        <div className="flex flex-col gap-10 my-20 bg-gradient-to-r from-[#7391cc5c] to-[#65b36baa] p-3 sm:p-10 rounded-3xl max-w-xl z-50 w-full">
          <div className="flex flex-col gap-10">
            <div className="flex justify-end">
              <IoClose onClick={onClose} size={40} className="cursor-pointer" />
            </div>
            <div className="flex flex-col gap-3 sm:w-96 font-mono">
              <div className="flex flex-col">
                <label>Title</label>
                <input
                  placeholder="enter the title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-1 rounded-lg bg-slate-100 outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label>Description</label>
                <input
                  placeholder="enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-1 rounded-lg bg-slate-100 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className={`p-2 px-14 sm:px-20 rounded-2xl bg-gradient-to-r from-green-300 to-blue-400 cursor-pointer ${
                  isLoading ? "cursor-not-allowed" : ""
                }`}
                onClick={handleCreatePost}
                // disabled={isLoading} // Disable button when loading
              >
                {isLoading ? "Posting..." : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center h-screen w-screen items-center">
          <FaCheckCircle size={100} data-aos="zoom-in" color="green" />
        </div>
      )}
    </div>
  );
};
export default CreatePostModal;
