import React, { useState } from "react";
import axios from "axios";

const baseUrl = "https://api.schedule.nylas.com";
const config = {
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
  },
};

function App() {
  // const [user, setUser] = useState();
  // const [token, setToken] = useState("");

  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newName, setNewName] = useState("");
  const [slug, setSlug] = useState("");
  const [id, setId] = useState();

  const [startTime, setStartTime] = useState(newStartTime);
  const [endTime, setEndTime] = useState(newEndTime);
  const [name, setName] = useState(newName);

  const [addToken, setAddToken] = useState("");
  const [removeToken, setRemoveToken] = useState("");

  let tokens = [process.env.REACT_APP_ACCESS_TOKEN, process.env.REACT_APP_KEVIN_TOKEN];

  const handleNewPage = async () => {
    const newPage = {
      access_tokens: tokens,
      config: {
        timezone: "America/New_York",
        booking: {
          additional_fields: [
            {
              label: "Reason for appointment",
              name: "reason",
              required: true,
              type: "dropdown",
              dropdown_options: [
                "Undergraduate financial aid",
                "Graduate financial aid",
                "Chat about life",
              ],
            },
            {
              label: "Other details",
              name: "other",
              required: true,
              type: "text",
            },
          ],
          scheduling_method: "round-robin-maximize-fairness",
          opening_hours: [
            {
              days: ["M", "W", "F"],
              start: newStartTime,
              end: newEndTime,
            },
          ],
        },
      },
      name: newName,
      slug: slug,
    };
    const postedPage = await axios.post(
      `${baseUrl}/manage/pages`,
      newPage,
      config
    );
    setNewStartTime("");
    setNewEndTime("");
    setNewName("");
    setSlug("");
    setId(postedPage.data.id);
  };

  const handleUpdatePage = async () => {
    if (addToken !== "" && !tokens.includes(addToken)) {
      tokens.push(addToken);
    }
    if (removeToken !== "") {
      tokens = tokens.filter((t => t !== removeToken));
    }
    const updatedPage = {
      access_tokens: tokens,
      config: {
        timezone: "America/New_York",
        event: {
          title: name
        },
        booking: {
          additional_fields: [
            {
              label: "Reason for appointment",
              name: "reason",
              required: true,
              type: "dropdown",
              dropdown_options: [
                "Undergraduate financial aid",
                "Graduate financial aid",
                "Chat about life",
              ],
            },
            {
              label: "Other details",
              name: "other",
              required: true,
              type: "text",
            },
          ],
          scheduling_method: "round-robin-maximize-fairness",
          opening_hours: [
            {
              days: ["M", "W", "F"],
              start: startTime,
              end: endTime,
            },
          ],
        },
      }
    };
    setName("");
    setStartTime("");
    setEndTime("");
    setAddToken("");
    setRemoveToken("");
    await axios.put(`${baseUrl}/manage/pages/${id}`, updatedPage, config);
  };

  // const handleUser = async () => {
  //   const u = await axios.get('https://api.nylas.com/account', config);
  //   setToken("");
  //   setUser(u.data);
  // }

  return (
    <div className="App">
      <form>
        <label>
          Enter new page name:
          <input
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value)
              setName(e.target.value)
            }
          }
          />
        </label>{" "}
        <br />
        <label>
          Enter new page slug:
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>{" "}
        <br />
        <label>
          Enter start time:
          <input
            type="text"
            value={newStartTime}
            onChange={(e) => {
              setStartTime(e.target.value)
              setNewStartTime(e.target.value)
            }
          }
          />
        </label>{" "}
        <br />
        <label>
          Enter end time:
          <input
            type="text"
            value={newEndTime}
            onChange={(e) => {
              setEndTime(e.target.value)
              setNewEndTime(e.target.value)
            }
          }
          />
        </label>
        <br />
        <br />
        <label>
          Update page name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>{" "}
        <br />
        <label>
          Update start time:
          <input
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>{" "}
        <br />
        <label>
          Update end time:
          <input
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <br />
        <label>
          Add user (token):
          <input
            type="text"
            value={addToken}
            onChange={(e) => setAddToken(e.target.value)}
          />
        </label>
        <br />
        <label>
          Remove user (token):
          <input
            type="text"
            value={removeToken}
            onChange={(e) => setRemoveToken(e.target.value)}
          />
        </label>
        <br />
      </form>
      <button onClick={handleNewPage}> Submit Page </button>
      <button onClick={handleUpdatePage}> Update Page </button>
      {/* <br /> <br />
      <form>
        <label> Enter your access token:
          <input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
        </label>
      </form>
      <button onClick={handleUser}> Log in </button> */}
    </div>
  );
}

export default App;
