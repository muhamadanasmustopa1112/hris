import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Button,
    CircularProgress,
    TextField,
    IconButton,
    SnackbarCloseReason,
    Snackbar,
    Alert,
  } from '@mui/material';
  import { SyntheticEvent, useState } from 'react';
  import { useTheme } from '@mui/material/styles';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import { useRouter } from 'next/navigation';
  import { styled } from '@mui/material/styles';
import DrawerInputDivision from './DrawerInputDivision';
import DrawerEditDivision from './DrawerEditDivision';
import Cookies from 'js-cookie';
  
  interface Division {
    id: number;
    name: string;
    company_id: number;
  }
  
  interface DivisionResponse {
    length: number;
    data: Division[];
  }
  
  interface TableDivisionProps {
    divisions: DivisionResponse;
    loading: boolean;
    error: string | null;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  // Styled components
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover, // Zebra striping
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected, // Hover effect
    },
  }));
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '10px',
    fontWeight: 500, 
  }));
  
  const TableDivision: React.FC<TableDivisionProps> = ({
    divisions,
    loading,
    error,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  }) => {
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openDrawerEdit, setOpenDrawerEdit] = useState(false);
    const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const theme = useTheme();
    const router = useRouter();
  
    if (loading) return <CircularProgress />;
    if (error) return <div>Error: {error}</div>;
  
    const deleteDivision = async (id: any) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this division?');
      if (confirmDelete) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/division/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Cookies.get('token')}`,
            },
          });
  
          if (response.ok) {
            setAlertMessage('Division berhasil dihapus!');
            setAlertSeverity('success');
            setOpen(true);
          } else {
            const errorData = await response.json();
            const message = Object.values(errorData.message).flat().join(', ') || 'Terjadi kesalahan';
            setAlertMessage(message);
            setAlertSeverity('error');
            setOpen(true);
          }
        } catch (error) {
          alert('An error occurred while deleting the employee');
          console.error('Error:', error);
        }
      }
    };
  
    const handleEdit = (id: number) => {
        setSelectedDivisionId(id);
        setOpenDrawerEdit(true);
    };
  
    const handleSnackbarClose = (event: SyntheticEvent | Event, reason: SnackbarCloseReason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
  
    const handleAlertClose = (event: SyntheticEvent) => {
      setOpen(false);
      location.reload();
    };

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
      };
    
    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };
    
    const handleDrawerSuccess = () => {
        setTimeout(() => {
            location.reload();
        }, 3000);
    };
    const handleDrawerCloseEdit = () => {
        setOpenDrawerEdit(false);
    };
    
    const handleDrawerSuccessEdit = () => {
        setTimeout(() => {
            location.reload();
        }, 3000);
    };

  
    const filteredDivisions = divisions.data.filter((division) =>
      division.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const paginatedDivisions = filteredDivisions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            style={{ marginRight: '16px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleDrawerOpen}>
            Add New Division
          </Button>
        </div>
        <Paper sx={{ padding: '16px' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <StyledTableCell sx={{ color: '#ffffff' }}>No</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Name</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff', textAlign: 'center'  }}>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDivisions.length > 0 ? (
                  paginatedDivisions.map((division, index) => (
                    <StyledTableRow key={division.id}>
                      <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                      <StyledTableCell>{division.name}</StyledTableCell>
                      <StyledTableCell sx={{ width: '100px'}}>
                        <IconButton onClick={() => handleEdit(division.id)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteDivision(division.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ): (
                  <StyledTableRow>
                    <StyledTableCell colSpan={12} align="center">
                      Data Not Found
                    </StyledTableCell>
                </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDivisions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleAlertClose}
              severity={alertSeverity}
              sx={{
                width: '100%',
                backgroundColor: alertSeverity === 'success' ? 'green' : 'red',
                color: 'white',
              }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
          <DrawerInputDivision 
            open={openDrawer} 
            onClose={handleDrawerClose} 
            onSuccess={handleDrawerSuccess} 
          />
          <DrawerEditDivision
            open={openDrawerEdit}
            onClose={handleDrawerCloseEdit}
            onSuccess={handleDrawerSuccessEdit}
            divisionId={selectedDivisionId}
          />
        </Paper>
      </>
      
    );
  };
  
  export default TableDivision;
  