import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { EmployeeData } from './EmployeeFormModal';
import { getDepartmentTheme } from '../utils/departmentColors';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  DollarSign, 
  Calendar,
  Edit3, 
  Trash2 
} from 'lucide-react';

interface EmployeeDetailsProps {
  onEdit: (employee: EmployeeData) => void;
  onDeleteRequest: (id: string, name: string) => void;
}

export const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ onEdit, onDeleteRequest }) => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails(id);
    }
  }, [id]);

  const fetchEmployeeDetails = async (empId: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/employees/${empId}`);
      setEmployee(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Employee not found.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-36 rounded skeleton-shimmer"></div>
        <div className="bg-white rounded-2xl p-8 space-y-6 border border-[#e2e8f0]">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl skeleton-shimmer"></div>
            <div className="space-y-3">
              <div className="h-6 w-48 rounded skeleton-shimmer"></div>
              <div className="h-4 w-32 rounded skeleton-shimmer"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="h-20 rounded-xl skeleton-shimmer"></div>
            <div className="h-20 rounded-xl skeleton-shimmer"></div>
            <div className="h-20 rounded-xl skeleton-shimmer"></div>
            <div className="h-20 rounded-xl skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 bg-white rounded-2xl border border-rose-200">
        <p className="text-rose-600 font-semibold">{error || 'Employee profile not found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-[#0256c4] hover:bg-[#0145a3] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const deptTheme = getDepartmentTheme(employee.department);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[#64748b] hover:text-[#0f172a] transition text-xs font-bold tracking-wider uppercase cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#0256c4]" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/40 p-8 border-b border-[#e2e8f0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#0256c4] text-white flex items-center justify-center font-bold text-3xl font-display shadow-lg shrink-0">
              {employee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight font-display">{employee.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                    employee.status === 'Active'
                      ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
                      : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${employee.status === 'Active' ? 'bg-[#16a34a] animate-pulse' : 'bg-[#dc2626]'}`} />
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-[#0256c4] font-bold mt-1">{employee.designation}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${deptTheme.badgeBg} ${deptTheme.badgeText} border ${deptTheme.border}`}>
                  {employee.department} Department
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(employee)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#f8fafc] border border-[#cbd5e1] text-[#0f172a] text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              <Edit3 className="w-4 h-4 text-[#d97706]" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => onDeleteRequest(employee._id!, employee.name)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#ffe4e6] hover:bg-[#fecdd3] border border-[#fecdd3] text-[#be123c] text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              <Trash2 className="w-4 h-4 text-[#be123c]" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">Email Address</span>
              <p className="text-xs font-semibold text-[#0f172a] mt-1">{employee.email}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#f3e8ff] text-[#7c3aed] border border-[#e9d5ff]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">Phone Number</span>
              <p className="text-xs font-semibold text-[#0f172a] mt-1">{employee.phone}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-4">
            <div className={`p-2.5 rounded-lg ${deptTheme.badgeBg} ${deptTheme.badgeText} border ${deptTheme.border}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">Department</span>
              <p className="text-xs font-semibold text-[#0f172a] mt-1">{employee.department}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#dbeafe] text-[#1e40af] border border-[#bfdbfe]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">Designation</span>
              <p className="text-xs font-semibold text-[#0f172a] mt-1">{employee.designation}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#fef3c7] text-[#d97706] border border-[#fde68a]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">Annual Compensation</span>
              <p className="text-xs font-extrabold text-[#0f172a] font-display mt-1">{formatCurrency(employee.salary)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-[#64748b] font-bold uppercase tracking-wider">Date of Joining</span>
              <p className="text-xs font-semibold text-[#0f172a] mt-1">{formatDate(employee.dateOfJoining)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
