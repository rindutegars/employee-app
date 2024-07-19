import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import Snackbar from './Snackbar'; // Import the Snackbar component
// import Navbar from './Navbar';

const Table = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [snackbar, setSnackbar] = useState({ message: '', type: '' });

    useEffect(() => {
        axios.get('http://localhost:8080/api/employees')
            .then(response => {
                console.log('API response:', response.data);
                setEmployees(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the employees!', error);
                setSnackbar({ message: 'There was an error fetching the employees!', type: 'error' });
            });
    }, []);

    const handleSave = () => {
        const newEmployees = employees.filter(emp => emp.id === null);
        const existingEmployees = employees.filter(emp => emp.id !== null);

        // Handle new employees creation
        const newEmployeesPayload = newEmployees.map(emp => ({
            name: emp.name,
            position: emp.position,
            salary: emp.salary,
        }));

        axios.post('http://localhost:8080/api/employees/create', newEmployeesPayload)
            .then(response => {
                console.log('New employees created:', response.data);
                setEmployees(prevEmployees => [
                    ...prevEmployees.filter(emp => emp.id !== null),
                    ...response.data
                ]);
                setSnackbar({ message: 'New employees added successfully!', type: 'success' });
            })
            .catch(error => {
                console.error('Error creating new employees:', error);
                setSnackbar({ message: 'Error creating new employees!', type: 'error' });
            });

        // Handle existing employees update
        const existingEmployeesPayload = existingEmployees.reduce((acc, emp) => {
            acc[emp.id] = {
                name: emp.name,
                position: emp.position,
                salary: emp.salary,
            };
            return acc;
        }, {});

        axios.put('http://localhost:8080/api/employees/update', existingEmployeesPayload)
            .then(response => {
                console.log('Existing employees updated:', response.data);
                setSnackbar({ message: 'Existing employees updated successfully!', type: 'success' });
            })
            .catch(error => {
                console.error('Error updating existing employees:', error);
                setSnackbar({ message: 'Error updating existing employees!', type: 'error' });
            });
    };

    const handleDelete = () => {
        if (selectedIds.size === 0) return;
    
        // Show confirmation prompt
        const confirmed = window.confirm('Are you sure you want to delete the selected employee(s)?');
    
        if (!confirmed) {
            // If user cancels, do nothing
            return;
        }
    
        const ids = Array.from(selectedIds).join(',');
    
        if (selectedIds.size === 1) {
            axios.delete(`http://localhost:8080/api/employees/delete/${Array.from(selectedIds)[0]}`)
                .then(() => {
                    setEmployees(prevEmployees => prevEmployees.filter(emp => !selectedIds.has(emp.id)));
                    setSelectedIds(new Set());
                    setSnackbar({ message: 'Employee deleted successfully!', type: 'success' });
                })
                .catch(error => {
                    console.error('Error deleting employee:', error);
                    setSnackbar({ message: 'Error deleting employee!', type: 'error' });
                });
        } else {
            axios.delete('http://localhost:8080/api/employees/delete', { params: { ids } })
                .then(() => {
                    setEmployees(prevEmployees => prevEmployees.filter(emp => !selectedIds.has(emp.id)));
                    setSelectedIds(new Set());
                    setSnackbar({ message: 'Employees deleted successfully!', type: 'success' });
                })
                .catch(error => {
                    console.error('Error deleting employees:', error);
                    setSnackbar({ message: 'Error deleting employees!', type: 'error' });
                });
        }
    };
    

    const handleAddRow = () => {
        setEmployees(prevEmployees => [
            ...prevEmployees,
            { id: null, name: '', position: '', salary: '' }
        ]);
    };

    const handleChange = (index, field, value) => {
        setEmployees(prevEmployees => {
            const updatedEmployees = [...prevEmployees];
            updatedEmployees[index] = { ...updatedEmployees[index], [field]: value };
            return updatedEmployees;
        });
    };

    const handleCheckboxChange = (id) => {
        setSelectedIds(prevSelectedIds => {
            const newSelectedIds = new Set(prevSelectedIds);
            if (newSelectedIds.has(id)) {
                newSelectedIds.delete(id);
            } else {
                newSelectedIds.add(id);
            }
            return newSelectedIds;
        });
    };

    const handleSnackbarClose = () => {
        setSnackbar({ message: '', type: '' });
    };

    return (
        <div>
            {/* <Navbar /> */}
            <div className="w-full p-4 relative">
                {snackbar.message && (
                    <Snackbar 
                        message={snackbar.message} 
                        type={snackbar.type} 
                        onClose={handleSnackbarClose} 
                    />
                )}
                <div className="flex justify-end mb-4">
                    <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                        Save
                    </button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
                        Delete
                    </button>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input 
                                            id="checkbox-all-search" 
                                            type="checkbox" 
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            onChange={() => {
                                                if (selectedIds.size === employees.length) {
                                                    setSelectedIds(new Set());
                                                } else {
                                                    setSelectedIds(new Set(employees.map(emp => emp.id)));
                                                }
                                            }}
                                        />
                                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">Employee ID</th>
                                <th scope="col" className="px-6 py-3">Employee Name</th>
                                <th scope="col" className="px-6 py-3">Position</th>
                                <th scope="col" className="px-6 py-3">Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                        {employees.map((employee, index) => (
                            <tr 
                                key={employee.id || `new-${index}`} 
                                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${selectedIds.has(employee.id) ? 'bg-gray-100' : ''}`}
                            >
                                <td className="w-4 p-4">
                                    <div className="flex items-center">
                                        <input
                                            id={`checkbox-table-search-${employee.id || `new-${index}`}`}
                                            type="checkbox"
                                            checked={selectedIds.has(employee.id)}
                                            onChange={() => handleCheckboxChange(employee.id)}
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <label htmlFor={`checkbox-table-search-${employee.id || `new-${index}`}`} className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {employee.id || 'New'}
                                </td>
                                <td className="px-6 py-4 table-cell">
                                    <input
                                        type="text"
                                        value={employee.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        className="input-hidden"
                                        placeholder="Insert Employee Name"
                                    />
                                </td>
                                <td className="px-6 py-4 table-cell">
                                    <input
                                        type="text"
                                        value={employee.position}
                                        onChange={(e) => handleChange(index, 'position', e.target.value)}
                                        className="input-hidden"
                                        placeholder="Insert Position"
                                    />
                                </td>
                                <td className="px-6 py-4 table-cell">
                                    <input
                                        type="text"
                                        value={employee.salary}
                                        onChange={(e) => handleChange(index, 'salary', e.target.value)}
                                        className="input-hidden"
                                        placeholder="Insert Salary"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <button 
                    onClick={handleAddRow} 
                    className="absolute bottom-2 right-2 bg-white border border-blue-500 p-2 rounded-full shadow-lg hover:bg-gray-100"
                >
                    <FaPlus size={20} className="text-blue-500" />
                </button>
            </div>
        </div>
    );
};

export default Table;
