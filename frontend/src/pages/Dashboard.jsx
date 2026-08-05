import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Design',
  'Operations'
];

const Dashboard = () => {
  // Lists and stats
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, leave: 0, inactive: 0 });

  // Navigation and pagination
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5); // Fresher standard: show 5 rows per page

  // Sort settings
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Form toggles and states
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    dateOfJoining: '',
    status: 'Active'
  });
  
  // Validation errors
  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Helper for displaying toast alert
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.getEmployees({
        page: currentPage,
        limit,
        search,
        department: selectedDept,
        status: selectedStatus,
        sortField,
        sortOrder
      });
      if (response.success) {
        setEmployees(response.employees);
        setTotalPages(response.pagination.pages);
        if (response.stats) {
          setStats(response.stats);
        }
      }
    } catch (err) {
      showToast(err.message || 'Error loading employee data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when dependencies update
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, selectedDept, selectedStatus, sortField, sortOrder]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEmployees();
  };

  // Handle Sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Client-side validations
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.department) errs.department = 'Department is required';
    if (!formData.position.trim()) errs.position = 'Job position is required';
    if (!formData.salary) errs.salary = 'Salary figure is required';
    if (!formData.dateOfJoining) errs.dateOfJoining = 'Hiring date is required';
    
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit Handler (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingEmployee) {
        // Edit API call
        await api.updateEmployee(editingEmployee._id, formData);
        showToast('Employee updated successfully!');
      } else {
        // Create API call
        await api.createEmployee(formData);
        showToast('Employee created successfully!');
      }
      // Reset form and back to list
      setShowForm(false);
      setEditingEmployee(null);
      setCurrentPage(1);
      fetchEmployees();
    } catch (err) {
      if (err.errors) {
        setFormErrors(err.errors);
        showToast('Form validation failed!', 'error');
      } else {
        showToast(err.message || 'An error occurred', 'error');
      }
    }
  };

  // Edit employee trigger
  const handleEditClick = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || '',
      position: emp.position || '',
      salary: emp.salary || '',
      dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : '',
      status: emp.status || 'Active'
    });
    setFormErrors({});
    setShowForm(true);
  };

  // Delete employee trigger
  const handleDeleteClick = (emp) => {
    setEmployeeToDelete(emp);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await api.deleteEmployee(employeeToDelete._id);
      showToast('Employee record deleted successfully!');
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (err) {
      showToast(err.message || 'Failed to delete employee', 'error');
    }
  };

  // Add employee trigger
  const handleAddClick = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      salary: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      status: 'Active'
    });
    setFormErrors({});
    setShowForm(true);
  };

  return (
    <div className="container">
      {toast && (
        <div className={`toast-msg ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.message}
        </div>
      )}

      <header>
        <h1>Employee Registry Portal</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={handleAddClick}>
            + Add Employee
          </button>
        )}
      </header>

      {showForm ? (
        /* Form View */
        <div className="form-card">
          <h2>{editingEmployee ? 'Edit Employee Info' : 'New Employee Registration'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              
              <div className="form-group full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
                {formErrors.name && <div className="error-msg">{formErrors.name}</div>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@company.com"
                />
                {formErrors.email && <div className="error-msg">{formErrors.email}</div>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 555-0199"
                />
                {formErrors.phone && <div className="error-msg">{formErrors.phone}</div>}
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {formErrors.department && <div className="error-msg">{formErrors.department}</div>}
              </div>

              <div className="form-group">
                <label>Job Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Software Engineer"
                />
                {formErrors.position && <div className="error-msg">{formErrors.position}</div>}
              </div>

              <div className="form-group">
                <label>Annual Salary (USD)</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="75000"
                />
                {formErrors.salary && <div className="error-msg">{formErrors.salary}</div>}
              </div>

              <div className="form-group">
                <label>Date of Joining</label>
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleInputChange}
                />
                {formErrors.dateOfJoining && <div className="error-msg">{formErrors.dateOfJoining}</div>}
              </div>

              {editingEmployee && (
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}

            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Employee
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* List View */
        <>
          {/* Stats Bar */}
          <section className="stats-container">
            <div className="stat-card">
              <div className="stat-title">Headcount</div>
              <div className="stat-number">{stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Active Staff</div>
              <div className="stat-number" style={{ color: '#137333' }}>{stats.active}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">On Leave</div>
              <div className="stat-number" style={{ color: '#b06000' }}>{stats.leave}</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Inactive</div>
              <div className="stat-number" style={{ color: '#c5221f' }}>{stats.inactive}</div>
            </div>
          </section>

          {/* Filters and search */}
          <div className="controls">
            <form onSubmit={handleSearchSubmit} className="search-bar">
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-secondary">Search</button>
            </form>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
                className="filter-select"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table display */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading employee registry...</div>
          ) : employees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', border: '1px dashed #ccc', borderRadius: '4px' }}>
              <h3>No Employees Found</h3>
              <p>Try modifying your search or filters.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>Name {sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th onClick={() => handleSort('department')}>Department {sortField === 'department' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th onClick={() => handleSort('position')}>Position {sortField === 'position' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th onClick={() => handleSort('salary')}>Salary {sortField === 'salary' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th onClick={() => handleSort('dateOfJoining')}>Hired Date {sortField === 'dateOfJoining' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                    <th>Status</th>
                    <th style={{ width: '130px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td style={{ fontWeight: '600' }}>{emp.name}</td>
                      <td>{emp.department}</td>
                      <td>{emp.position}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>${emp.salary.toLocaleString()}</td>
                      <td>{new Date(emp.dateOfJoining).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${
                          emp.status === 'Active' ? 'status-active' :
                          emp.status === 'On Leave' ? 'status-leave' : 'status-inactive'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(emp)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(emp)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="pagination">
                <div>
                  Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
                </div>
                <div className="pagination-buttons">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Custom Confirmation Modal */}
      {employeeToDelete && (
        <div className="modal-overlay">
          <div className="form-card" style={{ maxWidth: '440px', textAlign: 'center', padding: '25px' }}>
            <h2 style={{ color: '#d93025', marginBottom: '15px' }}>Confirm Deletion</h2>
            <p style={{ color: '#5f6368', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
              Are you sure you want to delete the record for <strong>{employeeToDelete.name}</strong>? This action is permanent and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setEmployeeToDelete(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
