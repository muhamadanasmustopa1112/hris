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
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import DrawerInputPresensi from './DrawerInputPresensi';
import * as XLSX from 'xlsx';
import Cookies from 'js-cookie';

interface Presensi {
  id: number;
  companies_user_id: number;
  presensi_keluar_id: number;
  shift_name: string;
  companies_user: string;
  tanggal: string;
  status_masuk: string;
  status_keluar: string;
  jam_masuk: string;
  jam_keluar: string;
  keterangan_masuk: string;
  keterangan_keluar: string;
  alamat: string;
}

interface PresensiResponse {
  length: number;
  data: Presensi[];
}

interface TablePresensiProps {
  presensis: PresensiResponse;
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const rowsPerPageOptions = [10, 25, 50, 100]; // Opsi yang valid

const TablePresensi: React.FC<TablePresensiProps> = ({
  presensis,
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(''); 
  const theme = useTheme();

  const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
  const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");
  
  const validRowsPerPage = rowsPerPageOptions.includes(rowsPerPage) ? rowsPerPage : rowsPerPageOptions[0];

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const deletePresensi = async (id_masuk: any, id_keluar: any) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Presensi?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://hris-api.ptspsi.co.id/api/presensi-masuk/${id_masuk}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
        });

        const response2 = await fetch(`https://hris-api.ptspsi.co.id/api/presensi-keluar/${id_keluar}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
          },
        });

        if (response.ok && response2.ok) {
          setAlertMessage('Presensi berhasil dihapus!');
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

  const filteredPresensis = presensis.data.filter((presensi) => {
    const matchesSearch = presensi.companies_user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = !startDate || new Date(presensi.tanggal) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(presensi.tanggal) <= new Date(endDate);
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const paginatedPresensis = filteredPresensis.slice(page * validRowsPerPage, page * validRowsPerPage + validRowsPerPage);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPresensis);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Presensi');
    XLSX.writeFile(workbook, 'Presensi.xlsx');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex' }}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            style={{ marginRight: '16px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            label="Start Date"
            variant="outlined"
            type="date"
            size="small"
            style={{ marginRight: '16px' }}
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            label="End Date"
            variant="outlined"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={exportToExcel} style={{ marginRight: '16px' }}>
            Export to Excel
          </Button>
          <Button variant="contained" color="primary" onClick={handleDrawerOpen}>
            Add New Presensi
          </Button>
        </div>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff' }}>No</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Shift Name</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Name</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Tanggal</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Jam Masuk</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Jam Keluar</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Status Masuk</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Status Keluar</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Keterangan Masuk</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Keterangan Keluar</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Alamat</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPresensis.length > 0 ? (
                paginatedPresensis.map((presensi, index) => (
                  <TableRow key={presensi.id}>
                    <TableCell>{index + 1 + page * validRowsPerPage}</TableCell>
                    <TableCell>{presensi.shift_name}</TableCell>
                    <TableCell>{presensi.companies_user}</TableCell>
                    <TableCell>{presensi.tanggal}</TableCell>
                    <TableCell>{presensi.jam_masuk}</TableCell>
                    <TableCell>{presensi.jam_keluar}</TableCell>
                    <TableCell>{presensi.status_masuk}</TableCell>
                    <TableCell>{presensi.status_keluar}</TableCell>
                    <TableCell>{presensi.keterangan_masuk ? presensi.keterangan_masuk : '-'}</TableCell>
                    <TableCell>{presensi.keterangan_keluar ? presensi.keterangan_keluar : '-'}</TableCell>
                    <TableCell>{presensi.alamat}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => deletePresensi(presensi.presensi_keluar_id, presensi.id)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredPresensis.length}
          rowsPerPage={validRowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <DrawerInputPresensi
        open={openDrawer}
        onClose={handleDrawerClose}
        onSuccess={handleDrawerSuccess}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: '100%', color:'white' , backgroundColor: alertSeverity === 'success' ? 'green' : 'red' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TablePresensi;
