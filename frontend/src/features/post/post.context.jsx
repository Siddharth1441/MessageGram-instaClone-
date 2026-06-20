/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);
  const [feed, setFeed] = useState(null);
  const [error, setError] = useState("");

  return (
    <PostContext.Provider value={{ loading, setLoading, post, setPost, feed, setFeed, error, setError }}>
      {children}
    </PostContext.Provider>
  )
}
