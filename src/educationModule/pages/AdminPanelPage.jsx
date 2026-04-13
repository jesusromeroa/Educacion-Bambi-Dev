import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom'; // NUEVO: Importamos Link
import { loadWhitelistedUsers, addWhitelistedUser, removeWhitelistedUser } from '../../firebase/educationModule/providers';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const AdminPanelPage = () => {
    const { status, email } = useSelector(state => state.auth);
    
    // Definimos los correos autorizados
    const superAdmins = ['admin@admin.com']; 

    // Lógica de validación robusta
    const isSuperAdmin = status === 'authenticated' && 
                         email && 
                         superAdmins.some(adminEmail => adminEmail.toLowerCase() === email.trim().toLowerCase());

    const [users, setUsers] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        setIsLoading(true);
        const resp = await loadWhitelistedUsers();
        if (resp.ok) setUsers(resp.users);
        setIsLoading(false);
    };

    useEffect(() => {
        if (isSuperAdmin) fetchUsers();
    }, [isSuperAdmin]);

    // Si aún estamos comprobando la sesión
    if (status === 'checking') return <div style={{textAlign: 'center', marginTop: '50px'}}>Verificando credenciales...</div>;

    // Si no es admin, lo sacamos
    if (!isSuperAdmin) {
        return <Navigate to="/" />;
    }

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!newEmail || !newEmail.includes('@')) return alert('Ingresa un correo válido');
        await addWhitelistedUser(newEmail, 'profesor');
        setNewEmail('');
        fetchUsers();
    };

    const handleRemoveUser = async (emailToRemove) => {
        const confirm = window.confirm(`¿Seguro que deseas revocar el acceso a ${emailToRemove}?`);
        if (confirm) {
            await removeWhitelistedUser(emailToRemove);
            fetchUsers();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            
            {/* NUEVO: Botón para volver al inicio */}
            <div style={{ marginBottom: '20px' }}>
                <Link 
                    to="/" 
                    style={{ 
                        textDecoration: 'none', 
                        color: '#2e7d32', 
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}
                >
                    &larr; Volver al Inicio
                </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#2e7d32' }}>
                <AdminPanelSettingsIcon fontSize="large" />
                <h1>Panel de Control de Accesos</h1>
            </div>
            
            <p style={{ color: '#666', marginBottom: '30px' }}>
                Solo los correos registrados en esta lista podrán crearse una cuenta como profesores en la plataforma.
            </p>

            <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                <input 
                    type="email" 
                    placeholder="ejemplo@hogarbambi.org" 
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    required
                />
                <button type="submit" style={{ backgroundColor: '#2e7d32', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    + Autorizar Correo
                </button>
            </form>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                {isLoading ? (
                    <p style={{ padding: '20px', textAlign: 'center' }}>Cargando lista...</p>
                ) : users.length === 0 ? (
                    <p style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No hay usuarios autorizados aún.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#2e7d32', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '15px' }}>Correo Electrónico</th>
                                <th style={{ padding: '15px' }}>Rol</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.email} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '15px', fontWeight: '500' }}>{user.email}</td>
                                    <td style={{ padding: '15px', color: '#666' }}>{user.role}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button onClick={() => handleRemoveUser(user.email)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>
                                            <DeleteOutlineIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};