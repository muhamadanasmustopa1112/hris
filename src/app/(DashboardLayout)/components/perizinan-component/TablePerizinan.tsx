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
  Backdrop,
} from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


interface Perizinan {

    id: number;
    jenis_perizinan_id: number;
    category_id: number;
    companies_user_id: number;
    jenis_perizinan_name: string;
    category_name: string;
    company_user: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jam_masuk: string;
    jam_keluar: string;
    keterangan: string;
    status: string;
    lampiran: string;
    
}


interface PerizinansResponse {
  length: number;
  data: Perizinan[];
}



interface TablePerizinanProops {
  perizinans: PerizinansResponse;
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TablePerizinan: React.FC<TablePerizinanProops> = ({
  perizinans,
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
  const [loadingBackDrop, setLoadingBackDrop] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const theme = useTheme();
  const router = useRouter();

  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
  const isAdmin = user?.roles[0].name === "admin";

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const deleteEmployee = async (id: any) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Perizinan?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://backend-apps.ptspsi.co.id/api/perizinan/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
        });
  
        if (response.ok) {
          setAlertMessage('Perizinan berhasil dihapus!');
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
        alert("An error occurred while deleting the employee");
        console.error("Error:", error);
      }
    }
  };

  const handleEdit = (id: number) => {
    setLoadingBackDrop(true);
    setTimeout(() => {
      router.push(`/perizinan/edit-perizinan/${id}`);
    }, 2000);
  };

  const handleAddPerizinan = () => {
    setLoadingBackDrop(true);
    setTimeout(() => {
      router.push('/perizinan/input-perizinan');    
    }, 2000);
  };

  const handleSnackbarClose = (
    event: SyntheticEvent | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return; 
    }
    setOpen(false); 
  };

  const handleAlertClose = (event: SyntheticEvent) => {
    setOpen(false); 
    location.reload();

  };

  const filteredPerizinans = perizinans.data.filter((perizinan) =>
    perizinan.company_user?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPerizinans = filteredPerizinans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <Button variant="contained" color="primary" onClick={handleAddPerizinan}>
          Add New Perizinan
        </Button>
        <Backdrop open={loadingBackDrop} style={{ zIndex: 9999, color: '#fff' }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff' }}>No</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Name</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Tanggal Mulai</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Tanggal Selesai</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Jam Masuk</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Jam Keluar</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Keterangan</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Jenis Izin</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Category Izin</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Status</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Lampiran</TableCell>
                {isAdmin && (
                  <TableCell sx={{ color: '#ffffff' }}>Action</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
            {paginatedPerizinans.length > 0 ? (
              paginatedPerizinans.map((perizinan, index) => (
                <TableRow key={perizinan.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{perizinan.company_user}</TableCell>
                  <TableCell>{perizinan.tanggal_mulai}</TableCell>
                  <TableCell>{perizinan.tanggal_selesai ? perizinan.tanggal_selesai : '-'}</TableCell>
                  <TableCell>{perizinan.jam_masuk}</TableCell>
                  <TableCell>{perizinan.jam_keluar}</TableCell>
                  <TableCell>{perizinan.keterangan}</TableCell>
                  <TableCell>{perizinan.jenis_perizinan_name}</TableCell>
                  <TableCell>{perizinan.category_name}</TableCell>
                  <TableCell >
                    {perizinan.status === 'Success' && (
                    <Alert variant="filled" severity="success" style={{ color: 'white' }}>{perizinan.status}</Alert>
                    )}
                    {perizinan.status === 'Decline' && (
                    <Alert variant="filled" severity="error" style={{ color: 'white' }}>{perizinan.status}</Alert>
                    )}
                    {perizinan.status === 'On Prosses' && (
                    <Alert variant="filled" severity="info" style={{ color: 'white' }}>{perizinan.status}</Alert>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() =>{ window.open(perizinan.lampiran, '_blank') }} color="primary">
                        <AttachFileIcon />
                    </IconButton>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <IconButton onClick={() => { handleEdit(perizinan.id)}} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => {deleteEmployee(perizinan.id)}} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                  <TableCell colSpan={12} align="center">
                    Data Not Found
                  </TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPerizinans.length}
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
            color: 'white' 
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      </Paper>
    </>
  );
};

export default TablePerizinan;
