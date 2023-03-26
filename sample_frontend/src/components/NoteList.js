import { React, useState, useEffect } from "react";
import axios from "axios";
import NoteWriter from "./NoteWriter";
import Note from "./Note";

export default function NoteList(props) {
  const [notes, setNotes] = useState([{ content: "note content 1" }]);
  const [write, setWrite] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  function getNotes() {
    let baseURL = "http://localhost:8000/notes/";
    let headers = {
      "X-CSRFToken": props.user._csrf,
    };
    axios.post(baseURL, props.user, { headers: headers }).then((response) => {
      console.log("setNotes");
      setNotes(response.data);
    });
  }

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    const onScroll = (e) => {
      console.log("scrools");
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  if (write) {
    return (
      <>
        <NoteWriter
          user={props.user}
          note={{ noteId: "" }}
          setWrite={setWrite}
        />
      </>
    );
  }
  return (
    <div>
      {notes.map((note) => {
        return <Note note={note} user={props.user} setNotes={setNotes} />;
      })}

      <button
        onClick={() => {
          setWrite(true);
        }}
      >
        Post
      </button>
    </div>
  );
}
