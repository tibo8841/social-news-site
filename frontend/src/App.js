import "./App.css";
import React, { useEffect, useState } from "react";
import Story from "./Story";
import AddNewsStory from "./AddNewsStory";

function App(props) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  async function fetchData() {
    let response = await fetch("http://localhost:8080/stories");
    let json = await response.json();
    setStories(json);
  }

  async function postVote(direction, id) {
    let directionData = { direction: direction };

    await fetch(`http://localhost:8080/stories/${id}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(directionData),
    });
    fetchData();
  }

  async function deleteStory(id) {
    await fetch(`http://localhost:8080/stories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchData();
  }

  function getStoriesComponentList(stories) {
    if (stories.length > 0) {
      return stories.map((story) => (
        <Story
          key={story.title}
          story={story}
          id={story.id}
          postVote={postVote}
          deleteStory={deleteStory}
        />
      ));
    } else {
      return <p>no stories yet</p>;
    }
  }

  function getLoadingComponent() {
    return <div className="loader" />;
  }

  return (
    <div className="App">
      <div className="main-app">
        <header>
          <h1>Social News Site</h1>
        </header>
        <main>
          <h2>Top Stories</h2>
          {loading ? getLoadingComponent() : getStoriesComponentList(stories)}
        </main>
        <AddNewsStory fetchData={fetchData} />
      </div>
    </div>
  );
}

export default App;
