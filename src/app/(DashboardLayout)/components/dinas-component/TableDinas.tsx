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
import { styled } from '@mui/material/styles';
import DrawerInputDinas from './DrawerInputDinas';
import DrawerEditDinas from './DrawerEditDinas';
import Cookies from 'js-cookie';

  interface Dinas {
    id: number;
    companies_users_id: number;
    company_user: string;
    tanggal: string;
    nominal: number;
    tenor: number;
    keterangan: string;
    status: string;
  }
  
  interface KasonResponse {
    length: number;
    data: Dinas[];
  }
  
  interface TableDinasProps {
    Dinass: KasonResponse;
    loading: boolean;
    error: string | null;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  }));
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '10px',
    fontWeight: 500, 
  }));
  
  const TableDinas: React.FC<TableDinasProps> = ({
    Dinass,
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
    const [selectedDinasId, setSelectedDinasId] = useState<number | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const theme = useTheme();

    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;
    const isAdmin = user?.roles[0].name === "admin";
  
    const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
    const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
    const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");
  
    if (loading) return <CircularProgress />;
    if (error) return <div>Error: {error}</div>;
  
    const deleteDinas = async (id: any) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this Dinas?');
      if (confirmDelete) {
        try {
          const response = await fetch(`https://hris-api.ptspsi.co.id/api/perjalanan-dinas/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Basic ${basicAuth}`
            },
          });
  
          if (response.ok) {
            setAlertMessage('Dinas berhasil dihapus!');
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
          alert('An error occurred while deleting the Dinas');
          console.error('Error:', error);
        }
      }
    };
  
    const handleEdit = (id: number) => {
      setSelectedDinasId(id);
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
        }, 1200);
    };

    const handleDrawerCloseEdit = () => {
        setOpenDrawerEdit(false);
    };
    
    const handleDrawerSuccessEdit = () => {
        setTimeout(() => {
            location.reload();
        }, 1200);
    };
  
    const filteredDinass = Dinass.data.filter((Dinas) =>
        Dinas.company_user.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
    const paginatedDinass = filteredDinass.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
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
            Add New Dinas
          </Button>
        </div>
        <Paper sx={{ padding: '16px' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <StyledTableCell sx={{ color: '#ffffff' }}>No</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Name</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Tanggal</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Nominal</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Tenor (Bulan)</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Keterangan</StyledTableCell>
                  <StyledTableCell sx={{ color: '#ffffff' }}>Status</StyledTableCell>
                  {isAdmin && (
                    <StyledTableCell sx={{ color: '#ffffff' }}>Action</StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDinass.length > 0 ? (
                  paginatedDinass.map((Dinas, index) => (
                    <StyledTableRow key={Dinas.id}>
                      <StyledTableCell>{page * rowsPerPage + index + 1}</StyledTableCell>
                      <StyledTableCell>{Dinas.company_user}</StyledTableCell>
                      <StyledTableCell>{Dinas.tanggal}</StyledTableCell>
                      <StyledTableCell>{Dinas.nominal}</StyledTableCell>
                      <StyledTableCell>{Dinas.tenor}</StyledTableCell>
                      <StyledTableCell>{Dinas.keterangan}</StyledTableCell>
                      <StyledTableCell >
                        {Dinas.status === 'Success' && (
                        <Alert variant="filled" severity="success" style={{ color: 'white' }}>{Dinas.status}</Alert>
                        )}
                        {Dinas.status === 'Decline' && (
                        <Alert variant="filled" severity="error" style={{ color: 'white' }}>{Dinas.status}</Alert>
                        )}
                        {Dinas.status === 'On Prosses' && (
                        <Alert variant="filled" severity="info" style={{ color: 'white' }}>{Dinas.status}</Alert>
                        )}
                      </StyledTableCell> 
                      {isAdmin && (                   
                        <StyledTableCell>
                          <IconButton onClick={() => handleEdit(Dinas.id)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => deleteDinas(Dinas.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      )}
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
            count={filteredDinass.length}
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
          <DrawerInputDinas 
            open={openDrawer} 
            onClose={handleDrawerClose} 
            onSuccess={handleDrawerSuccess} 
          />
          <DrawerEditDinas 
            open={openDrawerEdit} 
            onClose={handleDrawerCloseEdit} 
            onSuccess={handleDrawerSuccessEdit} 
            DinasId={selectedDinasId}
          />
        </Paper>
      </>
    );
  };
  
  export default TableDinas;
  