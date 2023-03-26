import { React, useState } from "react";
import NoteWriter from "./NoteWriter";
import axios from "axios";

export default function Note(props) {
  const [writeNote, setWriteNote] = useState(false);

  console.log(props.note);
  function handleComment() {
    setWriteNote(!writeNote);
  }

  function updateList() {
    let baseURL = "http://localhost:8000/notes/note/";
    let headers = {
      "X-CSRFToken": props.user._csrf,
    };
    axios
      .post(baseURL, props.note, {
        headers: headers,
      })
      .then((response) => {
        props.setNotes(response.data);
      });
  }

  function deleteNote() {
    let baseURL = "http://localhost:8000/notes/deletenote/";
    let headers = {
      "X-CSRFToken": props.user._csrf,
    };
    axios
      .post(baseURL, props.note, {
        headers: headers,
      })
      .then((response) => {
        let baseURL = "http://localhost:8000/notes/";
        axios
          .post(baseURL, props.user, {
            headers: headers,
          })
          .then((response) => {
            props.setNotes(response.data);
          });
      });
  }

  return (
    <>
      <p>{props.note.note}</p>
      {props.note.attachmentType === "image" && props.note.attachment && (
        <>
          <img src={props.note.attachment} />
        </>
      )}
      {props.note.attachmentType === "video" && props.note.attachment && (
        <>
          <video width="320" height="240" controls>
            <source src={props.note.attachment} type="video/mp4" />
          </video>
        </>
      )}
      <button onClick={handleComment}>Comment</button>
      <button onClick={updateList}>Open</button>
      <button onClick={deleteNote}>Delete</button>
      {writeNote && (
        <NoteWriter
          note={props.note}
          user={props.user}
          setWrite={setWriteNote}
        />
      )}
    </>
  );
}
