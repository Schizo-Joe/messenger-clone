import React, { forwardRef, ForwardRefRenderFunction } from "react";
import "./Message.css";
import { Card, CardContent, Typography } from "@material-ui/core";
import firebase from "firebase";
import { toArray } from "react-emoji-render";

interface IMessageProps {
  message: firebase.firestore.DocumentData;
  username: string | null | undefined;
}

const Message: ForwardRefRenderFunction<HTMLLIElement, IMessageProps> = (
  props,
  ref
) => {
  const { message, username } = props;

  const isUser = username === message.username;

  const parseEmojis = (value: string) => {
    const emojisArray = toArray(value);

    // toArray outputs React elements for emojis and strings for other
    const newValue = emojisArray.reduce((previous, current) => {
      if (typeof current === "string") {
        return previous + current;
      }

      // @ts-ignore
      return previous + current?.props.children;
    }, "");

    return newValue;
  };

  return (
    <li ref={ref} className={`message ${isUser && "message__user"}`}>
      <Card className={isUser ? "message__userCard" : "message__guestCard"}>
        <CardContent>
          <Typography variant="h5" component="h2">
            {!isUser && `${message.username || "Anonymous"}: `}{" "}
            {parseEmojis(message.message)}
          </Typography>
        </CardContent>
      </Card>
    </li>
  );
};

export default forwardRef(Message);
