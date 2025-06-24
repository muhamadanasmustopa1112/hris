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
import DrawerInputShift from './DrawerInputShiift';
import DrawerEditShift from './DrawerEditShift';
import Cookies from 'js-cookie';

  
  interface Shift {
    id: number;
    name: string;
    status: string;
    company_id: number;
  }
  
  interface ShiftResponse {
    length: number;
    data: Shift[];
  }
  
  interface TableShiftProps {
    shifts: ShiftResponse;
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
  
  const TableShift: React.FC<TableShiftProps> = ({
    shifts,
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
    const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const theme = useTheme();

    const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
    const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
    const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");
  
    if (loading) return <CircularProgress />;
    if (error) return <div>Error: {error}</div>;
  
    const deleteShift = async (id: any) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this Shift?');
      if (confirmDelete) {
        try {
          const response = await fetch(`https://hris-api.ptspsi.co.id/api/shift/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${basicAuth}`
            },
          });
  
          if (response.ok) {
            setAlertMessage('Shift berhasil dihapus!');
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
          alert('An error occurred while deleting the Shift');
          console.error('Error:', error);
        }
      }
    };
  
    const handleEdit = (id: number) => {
        setSelectedShiftId(id);
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

  
    const filteredShifts = shifts.data.filter((shift) =>
      shift.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const paginatedShifts = filteredShifts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
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
            Add New Shift
          </Button>
        </div>
        <Paper sx={{ padding: '16px' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <StyledTableCell sx={{ color: '#ffffff' }}>No</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Name</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>status</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff', textAlign: 'center' }}>Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedShifts.length > 0 ? (
                  paginatedShifts.map((shift, index) => (
                    <StyledTableRow key={shift.id}>
                      <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                      <StyledTableCell>{shift.name}</StyledTableCell>
                      <StyledTableCell >
                          {shift.status === 'Active' && (
                          <Alert variant="filled" severity="success" style={{ color: 'white',  width: '150px' }}>{shift.status}</Alert>
                          )}
                          {shift.status === 'Non Active' && (
                          <Alert variant="filled" severity="error" style={{ color: 'white', width: '150px' }}>{shift.status}</Alert>
                          )}
                      </StyledTableCell>     
                      <StyledTableCell sx={{ width: '100px'}}>
                        <IconButton onClick={() => handleEdit(shift.id)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteShift(shift.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
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
            count={filteredShifts.length}
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
          <DrawerInputShift 
            open={openDrawer} 
            onClose={handleDrawerClose} 
            onSuccess={handleDrawerSuccess} 
          />
          <DrawerEditShift
            open={openDrawerEdit}
            onClose={handleDrawerCloseEdit}
            onSuccess={handleDrawerSuccessEdit}
            shiftId={selectedShiftId}
          />
        </Paper>
      </>
      
    );
  };
  
  export default TableShift;
  