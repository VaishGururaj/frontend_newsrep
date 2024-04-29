import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

import pic from '../images/img.jpg';

const styles = {
  picStyle: { position: 'relative', height: '100%', width: '100%' },
  overlay: {
    position: 'absolute',
    top: '40%',
    left: '15%',
    display: 'flex',
    alignItems: 'center',
    width: '70%',
  },
};

export default function SearchImage() {
    const [keywords, setKeywords] = useState('');
    const [imageURL, setImageURL] = useState(null); // New state for image URL
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        // Fetch data from the API
        const response = await fetch('http://127.0.0.1:8000/image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ keywords: [keywords] }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        // Get the Blob object
        const imageBlob = await response.blob();
  
        // Create a URL for the Blob (image data)
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageURL(imageUrl); // Set the imageURL state
      } catch (error) {
        console.error('Error fetching data:', error);
        setImageURL(null); // Reset imageURL on error
      }
    };
  
    return (
      <div className="Search">
        <Card sx={{ height: '45vh', position: 'relative' }}>
          <CardMedia>
            <img style={styles.picStyle} src={pic} alt="Background newspaper image" />
            <Paper component="form" id="mainsearch" style={styles.overlay} onSubmit={handleSubmit}>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Search Bar"
                inputProps={{ 'aria-label': 'Search bar' }}
              />
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          </CardMedia>
        </Card>
        {imageURL !== null && (
          <div>
            <h2>Search Results</h2>
            <img src={imageURL} alt="Fetched Image" />
          </div>
        )}
      </div>
    );
  }
  