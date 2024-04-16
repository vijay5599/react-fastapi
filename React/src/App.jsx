import { useEffect, useState } from "react";
import axios from "axios";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
// import { Box, Button, TextField } from "@mui/material";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    const response = await axios.get("http://localhost:8000/");
    setUsers(response.data);
    // setSearchData(response.data);
  };

  // const fetchUser = async (id) => {
  //   if (id !== "") {
  //     const response = await axios.get(`http://localhost:8000/${id}`);
  //     const userData = response.data;
  //     setSearchData(userData ? [userData] : []);
  //   } else {
  //     setSearchData(users);
  //   }
  // };
  const fetchUser = async (id) => {
    if (id !== "") {
      const response = await axios.get(`http://localhost:8000/${id}`);
      setUser(response.data);
    } else {
      await fetchUsers();
    }
  };

  const createOrEditUser = async () => {
    if (user.id) {
      await axios.put(`http://localhost:8000/${user.id}`, user);
    } else {
      await axios.post(`http://localhost:8000/`, user);
    }
    await fetchUsers();
    await setUser({ id: "", name: "", email: "", password: "" });
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8000/${id}`);
    await fetchUsers();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const filteredUsers = users.filter((user2) =>
        String(user2.id).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filteredUsers);
    } else {
      fetchUsers();
    }
  }, [searchTerm]);
  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <MenuIcon />
          <Button color="inherit">Users</Button>
        </Toolbar>
      </AppBar>
      <Box m={10}>
        <TableContainer component={Paper} style={{ padding: "20px" }}>
          <Box
            component="section"
            sx={{ p: 2, border: "1px dashed grey" }}
            display="flex"
            alignItems="center"
          >
            <TextField
              value={searchTerm}
              onChange={handleSearchChange}
              // onKeyDown={handleIdKeyDown}
              id="id"
              label="ID"
            />
            {users.length === 0 && (
              <p style={{ marginLeft: "10px", color: "red" }}>
                No data available
              </p>
            )}
          </Box>
          <Table aria-label="customized table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    id="name"
                    label="Name"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    id="email"
                    label="Email"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    id="password"
                    label="Password"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => createOrEditUser()}
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>

              {users.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.password}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => fetchUser(row.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deleteUser(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default App;
