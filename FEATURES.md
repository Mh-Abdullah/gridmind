# GridMind — Features Overview


## 1. User Accounts & Authentication

- **Register** — anyone can create an account with a name, email, and password (passwords are hashed before saving).
- **Login / Logout** — standard email + password login with a session cookie.
- **Roles** — every user is either a regular `user` or an `admin`. Admins get a separate dashboard.
- **Protected routes** — pages redirect you to login if you are not signed in. Admins are sent to the admin area; regular users go to the tables area.

---

## 2. Spreadsheet Management

- **Create a spreadsheet** — give it a name and a blank grid is created for you.
- **Delete a spreadsheet** — remove a sheet you no longer need.
- **Rename a spreadsheet** — update the name at any time.
- **Multiple sheets** — each user can have as many spreadsheets as they want; they are all listed on the Tables page.

---

## 3. Spreadsheet Editor

- **Grid editing** — click any cell and type. Works like a normal spreadsheet.
- **Add / remove rows and columns** — grow or shrink the grid as needed.
- **Column labels** — columns are labelled A, B, C … just like Excel.
- **Auto field-type detection** — the system figures out if a column contains Text, Numbers, Dates, URLs, or Booleans based on what is in it.
- **Resize columns** — drag a column border to make it wider or narrower.
- **Multi-cell selection** — click and drag (or Shift-click) to select a range of cells at once.
- **Undo / Redo** — step backwards or forwards through your recent edits.
- **Search inside the sheet** — find a value anywhere in the grid quickly.
- **Sort column** — sort any column ascending or descending.
- **Filter column** — hide rows that do not match a filter value.

---

## 4. Cell Formatting

- **Bold, Italic, Underline** — standard text styling per cell or range.
- **Text alignment** — left, centre, or right align text in a cell.
- **Text colour** — change the font colour of a cell.
- **Background colour** — highlight cells with a background colour.
- **Font size** — set a custom font size per cell.
- **Merge cells** — merge a selected range into one cell; unmerge to split back.
- **Clear formatting** — reset all formatting on selected cells.

---

## 5. Import & Export

- **Import CSV** — drag-and-drop or pick a `.csv` file; the data is loaded into a new sheet.
- **Import XLSX** — same as CSV but for Excel files.
- **Export CSV** — download the current sheet as a `.csv` file.
- **Pending import from landing page** — if you drop a file on the landing page before logging in, the system saves it and automatically imports it once you reach the Tables page.

---

## 6. Real-Time Sync (Convex)

- Every cell edit is saved to the cloud database in real time.
- If you have the same sheet open in two tabs, both stay in sync automatically.
- A small cloud icon shows whether your last change has been saved.

---

## 7. AI Chat Assistant ("Sheet Chat")

- A chat panel lives inside the spreadsheet editor.
- You can ask questions about your data in plain English — e.g. *"What is the average of column B?"* or *"Are there any duplicates in the email column?"*
- The AI is given the full context of your spreadsheet so its answers are specific to your data.
- **Chat history** — conversations are saved per user and sheet in Convex, with a browser fallback, so they follow you across devices.
- **Multiple sessions** — you can start new chat sessions and browse old ones.
- **Streaming replies** — answers appear word-by-word as the AI types them.
- **Thinking steps** — the AI shows its reasoning steps before giving a final answer.
- **Copy message** — copy any assistant reply to your clipboard with one click.

---

## 8. AI Agent (Direct Sheet Editing)

- Tell the AI what to do in plain English and it edits the spreadsheet for you — e.g. *"Fill column C with the first name extracted from column B"* or *"Bold all rows where status is Active"*.
- The agent can change cell values **and** apply formatting in a single instruction.
- It can add new rows or columns when needed.
- A summary of what was changed is shown after each run.

---

## 9. Web Scraper Agent

- **Generate mode** — describe what data you want (e.g. *"Get a list of coffee shops in London with address and phone number"*) and the AI fetches it from the web and builds a new table.
- **Enrich mode** — select existing rows and the AI visits relevant websites to fill in missing information (e.g. adds a "Company Description" column by reading each company's website).
- The scraper can follow URLs already in your sheet or search the web for relevant pages.
- Handles pagination and deduplication automatically.

---

## 10. Column Enricher ("Run Column")

- Pick a column and write a prompt; the AI fills every cell in that column based on the other data in each row.
- Supports web search for each row — e.g. *"Find the LinkedIn URL for this person"*.
- Can also apply a regex transformation or copy/transform values from another column.
- You can run it on all rows or only selected rows.

---

## 11. Admin Dashboard

- Admins see a separate dashboard with a list of all registered users.
- Shows each user's name, email, role, and when they signed up.
- Only users with the `admin` role can access this area.

---

## 12. Dark / Light Theme

- A theme toggle button is available on every page.
- The chosen theme is saved and remembered across visits.

---

## 13. Landing Page

- Public marketing page that explains what GridMind does and lists the available AI agents.
- Includes a CSV/XLSX drag-and-drop import directly on the landing page — the file is carried through to the dashboard after login/signup.
- Links to login and register pages.
