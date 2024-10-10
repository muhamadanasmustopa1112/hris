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

interface Employee {
  id: number;
  nik: string;
  name: string;
  jabatan: string;
  no_hp: string;
  email: string;
  qr_code: string;
  ktp_karyawan: string;
}

interface EmployeesResponse {
  length: number;
  data: Employee[];
}

interface TableEmployeeProps {
  employees: EmployeesResponse;
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TableEmployee: React.FC<TableEmployeeProps> = ({
  employees,
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

  const [searchTerm, setSearchTerm] = useState<string>('');
  const theme = useTheme();
  const router = useRouter();


  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  const deleteEmployee = async (id: any) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/company-user/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          setAlertMessage('Karyawan berhasil dihapus!');
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
   
    router.push(`/employees/edit-employee/${id}`);
    console.log(`Editing employee with ID: ${id}`);
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
    router.refresh();

  };

  const filteredEmployees = employees.data.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const paginatedEmployees = filteredEmployees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <Button variant="contained" color="primary" onClick={() => {router.push('/employees/input-employee')}}>
          Add New Karyawan
        </Button>
      </div>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ color: '#ffffff' }}>No</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>NIK</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Name</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Jabatan</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>No HP</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Email</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>QR Code</TableCell>
                <TableCell sx={{ color: '#ffffff' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.map((employee, index) => (
                <TableRow key={employee.nik}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{employee.nik}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.jabatan}</TableCell>
                  <TableCell>{employee.no_hp}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <img src={employee.qr_code} alt="QR Code" style={{ width: '100px', height: '100px' }} />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => { handleEdit(employee.id)}} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {deleteEmployee(employee.id)}} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEmployees.length}
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

export default TableEmployee;
