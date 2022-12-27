import { useState, useEffect } from "react";
import { MultiSelector } from "./MultiSelector/MultiSelector";

function App() {
  const [users, setUsers] = useState();

  async function fetchUsers() {
    const res = await fetch("https://reqres.in/api/users");
    const { data } = await res.json();
    setUsers(data.map((v: any) => v.email));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!users) {
    return <div>Loading</div>;
  }

  return (
    <>
      <MultiSelector options={users} />
    </>
  );
}

export default App;
