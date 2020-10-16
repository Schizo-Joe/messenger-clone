import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import { FormControl, Grid, Input, InputAdornment } from "@material-ui/core";
import { db } from "../firebase";
import firebase from "firebase";
import SendIcon from "@material-ui/icons/Send";
import AddCircle from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import Message from "./Message";
import { useAuth } from "../contexts/AuthContext";
import { Flipped, Flipper } from "react-flip-toolkit";

interface IMessage {
  id: string;
  message: firebase.firestore.DocumentData;
}

const Home = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { currentUser } = useAuth();

  useEffect(() => {
    db.collection("messages")
      .orderBy("created", "asc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, message: doc.data() }))
        );
      });
  }, []);

  const handleMessageInputChange = (e: any) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = (e: any) => {
    e.preventDefault();

    db.collection("messages").add({
      message: newMessage,
      username: currentUser.email,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setNewMessage("");
  };

  // Scroll to the designated "bottom" element as new messeages arrive
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // @ts-ignore
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="home">
      <img
        src="https://facebookbrand.com/wp-content/uploads/2018/09/Header-e1538151782912.png?w=99&amp;h=99"
        alt="messenger logo"
      />
      <h2>Welcome {currentUser.email}</h2>

      <Grid container alignItems="center" justify="center">
        <Flipper
          flipKey={messages.join()}
          spring="gentle"
          className="home__flipper"
        >
          <ul className="home__messageList">
            {messages.map(({ id, message }) => (
              <Flipped key={id} flipId={id}>
                <Message message={message} username={currentUser.email} />
              </Flipped>
            ))}
            <div ref={bottomRef} className="home__listBottom"></div>
          </ul>
        </Flipper>
        <form className="home__form">
          <FormControl className="home__formControl">
            <Input
              className="home__input"
              placeholder="Enter a message..."
              value={newMessage}
              onChange={handleMessageInputChange}
              startAdornment={
                <InputAdornment position="start">
                  <AddCircle fontSize="large" style={{ fill: "#0b81ff" }} />
                </InputAdornment>
              }
            />
            <IconButton
              className="home__iconButton"
              color="primary"
              disabled={!newMessage}
              onClick={sendMessage}
              type="submit"
            >
              <SendIcon fontSize="large" style={{ fill: "#0b81ff" }} />
            </IconButton>
          </FormControl>
        </form>
      </Grid>
    </div>
  );
};

export default Home;
