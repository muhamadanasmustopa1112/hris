import { useRouter } from 'next/navigation';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    FormLabel,
    Snackbar,
    Alert,
    SelectChangeEvent,
    SnackbarCloseReason,
} from '@mui/material';
import axios from 'axios';
import { Image, CloudUpload } from '@mui/icons-material';
import Cookies from 'js-cookie';

const EditEmployee: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [employeeData, setEmployeeData] = useState<any>(null);
    const [formData, setFormData] = useState<{ [key: string]: any }>({
        _method: 'PUT',
        nik: '',
        no_kk: '',
        name: '',
        gender: '',
        tgl_lahir: '',
        tempat_lahir: '',
        no_hp: '',
        email: '',
        no_hp_darurat: '',
        status: '',
        division_id: '',
        jabatan_id: '',
        alamat: '',
        bpjs_kesehatan: '',
        bpjs_ketenagakerjaan: '',
        npwp: '',
        foto_karyawan: null ,
        ktp_karyawan: null ,
        ijazah_karyawan: null ,
        image_foto_karyawan: null ,
        image_ktp_karyawan: null ,
        image_ijazah_karyawan: null ,

    });
    
    const [divisions, setDivisions] = useState<any[]>([]);
    const [jabatans, setJabatans] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
    const [alertMessage, setAlertMessage] = useState('');
    const router = useRouter();

    const username_api = process.env.NEXT_PUBLIC_API_USERNAME;
    const password_api = process.env.NEXT_PUBLIC_API_PASSWORD;
  
    const basicAuth = Buffer.from(`${username_api}:${password_api}`).toString("base64");
  
    useEffect(() => {
        const fetchDivisions = async () => {

            const userCookie = Cookies.get('user');
            const user = userCookie ? JSON.parse(userCookie) : null;
        
            if (!user || !user.company_id) {
                alert("DATA NOT FOUND!");
              return;
            }
            
            try {

                const response = await axios.get('https://backend-apps.ptspsi.co.id/api/division', {
                    params: {
                      company_id: user.company_id,
                    },
                    headers: {
                        'Authorization': `Basic ${basicAuth}`
                    },
                });

                if (Array.isArray(response.data.data)) {
                    setDivisions(response.data.data);
                } else {
                    console.error('Expected an array, but got:', typeof response.data);
                }
            } catch (error) {
                console.error('Error fetching divisions:', error);
            }
        };

        fetchDivisions();
    }, [basicAuth]);

    useEffect(() => {
        const fetchJabatans = async () => {
    
          const userCookie = Cookies.get('user');
          const user = userCookie ? JSON.parse(userCookie) : null;
      
          if (!user || !user.company_id) {
              alert("DATA NOT FOUND!");
            return;
          }
    
          try {
    
            const response = await axios.get('https://backend-apps.ptspsi.co.id/api/jabatan', {
                params: {
                  company_id: user.company_id,
                },
                headers: {
                    'Authorization': `Basic ${basicAuth}`
                },
            });
    
            if (Array.isArray(response.data.data)) {
              setJabatans(response.data.data);
            } else {
              console.error('Expected an array, but got:', typeof response.data);
            }
          } catch (error) {
            console.error('Error fetching divisions:', error);
          }
        };
    
        fetchJabatans();
      }, [basicAuth]);

      useEffect(() => {
        if (id) {
            const fetchEmployeeDetails = async () => {
                try {
                    const response = await fetch(`https://backend-apps.ptspsi.co.id/api/company-user/${id}`,{
                        method: 'GET',
                        headers: {
                            'Authorization': `Basic ${basicAuth}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setEmployeeData(data);
                    const divisionId = data.data.division_id || '';
                    const isValidDivision = divisions.some(division => division.id === divisionId);

                    setFormData({
                        _method: 'PUT',
                        nik: data.data.nik || '',
                        no_kk: data.data.no_kk || '',
                        name: data.data.name || '',
                        gender: data.data.gender || '',
                        tgl_lahir: data.data.tgl_lahir || '',
                        tempat_lahir: data.data.tempat_lahir || '',
                        no_hp: data.data.no_hp || '',
                        email: data.data.email || '',
                        jabatan: data.data.jabatan || '',
                        no_hp_darurat: data.data.no_hp_darurat || '',
                        status: data.data.status || '',
                        alamat: data.data.alamat || '',
                        bpjs_kesehatan: data.data.bpjs_kesehatan || '',
                        bpjs_ketenagakerjaan: data.data.bpjs_ketenagakerjaan || '',
                        npwp: data.data.npwp || '',
                        division_id: isValidDivision ? divisionId : '',
                        jabatan_id: data.data.jabatan_id || '',
                        image_foto_karyawan: data.data.foto_karyawan || null,
                        image_ktp_karyawan: data.data.ktp_karyawan || null,
                        image_ijazah_karyawan: data.data.ijazah_karyawan || null,
                    });
                } catch (error) {
                    console.error('Error fetching employee details:', error);
                }
            };
            fetchEmployeeDetails();
        }
    }, [id, divisions, basicAuth]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
    
        if (files && files.length > 0) {
            console.log('Selected file:', files[0]);
    
            setFormData((prevData) => {
                const updatedData = {
                    ...prevData,
                    [name]: files[0],
                };
                return updatedData;
            });

            
        } else {
            console.log('No files selected');
        }
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post(`https://backend-apps.ptspsi.co.id/api/company-user/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Basic ${basicAuth}`,
                }
            });
            console.log(formData);
            if(response.status === 200){
                setAlertSeverity('success');
                setAlertMessage('Employee updated successfully!');
                setOpen(true);
            }
       
        } catch (error) {
            if (axios.isAxiosError(error)) {

                const errorMessages = error.response?.data.errors;
                const message = Object.values(errorMessages).flat().join(', ') || 'Terjadi kesalahan';

                setAlertMessage(message);
                setAlertSeverity('error');
                setOpen(true);
                
              } else {
                console.error('Error updated employee:', error);
              }
        }
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleAlertClose = () => {
        setOpen(false);
        router.push('/employees/data-employee');    

    };

    return (
        <Paper style={{ padding: '16px' }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="NIK"
                            variant="outlined"
                            fullWidth
                            name="nik"
                            value={formData.nik || ''} 
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="No KK"
                            variant="outlined"
                            fullWidth
                            name="no_kk"
                            value={formData.no_kk || ''} 
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth required>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleSelectChange}
                                label="Gender"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="Laki-Laki">Laki-Laki</MenuItem>
                                <MenuItem value="Perempuan">Perempuan</MenuItem>
                                <MenuItem value="Lainnya">Lainnya</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tanggal Lahir"
                            variant="outlined"
                            type="date"
                            fullWidth
                            name="tgl_lahir"
                            value={formData.tgl_lahir || ''}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tempat Lahir"
                            variant="outlined"
                            fullWidth
                            name="tempat_lahir"
                            value={formData.tempat_lahir || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="No HP"
                            variant="outlined"
                            fullWidth
                            name="no_hp"
                            value={formData.no_hp || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth required>
                            <InputLabel>Jabatan</InputLabel>
                            <Select
                                name="jabatan_id"
                                value={formData.jabatan_id || ''}
                                onChange={handleSelectChange}
                                label="Jabatan"
                            >
                                {jabatans.map((jabatan) => (
                                    <MenuItem key={jabatan.id} value={jabatan.id}>
                                        {jabatan.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="No HP Darurat"
                            variant="outlined"
                            fullWidth
                            name="no_hp_darurat"
                            value={formData.no_hp_darurat || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth required>
                            <InputLabel>Division</InputLabel>
                            <Select
                                name="division_id"
                                value={formData.division_id || ''}
                                onChange={handleSelectChange}
                                label="Division"
                            >
                                {divisions.map((division) => (
                                    <MenuItem key={division.id} value={division.id}>
                                        {division.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth required>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status || ''}
                                onChange={handleSelectChange}
                                label="Status"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Non Active">Non Active</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Alamat"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            name="alamat"
                            value={formData.alamat || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="BPJS Kesehatan"
                            variant="outlined"
                            fullWidth
                            name="bpjs_kesehatan"
                            value={formData.bpjs_kesehatan || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="BPJS Ketenagakerjaan"
                            variant="outlined"
                            fullWidth
                            name="bpjs_ketenagakerjaan"
                            value={formData.bpjs_ketenagakerjaan || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="NPWP"
                            variant="outlined"
                            fullWidth
                            name="npwp"
                            value={formData.npwp || ''} 
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid container spacing={2} justifyContent="center"  sx={{ marginTop: '20px' }}>
                        <Grid item xs={12} sm={3} display="flex" flexDirection="column" alignItems="center">
                            <FormLabel style={{ marginBottom: '10px' }}>Foto Karyawan:</FormLabel>
                            <Button
                                variant="outlined"
                                href={formData.image_foto_karyawan || ''}
                                startIcon={<Image />}
                                fullWidth
                                sx={{ width: '100%', height: '48px', marginBottom: '20px' }} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                >
                                Preview File
                            </Button>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ width: '100%', height: '48px' }}
                                style={{
                                    marginBottom: '20px',
                                }}
                                >
                                Upload Foto Karyawan
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    name="foto_karyawan"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} display="flex" flexDirection="column" alignItems="center">
                            <FormLabel style={{ marginBottom: '10px' }}>KTP Karyawan:</FormLabel>
                            <Button
                                variant="outlined"
                                href={formData.image_ktp_karyawan || ''}
                                startIcon={<Image />}
                                fullWidth
                                sx={{ width: '100%', height: '48px', marginBottom: '20px' }} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                >
                                Preview File
                            </Button>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ width: '100%', height: '48px' }}
                                style={{
                                    marginBottom: '20px',
                                }}
                                >
                                Upload KTP Karyawan
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    name="ktp_karyawan"
                                    onChange={handleFileChange}                                
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} display="flex" flexDirection="column" alignItems="center">
                            <FormLabel style={{ marginBottom: '10px' }}>Ijazah Karyawan:</FormLabel>
                         
                            <Button
                                variant="outlined"
                                href={formData.image_ijazah_karyawan || ''}
                                startIcon={<Image />}
                                fullWidth
                                sx={{ width: '100%', height: '48px', marginBottom: '20px' }} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                >
                                Preview File
                            </Button>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ width: '100%', height: '48px' }}
                                style={{
                                    marginBottom: '20px',
                                }}
                                >
                                Upload Ijazah Karyawan
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    name="ijazah_karyawan"
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} display="flex" justifyContent="center">
                        <Button type="submit" fullWidth  variant="contained" color="primary" style={{ marginTop: '16px' }}>
                            Update Employee
                        </Button>
                    </Grid>
                </Grid>
            </form>
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
    );
};

export default EditEmployee;