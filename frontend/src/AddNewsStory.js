import { useState } from "react";
import "./AddNewsStory.css";

export default function AddNewsStory(props) {
  const [newsText, setNewsText] = useState("");
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);

  async function handleAddNewsStory() {
    if (validateNewsStory()) {
      return validateNewsStory();
    }
    let newsStory = { title: newsText, url: url };
    await fetch(`http://localhost:8080/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsStory),
    });
    setUrl("");
    setNewsText("");
    props.fetchData();
  }

  function validateNewsStory() {
    if (url === "" || newsText === "") {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }

  return (
    <div className="add-news">
      <h2>Add News Story</h2>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        className="form-items write-news-title"
        value={newsText}
        onChange={(e) => setNewsText(e.target.value)}
      ></input>
      <label htmlFor="URL">URL:</label>
      <input
        type="text"
        className="form-items write-url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      ></input>
      <input
        type="button"
        className="form-items submit-story"
        value="Add News Story"
        onClick={handleAddNewsStory}
      ></input>
      <h2 className="is-not-valid">
        {isValid ? null : "can not submit empty fields, try again"}
      </h2>
    </div>
  );
}
