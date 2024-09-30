import axios from "axios";
import React, { useState } from "react";
import { BiDislike, BiLike, BiRepost } from "react-icons/bi";
import { FaCheckCircle, FaRegComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import adam from "../pages/assets/adam.png";

const CommentModal = ({ data, onClose, fetchData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");

  const [likeCount, setLikeCount] = useState("248k");
  const [dislikeCount, setDislikeCount] = useState("23k");
  const [commentCount, setCommentCount] = useState("120k");
  const [successModal, setSuccessModal] = useState(false);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleAddComment = async () => {
    if (isLoading) return;
    setIsLoading(true);
    // console.log("DataId: ", data.id);

      const key = localStorage.getItem("key");

      if (!key) {
        alert("Key not found...");
        setIsLoading(false);
        return;
      }
    const dataIn = {
      id: data.id,
      comment: comment,
    };
    console.log("dataIn: ", dataIn);

    try {
      const response = await axios.post(
        "https://sea-turtle-app-k7x99.ondigitalocean.app/api/comment/",
        dataIn,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      console.log("response: ", response);

      if (response) {
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
          onClose();
        }, 2000);
        fetchData();
        setIsLoading(false);
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
        <div
          className="flex flex-col gap-10 my-10 bg-gradient-to-r from-[#7391cc5c] to-[#65b36baa] p-8 sm:p-10 rounded-3xl h-full max-w-2xl z-50 overflow-auto hide-scrollbar"
          data-aos="zoom-in"
        >
          <div className="flex flex-col gap-1">
            <div className="flex justify-end">
              <IoClose onClick={onClose} size={30} className="cursor-pointer" />
            </div>
            <div className="flex flex-col gap-3 w-96 font-mono">
              <span className="rounded-2xl bg-slate-500 bg-opacity-35 p-1 px-3">
                <strong>Title: </strong>
                {data.title}
              </span>
              <p className="p-2 text-[24px] font-semibold font-sans">
                {data.desc}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 bg-slate-500 bg-opacity-35 p-5 rounded-xl ">
              {data?.tags?.map((tag, index) => (
                <span
                  id={index}
                  className="text-[12px] bg-green-500 bg-opacity-50 p-1 px-2 rounded-lg cursor-pointer hover:bg-green-600 transition-all"
                >
                  {tag}
                </span>
              ))}
            </div>

            <strong>Doctors who could help!</strong>
            <div className="flex  flex-wrap gap-2 bg-slate-500 bg-opacity-35 p-5 rounded-xl">
              {data?.doctors_related.length > 0 ? (
                <>
                  {data?.doctors_related?.map((doctor, index) => (
                    <span
                      id={index}
                      className="text-[14px] bg-blue-500 bg-opacity-50 p-1 px-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all"
                    >
                      @{doctor.username}
                    </span>
                  ))}
                </>
              ) : (
                <>No related doctors found...</>
              )}
            </div>

            <div className="flex justify-between mt-5 gap-3 p-1 px-3 items-center text-[16px] 0 bg-opacity-30">
              <span className="flex gap items-end">
                <BiLike
                  size={25}
                  color={`${liked ? "blue" : ""}`}
                  className="cursor-pointer hover:scale-110"
                  onClick={() => setLiked(!liked)}
                />
                {likeCount}
              </span>
              <span className="flex gap-1 items-end">
                <BiDislike
                  size={25}
                  color={`${disliked ? "blue" : ""}`}

                  className="cursor-pointer hover:scale-110"
                  onClick={() => setDisliked(!disliked)}
                />
                {dislikeCount}
              </span>
              <span className="flex gap-1 items-end">
                <FaRegComment
                  size={25}
                  className="cursor-pointer hover:scale-110"
                  onClick={() => setDislikeCount(dislikeCount - 1)}
                />
                {commentCount}
              </span>
              <span className="flex gap-1 items-end">
                <BiRepost
                  size={25}
                  className="cursor-pointer hover:scale-110"
                  onClick={() => setDislikeCount(dislikeCount - 1)}
                />
                {commentCount}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <span>Comments</span>
                <div className="flex gap-1 justify-between w-full">
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="add coment"
                    className="rounded-xl p-1 px-3 bg-black bg-opacity-60 text-white w-full outline-none"
                  />
                  <button
                    className="p-1 px-3 bg-black rounded-xl text-white"
                    onClick={handleAddComment}
                  >
                    {isLoading ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
              <div className="bg-black rounded-2xl p-5 text-white font-light font-sans">
                {data?.comments.length > 0 ? (
                  <>
                    {data.comments?.map((comment, index) => (
                      <div className="flex flex-col" key={index}>
                        <div className="flex gap-1 ">
                          <img src={adam} className="w-7 h-7"></img>
                          <span className="text-slate-300">
                            @{comment.author}
                          </span>
                        </div>
                        <div className="flex justify-between p-3">
                          <span>{comment?.comment}</span>
                          <span className="text-[12px] items-end flex w-20">
                            {comment?.date?.slice(0, 10)}
                          </span>
                        </div>
                        <div className="h-[1px] mb-2 w-full bg-slate-500"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <span>No Comments...</span>
                )}
              </div>
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
export default CommentModal;
