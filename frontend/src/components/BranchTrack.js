import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './styles/branch_track.css'; // Import the CSS file

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({
    branch_name: '',
    checkout_from: '',
    current_stage: '',
    services: [],
    work_type: '',
    agenda: '',
    on_hold: false
  });
  const [editBranch, setEditBranch] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [enums, setEnums] = useState({
    work_types: [],
    current_stages: [],
    services: []
  });

  const fetchEnums = useCallback(async () => {
    try {
      const response = await axios.get('http://0.0.0.0:9000/branch_track/enums/');
      setEnums(response.data);
    } catch (error) {
      toast.error('Failed to fetch enums');
    }
  }, []); // fetchEnums doesn't depend on any variables

  const fetchBranches = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://0.0.0.0:9000/branch_track/`, {
        params: { status: statusFilter },
        headers: { 'Authorization': `${token}` },
      });
      setBranches(response.data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch branches');
    }
  }, [statusFilter]); // fetchBranches depends on statusFilter

  useEffect(() => {
    fetchEnums();
    fetchBranches();
  }, [fetchEnums, fetchBranches]); // include fetchEnums and fetchBranches


  const handleCreateBranch = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://0.0.0.0:9000/branch_track/', newBranch, {
        headers: { 'Authorization': `${token}` },
      });
      fetchBranches();
      setNewBranch({
        branch_name: '',
        checkout_from: '',
        current_stage: '',
        services: [],
        work_type: '',
        agenda: '',
        on_hold: false
      });
      toast.success('Branch created successfully');
    } catch (error) {
      toast.error('Failed to create branch');
    }
  };

  const handleUpdateBranch = async () => {
    if (!editBranch) return;

    try {
      console.log(editBranch)
      const token = localStorage.getItem('access_token');
      await axios.put(`http://0.0.0.0:9000/branch_track/${editBranch.id}`, editBranch, {
        headers: { 'Authorization': `${token}` },
      });
      fetchBranches();
      setEditBranch(null);
      setNewBranch({
        branch_name: '',
        checkout_from: '',
        current_stage: '',
        services: [],
        work_type: '',
        agenda: '',
        on_hold: false
      });
      toast.success('Branch updated successfully');
    } catch (error) {
      toast.error('Failed to update branch');
    }
  };

  const handleDeleteBranch = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://0.0.0.0:9000/branch_track/${id}`, {
        headers: { 'Authorization': `${token}` },
      });
      fetchBranches();
      toast.success('Branch deleted successfully');
    } catch (error) {
      toast.error('Failed to delete branch');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (editBranch) {
      setEditBranch((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    else {
      setNewBranch((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleServicesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    if (editBranch) {
      setEditBranch((prev) => ({
        ...prev,
        services: selectedOptions
      }));
    }
    else {
      setNewBranch((prev) => ({
        ...prev,
        services: selectedOptions
      }));
    }
  };

  useEffect(() => {
    if (editBranch) {
      setNewBranch(editBranch);
    }
  }, [editBranch]);

  return (
    <div className="branches-container">
      <h2>Branches</h2>

      <div className="filter">
        <select value={statusFilter || ''} onChange={(e) => setStatusFilter(e.target.value || null)}>
          <option value="">All Statuses</option>
          <option value="on_going">Ongoing</option>
          <option value="hold">On Hold</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="branch-form">
        <input
          type="text"
          name="branch_name"
          placeholder="Branch Name"
          value={newBranch.branch_name}
          onChange={handleChange}
        />
        <select
          name="checkout_from"
          value={newBranch.checkout_from}
          onChange={handleChange}
        >
          <option value="">Select Checkout From</option>
          <option value="production">Production</option>
          <option value="staging">Staging</option>
        </select>
        <select
          name="current_stage"
          value={newBranch.current_stage}
          onChange={handleChange}
        >
          <option value="">Select Current Stage</option>
          {enums.current_stages.map(stage => (
            <option key={stage} value={stage}>{stage}</option>
          ))}
        </select>
        <select
          name="services"
          multiple
          value={newBranch.services}
          onChange={handleServicesChange}
        >
          {enums.services.map(service => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        <select
          name="work_type"
          value={newBranch.work_type}
          onChange={handleChange}
        >
          <option value="">Select Work Type</option>
          {enums.work_types.map(work_type => (
            <option key={work_type} value={work_type}>{work_type}</option>
          ))}
        </select>
        <textarea
          name="agenda"
          placeholder="Agenda"
          value={newBranch.agenda}
          onChange={handleChange}
        />
        <label>
          On Hold
          <input
            type="checkbox"
            name="on_hold"
            checked={newBranch.on_hold}
            onChange={handleChange}
          />
        </label>
        <button onClick={editBranch ? handleUpdateBranch : handleCreateBranch}>
          {editBranch ? 'Update Branch' : 'Add Branch'}
        </button>
      </div>

      <table className="branch-table">
        <thead>
          <tr>
            <th>Branch Name</th>
            <th>Checkout From</th>
            <th>Current Stage</th>
            <th>Services</th>
            <th>Work Type</th>
            <th>Agenda</th>
            <th>On Hold</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch.id}>
              <td>{branch.branch_name}</td>
              <td>{branch.checkout_from}</td>
              <td>{branch.current_stage}</td>
              <td>{branch.services.join(', ')}</td>
              <td>{branch.work_type}</td>
              <td>{branch.agenda}</td>
              <td>{branch.on_hold ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => setEditBranch(branch)}>Edit</button>
                <button onClick={() => handleDeleteBranch(branch.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Branches;
