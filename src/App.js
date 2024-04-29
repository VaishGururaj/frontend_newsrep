import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Homepage from './Components/Homepage';
import Search from './Components/Search';
import About from './Components/About';
import SearchImage from './Components/SearchImage';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import React from 'react';


import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const theme = createTheme({
    palette: {
      primary: {
        main: '#8e24aa',
      },
      secondary: {
        main: '#7b1fa2',
      },
    },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Navbar></Navbar>
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/searchImage" element={<SearchImage/>}/>
          </Routes>
        <Footer></Footer>
      </ThemeProvider>
    </Router>
  );
}

export default App;
