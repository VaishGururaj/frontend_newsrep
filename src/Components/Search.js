import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import BarChart from "./BarChart";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RegionMapChart from './RegionMapChart';
import SimpleBarChart from "./SimpleBarChart";

const styles = {
  overlay: {
    display: 'flex',
    alignItems: 'center',
    height:'100%',
    backgroundImage : 'linear-gradient( 135deg, #FF7AF5 10%, #513162 100%)',
    justifyContent:'center',
    height: '60vh'
  }
};

const region_data = {
  "Central FD": "RUCFD",
  "Far Eastern FD": "RUFFD",
  "North Caucasian FD": "RUNCF",
  "Northwestern FD": "RUNFD",
  "Siberian FD": "RUSIB",
  "Southern FD": "RUSFD",
  "Urals FD": "RUUFD",
  "Volga FD": "RUVOL",
};


export default function Search() {
  const [keywords, setKeywords] = useState('');
  const [additionalKeywords, setAdditionalKeywords] = useState('');
  const [dataCounts, setDataCounts] = useState(null);
  const [dataTopics, setDataTopics] = useState(null);
  const [topicCounts, setTopicCounts] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const handleFromDateChange = (date) => {
    // Ensure that the date is a dayjs object
    setFromDate(dayjs(date));
  };

  const handleToDateChange = (date) => {
    // Ensure that the date is a dayjs object
    setToDate(dayjs(date));
  };

  const formatDate = (date) => {
    return date ? date.format('YYYYMM') : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if fromDate and toDate are valid dates
    if (fromDate && !fromDate.isValid()) {
      setError("Invalid From Date");
      return;
    }

    if (toDate && !toDate.isValid()) {
      setError("Invalid To Date");
      return;
    }

    // Check if fromDate is after toDate
    if (fromDate && toDate && fromDate.isAfter(toDate)) {
      setError("From Date cannot be after To Date");
      return;
    }

    // Format dates to "%Y%m"
    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    // Fetch data from the API
    setTimeout(() => {
      setIsPending(true);
      setDataCounts(null);
      setDataTopics(null);
      setError(null);
      const allKeywords = [keywords, additionalKeywords].filter(Boolean); // Filter out empty strings
      console.log(allKeywords);
      fetch('http://127.0.0.1:8000/get_dataframe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords: allKeywords, fromdt: formattedFromDate, todt: formattedToDate }),
      })
        .then((res) => {
          if (!res.ok) {
            throw Error('Could not fetch the data for that resource');
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setIsPending(false);
          setDataCounts(JSON.parse(data.data_counts));
          setDataTopics(data.data_hits);
          setTopicCounts(Object.values(data.hit_counts));
          setError(null);
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            setDataCounts("Fetch Cancelled");
          } else {
            setIsPending(false);
            setError(err.message);
          }
        });
    }, 1000);
  }

  const processDataCounts = (dataCounts) => {
    // Group by month (YYYYMM) and label
    const groupedByMonthAndLabel = Object.values(dataCounts).reduce((acc, entry) => {
      const month = entry.YYYYMM;
      const label = entry.label;
      const key = `${month}-${label}`;
      acc[key] = acc[key] || { label, month, count_words: 0 };
      acc[key].count_words += entry.count_words;
      return acc;
    }, {});
  
    // Group by source_name and label
    const groupedBySourceAndLabel = Object.values(dataCounts).reduce((acc, entry) => {
      const source = entry.source_name;
      const label = entry.label;
      const key = `${source}-${label}`;
      acc[key] = acc[key] || { label, source, count_words: 0 };
      acc[key].count_words += entry.count_words;
      return acc;
    }, {});
  
    const monthTable = Object.values(groupedByMonthAndLabel);
    const sourceTable = Object.values(groupedBySourceAndLabel);
    console.log(monthTable)
    console.log(sourceTable)
    return {monthTable,sourceTable}
  };
  

  return (
    <div className="Search">
    <Paper component="form" id="mainsearch" style={styles.overlay} onSubmit={handleSubmit}>
      <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ width: '70%' }}>
        <Grid item display="flex" sx={{ width: '100%' }}>
          <Paper square={false} elevation={18} sx={{ p: 1, my: 1, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <InputBase
              sx={{ flexGrow: 1, paddingRight: '40px' }}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Search bar for topic/keyword"
              inputProps={{ 'aria-label': 'Search bar for topic/keyword' }}
              required
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item container direction="row" sx={{ width: '100%', display: 'flex' }}>
          <Grid item display="flex" sx={{ marginRight: 1, flexGrow: 1, my: 1 }}>
            <Paper square={false} elevation={18} sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <InputBase
                sx={{ flexGrow: 1}}
                value={additionalKeywords}
                onChange={(e) => setAdditionalKeywords(e.target.value)}
                placeholder="Region?"
                inputProps={{ 'aria-label': 'Search bar for Location' }}
              />
              <SearchIcon />
            </Paper>
          </Grid>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid item sx={{background: 'transparent' }}>
              <Paper square={false} elevation={18} sx={{ p: 1}}>
              <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={handleFromDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  views={['year', 'month']}
                  openTo="year"
                />

                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={handleToDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  views={['year', 'month']}
                  openTo="year"
                />
              </Paper>
            </Grid>
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Paper>
      {error && !isPending && <div>{error}</div>}
      {isPending && <div>Loading...</div>}
      {dataCounts !== null && (
        <div>
          <h2>Search Results</h2>
          <Box sx={{ flexGrow: 1 }}>
          <Grid container direction="row" justifyContent="space-evenly">
              <Grid item >
                <h3>Time series Graph : Sentiment and Time Analysis</h3>
                <BarChart data={processDataCounts(dataCounts).monthTable} />
              </Grid>
              <Grid item>
              <h3>Publication-based Graph : Sentiment and Publication Analysis</h3>
                <BarChart data={processDataCounts(dataCounts).sourceTable} />
              </Grid> 
            </Grid>

            {topicCounts && (
              <Grid container direction="row" sx={{ width: '80%', p: 1, m: 1, margin: 'auto' }} justifyContent="space-evenly">
              <Grid item xs={8} sm={12} md={8}>
                <h3>Geographical Map and Bar chart of Federal Districts : It shows the number of articles from the respective regions and NO sentiment related data</h3>
                <div>{topicCounts && <RegionMapChart data={topicCounts.filter(item => region_data[item.Place])}/>}</div>
              </Grid>
              <Grid item xs={8} sm={12} md={8}>
              <div>
              <h3>Bar graph of other regions</h3>
                {topicCounts && (
                  <SimpleBarChart
                    data={topicCounts.filter(item => !region_data[item.Place])}
                  />
                )}
              </div>
              </Grid>
            </Grid>)}
              {dataTopics && (
                <Grid container direction="row" sx={{ width: '80%', p: 1, m: 1, margin: 'auto' }} justifyContent="space-evenly">
                <h3>Top 20 most related articles</h3>
                <TreeView
                  aria-label="Articles"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  sx={{ width: '100%', margin: 'auto', padding: '16px' }}
                >
                  {Object.entries(dataTopics).map(([key, value]) => (
                    <TreeItem key={key} nodeId={key} label={value.title}>
                      <TreeItem
                        nodeId={`${key}-text`}
                        label={<Typography>{value.body}</Typography>}
                      />
                    </TreeItem>
                  ))}
                </TreeView>
                </Grid>
              )}
            <Grid container direction="row" justifyContent="space-evenly">
            <Grid item xs="auto">
                  <Box>
                    <h3>Data Set based on Word Counts</h3>
                    <ul>
                    <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                      <TableHead>
                        <TableRow>
                          <TableCell>YYYYMM</TableCell>
                          <TableCell align="right">Source Name</TableCell>
                          <TableCell align="right">Label</TableCell>
                          <TableCell align="right">Count Words</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(dataCounts).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell>{value.YYYYMM}</TableCell>
                            <TableCell align="right">{value.source_name}</TableCell>
                            <TableCell align="right">{value.label}</TableCell>
                            <TableCell align="right">{value.count_words}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                    </ul>
                  </Box>
                </Grid>
              </Grid>
          </Box>
        </div>
      )}
    </div>
  );
}