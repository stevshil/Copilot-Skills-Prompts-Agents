module.exports = function generateFrontend() {
  return {
    files: {
      "src/frontend/App.jsx": `
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TodoList from "./components/TodoList";
import PublicTodos from "./components/PublicTodos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/public" element={<PublicTodos />} />
      </Routes>
    </BrowserRouter>
  );
}
`,

      "src/frontend/components/Login.jsx": `
import React, { useState } from "react";
import api from "../lib/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    await api.login(username, password);
    window.location.href = "/todos";
  };

  return (
    <div>
      <h1>Login</h1>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}
`,

      "src/frontend/components/TodoList.jsx": `
import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    api.getUserTodos().then(setTodos);
  }, []);

  const togglePublic = async (todo) => {
    await api.updateTodo(todo.id, { is_public: !todo.is_public });
    setTodos(await api.getUserTodos());
  };

  return (
    <div>
      <h1>Your Todos</h1>
      {todos.map(t => (
        <div key={t.id}>
          <span>{t.text}</span>
          <button onClick={() => togglePublic(t)}>
            {t.is_public ? "Make Private" : "Make Public"}
          </button>
        </div>
      ))}
    </div>
  );
}
`,

      "src/frontend/components/PublicTodos.jsx": `
import React, { useEffect, useState } from "react";
import api from "../lib/api";

export default function PublicTodos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    api.getPublicTodos().then(setTodos);
  }, []);

  return (
    <div>
      <h1>Public Todos</h1>
      {todos.map(t => (
        <div key={t.id}>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
`,

      "src/frontend/lib/api.js": `
const API = "/api";

export default {
  login: (username, password) =>
    fetch(\`\${API}/login\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }).then(r => r.json()),

  getUserTodos: () =>
    fetch(\`\${API}/todos\`).then(r => r.json()),

  getPublicTodos: () =>
    fetch(\`\${API}/todos/public\`).then(r => r.json()),

  updateTodo: (id, data) =>
    fetch(\`\${API}/todos/\${id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json())
};
`
    }
  };
};
