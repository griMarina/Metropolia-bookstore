import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddBook from './AddBook';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './App.css';


function App() {
  const [books, setBooks] = useState([]);
  const [columnDefs] = useState([
    { field: 'title', sortable: true, width: 250 },
    { field: 'author', sortable: true },
    { field: 'year', sortable: true, width: 100 },
    { field: 'isbn', sortable: true },
    { field: 'price', sortable: true, width: 100 },
    {
      field: '',
      cellRenderer: params =>
        <IconButton onClick={() => deleteBook(params.data.id)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
    }
  ])

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch('https://bookstore-a5197-default-rtdb.europe-west1.firebasedatabase.app/books/.json')
      .then(response => response.json())
      .then(data => addKeys(data))
      .catch(err => console.error(err))
  }

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, 'id', { value: keys[index] }));
    setBooks(valueKeys);
  }

  const addBook = (newBook) => {
    fetch('https://bookstore-a5197-default-rtdb.europe-west1.firebasedatabase.app/books/.json',
      {
        method: 'POST',
        body: JSON.stringify(newBook)
      })
      .then(response => fetchItems())
      .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-a5197-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      {
        method: 'DELETE',
      })
      .then(response => fetchItems())
      .catch(err => console.error(err))
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div className="ag-theme-alpine" style={{ height: 400, width: 1000, margin: 'auto', textAlign: 'left' }}>
        <AgGridReact
          rowData={books}
          columnDefs={columnDefs}
        />
      </div>
    </div>
  );
}

export default App;