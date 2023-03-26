import { React, useState } from "react";
import axios from "axios";

export default function NoteWriter(props) {
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState(0);
  const [addAttach, setAddAttach] = useState(false);
  const [attachment, setAttachment] = useState('');
  const [attachmentType, setAttachmentType] = useState('');

  function typing(e) {
    setContent(e.target.value);
  }

  function createPost(content, noteType) {
    let baseURL = "http://localhost:8000/notes/createnote/";
    let headers = {
      "X-CSRFToken": props.user._csrf,
    };
    axios
      .post(
        baseURL,
        {
          userId: props.user.userId,
          note: {
            text: content,
            attachment: attachment,
            attachmentType: attachmentType,
          },
          noteType: noteType,
          replyTo: props.note.noteId,
        },
        {
          headers: headers
        }
      )
      .then((response) => {
        console.log(response.data);
      });
  }

  function removeAttachment() {
    setAttachmentType();
    setAttachment();
  }

  function handleAttachment(e) {
    let attachment = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(attachment);
    reader.onload = function () {
      attachment = reader.result;
      setAttachment(attachment);
    };
  }

  return (
    <>
      <textarea onChange={typing}></textarea>
      <input
        type="number"
        onChange={(e) => {
          setNoteType(e.target.value);
        }}
      ></input>
      <button
        onClick={() => {
          createPost(content, noteType);
          props.setWrite(false);
        }}
      >
        Post Note
      </button>
      <button
        onClick={() => {
          setAddAttach(!addAttach);
        }}
      >
        {" "}
        attachment
      </button>
      {addAttach && (
        <>
          <ul>
            <li>
              <button
                onClick={() => {
                  setAttachmentType("image");
                }}
              >
                Image
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setAttachmentType("video");
                }}
              >
                Video
              </button>
            </li>
          </ul>
          {attachmentType && (
            <>
              <input onChange={handleAttachment} type="file"></input>
              <button onClick={removeAttachment}>Rmove</button>
              {attachmentType === "image" && attachment && (
                <>
                  <img src={attachment} />
                </>
              )}
              {attachmentType === "video" && attachment && (
                <>
                  <video width="320" height="240" controls>
                    <source src={attachment} type="video/mp4" />
                  </video>
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
