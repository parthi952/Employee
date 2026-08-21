import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Building2, Briefcase, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export interface EmployeeData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number | string;
  status: 'Active' | 'Inactive';
  dateOfJoining: string;
}

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  initialData?: EmployeeData | null;
}

const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
  'Design',
  'Operations',
];

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [formData, setFormData] = useState<EmployeeData>({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    salary: '',
    status: 'Active',
    dateOfJoining: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        dateOfJoining: initialData.dateOfJoining
          ? new Date(initialData.dateOfJoining).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: 'Engineering',
        designation: '',
        salary: '',
        status: 'Active',
        dateOfJoining: new Date().toISOString().split('T')[0],
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.designation.trim() || !formData.salary) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      if (initialData && initialData._id) {
        await api.put(`/employees/${initialData._id}`, formData);
        onSuccess(`Employee ${formData.name} updated successfully!`);
      } else {
        await api.post('/employees', formData);
        onSuccess(`Employee ${formData.name} added successfully!`);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save employee data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0f172a] font-display">
                {initialData ? 'Edit Employee Profile' : 'Add New Employee'}
              </h3>
              <p className="text-[11px] text-[#64748b]">Fill in employee information below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748b] hover:text-[#0f172a] rounded-lg hover:bg-[#e2e8f0] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Department *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Designation / Role *</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Annual Salary ($) *</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="85000"
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Date of Joining *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  name="dateOfJoining"
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#0f172a] mb-1">Status *</label>
              <div className="relative">
                <CheckCircle className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-3 text-xs text-[#0f172a] focus:border-[#0256c4] focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#0256c4] hover:bg-[#0145a3] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialData ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
