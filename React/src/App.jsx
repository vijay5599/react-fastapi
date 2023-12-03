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
function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
  });

  const fetchUsers = async () => {
    const resposnse = await axios.get("http://localhost:8000/");
    return setUsers(resposnse.data);
    console.log(users);
  };
  // console.log("users", fetchUsers());
  // fetchUsers();
  const fetchUser = async (id) => {
    const response = await axios.get(`http://localhost:8000/${id}`);
    const userData = response.data;
    setUser(userData);
    // console.log(userData);
  };

  const createOrEditUser = async () => {
    if (user.id) {
      await axios.put(`http://localhost:8000/${user.id}`, user);
    } else {
      await axios.post(`http://localhost:8000/`, user);
    }
    await fetchUsers();
    await setUser({ id: 0, name: "", email: "", password: "" });
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8000/${id}`);
    await fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <MenuIcon />
          <Button color="inherit">Users</Button>
        </Toolbar>
      </AppBar>
      <Box m={10}>
        <TableContainer component={Paper}>
          <TextField value={user.id} type="hidden" />
          <Table aria-label="customized table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    id="standard-basic"
                    label="Name"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    id="standard-basic"
                    label="Email"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={user.password}
                    id="standard-basic"
                    label="Password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
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
                <TableCell>Emai</TableCell>
                <TableCell>Password</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
              {console.log("users", users)}
              {users.map((row) => (
                <TableRow>
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
