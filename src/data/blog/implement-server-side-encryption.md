---
author: David Küng
pubDatetime: 2025-07-02T14:00:00Z
title: Implementing server-side encryption in Next.js app
slug: implement-server-side-encryption-next-js
featured: true
draft: false
tags:
  - React
  - Next.js
  - Encryption
  - Security
description: Step-by-step example of how server-side encryption works in a Next.js app.
---

## **1. UI: User Submits a Task**
Let’s say you have a simple form:

```jsx
// components/TaskForm.js
import { useState } from "react";

export default function TaskForm() {
  const [task, setTask] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    });
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
```


## **2. API Route: Receive and Encrypt Data**
Create an API route in `pages/api/tasks.js`:

```js
// pages/api/tasks.js
import { encrypt } from "../../utils/encryption";
import { saveTaskToDb } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { task } = req.body;
    const encryptedTask = encrypt(task);
    await saveTaskToDb(encryptedTask);
    res.status(200).json({ message: "Task saved (encrypted)!" });
  } else {
    res.status(405).end();
  }
}
```

## **3. Encryption Utility**
Here’s a simple AES-256-CBC encryption utility using Node.js `crypto`:

```js
// utils/encryption.js
const crypto = require("crypto");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY.padEnd(32, "0"); // 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
```

- **Set `ENCRYPTION_KEY` in your environment variables** (e.g., `.env.local`).


## **4. Save to Database**
Here’s a mock function for saving to a database (replace with your actual DB logic):

```js
// utils/db.js
export async function saveTaskToDb(encryptedTask) {
  // Example: Save to a SQL or NoSQL DB
  // await db.collection("tasks").insertOne({ task: encryptedTask });
  // For demonstration, just log it:
  console.log("Saving to DB:", encryptedTask);
}
```

## **5. Summary of the Flow**
1. **User enters a task** in the UI and submits the form.
2. **Form sends the task** to the Next.js API route.
3. **API route encrypts the task** using a server-side key.
4. **Encrypted task is saved** to the database.
5. **Decryption** (when reading from the DB) happens on the server before sending data back to the client.


## **Decryption Example (for reading tasks)**
```js
// pages/api/tasks.js (GET handler)
import { decrypt } from "../../utils/encryption";
import { getTasksFromDb } from "../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const encryptedTasks = await getTasksFromDb();
    const tasks = encryptedTasks.map((t) => decrypt(t.task));
    res.status(200).json({ tasks });
  }
}
```


**This is the standard pattern for server-side encryption:**
- **Encrypt before saving to DB**
- **Decrypt after reading from DB**
- **Key is managed by the server, not the user**