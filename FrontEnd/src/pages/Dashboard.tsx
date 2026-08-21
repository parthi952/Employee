import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import type { EmployeeData } from './EmployeeFormModal';
import { Pagination } from '../components/Pagination';
import { StatCardSkeleton, TableSkeleton } from '../components/Skeletons';
import { getDepartmentTheme } from '../utils/departmentColors';
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign, 
  TrendingUp, 
  UserPlus,
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Building2, 
  AlertTriangle,
  ArrowUpDown,
  X,
  RotateCcw
} from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalSalary: number;
}

interface DashboardProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (employee: EmployeeData) => void;
  toastMessage?: string;
}

const DEPARTMENTS = [
  'All',
  'Engineering',
  'Human Resources',
  'Sales',
  'Marketing',
  'Finance',
  'Design',
  'Operations',
];

type SortField = 'name' | 'department' | 'designation' | 'salary' | 'status';
type SortOrder = 'asc' | 'desc';

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenAddModal,
  onOpenEditModal,
  toastMessage = '',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  // Stats State
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<string>('');

  // Table State
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const isFirstTableLoad = useRef<boolean>(true);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [isTableFetching, setIsTableFetching] = useState<boolean>(false);

  // Search & Filter state
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [department, setDepartment] = useState<string>('All');
  const [status, setStatus] = useState<string>('All');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);

  const navigate = useNavigate();

  // Fetch Dashboard Stats independently
  const fetchDashboardStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err: any) {
      setStatsError('Failed to load metrics.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats, toastMessage]);

  // Debounce Search Input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  // Fetch Employee Table Data
  const fetchEmployees = useCallback(async () => {
    try {
      if (isFirstTableLoad.current) {
        setTableLoading(true);
      } else {
        setIsTableFetching(true);
      }

      const res = await api.get('/employees', {
        params: {
          page,
          limit,
          search: debouncedSearch,
          department: department === 'All' ? '' : department,
          status: status === 'All' ? '' : status,
        },
      });

      setEmployees(res.data.employees || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      console.error('Failed to fetch employees', err);
    } finally {
      setTableLoading(false);
      setIsTableFetching(false);
      isFirstTableLoad.current = false;
    }
  }, [page, limit, debouncedSearch, department, status]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    let aVal: any = a[sortField] || '';
    let bVal: any = b[sortField] || '';

    if (sortField === 'salary') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else {
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/employees/${deleteId}`);
      setDeleteId(null);
      fetchEmployees();
      fetchDashboardStats();
    } catch (err: any) {
      console.error('Delete failed', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setDepartment('All');
    setStatus('All');
    setPage(1);
    setSearchParams({});
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const activePercent = stats?.totalEmployees
    ? Math.round(((stats.activeEmployees || 0) / stats.totalEmployees) * 100)
    : 0;

  const inactivePercent = stats?.totalEmployees
    ? Math.round(((stats.inactiveEmployees || 0) / stats.totalEmployees) * 100)
    : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Light Corporate Stat Cards Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : statsError ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{statsError}</span>
          <button onClick={fetchDashboardStats} className="text-[#0256c4] underline font-semibold">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1: Total Workforce */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-sm transition group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                TOTAL WORKFORCE
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center">
                <Users className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <h3 className="text-3xl font-extrabold text-[#0f172a] font-display">
                  {stats?.totalEmployees || 0}
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#0284c7]" />
                  <span>Active headcount</span>
                </p>
              </div>
              <div className="flex items-end gap-1 h-7 text-[#0256c4]">
                <div className="w-1.5 h-3 bg-[#bfdbfe] rounded-t"></div>
                <div className="w-1.5 h-5 bg-[#60a5fa] rounded-t"></div>
                <div className="w-1.5 h-4 bg-[#3b82f6] rounded-t"></div>
                <div className="w-1.5 h-7 bg-[#0256c4] rounded-t"></div>
              </div>
            </div>
          </div>

          {/* Stat 2: Active Ratio */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-sm transition group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                ACTIVE RATIO
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#0284c7] border border-[#bae6fd] flex items-center justify-center">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-extrabold text-[#0f172a] font-display">
                  {stats?.activeEmployees || 0}
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  <strong className="text-[#0256c4] font-semibold">{activePercent}%</strong> operational rate
                </p>
              </div>
              <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#e2e8f0]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#0256c4]"
                    strokeDasharray={`${activePercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#0f172a]">{activePercent}%</span>
              </div>
            </div>
          </div>

          {/* Stat 3: Inactive / On Leave */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-sm transition group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                INACTIVE / ON LEAVE
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] border border-[#fde68a] flex items-center justify-center">
                <UserX className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-extrabold text-[#d97706] font-display">
                  {stats?.inactiveEmployees || 0}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#fef3c7] text-[#b45309] border border-[#fde68a] uppercase">
                  {inactivePercent}% INACTIVE
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#d97706] transition-all duration-500" 
                  style={{ width: `${inactivePercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stat 4: Total Salary Payout */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-xs hover:shadow-sm transition group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                TOTAL SALARY PAYOUT
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0] flex items-center justify-center">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-[#0f172a] font-display truncate">
                  {formatCurrency(stats?.totalSalary || 0)}
                </h3>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Annual combined compensation
                </p>
              </div>
              <div className="flex items-end gap-1 h-7 text-[#64748b]">
                <div className="w-1.5 h-3 bg-[#cbd5e1] rounded-t"></div>
                <div className="w-1.5 h-5 bg-[#94a3b8] rounded-t"></div>
                <div className="w-1.5 h-4 bg-[#64748b] rounded-t"></div>
                <div className="w-1.5 h-7 bg-[#475569] rounded-t"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Employee Directory Section in Clean White Container */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs space-y-5">
        {/* Controls Toolbar Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee, email, role..."
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl py-2 pl-9 pr-8 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0256c4] focus:bg-white focus:outline-none transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#0f172a]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-3 py-1.5 text-xs text-[#0f172a]">
              <Filter className="w-3.5 h-3.5 text-[#0256c4] shrink-0" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-transparent text-xs text-[#0f172a] border-none focus:outline-none cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} className="bg-white text-[#0f172a]">
                    {dept === 'All' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-1 text-xs">
              <button
                onClick={() => setStatus('All')}
                className={`px-3 py-1 rounded-lg transition text-[11px] font-bold ${
                  status === 'All'
                    ? 'bg-[#0256c4] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatus('Active')}
                className={`px-3 py-1 rounded-lg transition text-[11px] font-bold ${
                  status === 'Active'
                    ? 'bg-[#0256c4] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatus('Inactive')}
                className={`px-3 py-1 rounded-lg transition text-[11px] font-bold ${
                  status === 'Inactive'
                    ? 'bg-[#0256c4] text-white shadow-xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Inactive
              </button>
            </div>

            {(search || department !== 'All' || status !== 'All') && (
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-2 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] text-[#64748b] hover:text-[#0f172a] transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#0256c4] hover:bg-[#0145a3] text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer border border-[#0256c4]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Employee Data Table */}
        <div className="border border-[#e2e8f0] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0f172a]">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] uppercase font-bold text-[#64748b] tracking-wider">
                <tr>
                  <th 
                    onClick={() => handleSort('name')}
                    className="py-3.5 px-6 cursor-pointer hover:text-[#0f172a] transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Employee</span>
                      <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('department')}
                    className="py-3.5 px-6 cursor-pointer hover:text-[#0f172a] transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Department</span>
                      <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('designation')}
                    className="py-3.5 px-6 cursor-pointer hover:text-[#0f172a] transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role / Designation</span>
                      <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('salary')}
                    className="py-3.5 px-6 cursor-pointer hover:text-[#0f172a] transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Salary</span>
                      <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                    </div>
                  </th>

                  <th 
                    onClick={() => handleSort('status')}
                    className="py-3.5 px-6 cursor-pointer hover:text-[#0f172a] transition"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-[#94a3b8]" />
                    </div>
                  </th>

                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className={`divide-y divide-[#f1f5f9] transition-opacity duration-200 ${isTableFetching ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                {tableLoading && isFirstTableLoad.current ? (
                  <tr>
                    <td colSpan={6}>
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : sortedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#f1f5f9] text-[#64748b] flex items-center justify-center mx-auto mb-3 border border-[#cbd5e1]">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-[#0f172a] font-display">No employees found</p>
                      <p className="text-xs text-[#64748b] mt-1 max-w-sm mx-auto">
                        No staff records matched your criteria. Try adjusting your search query or filter options.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-4 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0256c4] text-xs font-semibold rounded-xl border border-[#cbd5e1] transition cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  sortedEmployees.map((emp) => {
                    const theme = getDepartmentTheme(emp.department);

                    return (
                      <tr key={emp._id} className="hover:bg-[#f8fafc] transition duration-150 group border-b border-[#f1f5f9]">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#0256c4] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#0f172a] group-hover:text-[#0256c4] transition text-xs">{emp.name}</p>
                              <p className="text-[11px] text-[#64748b]">{emp.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-6">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${theme.badgeBg} ${theme.badgeText} border ${theme.border}`}>
                            {emp.department}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 font-medium text-[#334155]">
                          {emp.designation}
                        </td>

                        <td className="py-3.5 px-6 font-extrabold text-[#0f172a] font-display">
                          {formatCurrency(emp.salary)}
                        </td>

                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              emp.status === 'Active'
                                ? 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]'
                                : 'bg-[#fee2e2] text-[#b91c1c] border-[#fecaca]'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'Active' ? 'bg-[#16a34a] animate-pulse' : 'bg-[#dc2626]'}`} />
                            {emp.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/employees/${emp._id}`)}
                              title="View Profile"
                              className="p-1.5 text-[#64748b] hover:text-[#0256c4] hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onOpenEditModal(emp)}
                              title="Edit Profile"
                              className="p-1.5 text-[#64748b] hover:text-[#d97706] hover:bg-[#f1f5f9] rounded-lg transition cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(emp._id!);
                                setDeleteName(emp.name);
                              }}
                              title="Delete Employee"
                              className="p-1.5 text-[#64748b] hover:text-[#e11d48] hover:bg-[#ffe4e6] rounded-lg transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pages={pages}
            total={total}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#e11d48]">
              <div className="p-2.5 rounded-xl bg-[#ffe4e6] border border-[#fecdd3]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0f172a] font-display">Confirm Employee Removal</h3>
            </div>
            <p className="text-xs text-[#334155] leading-relaxed">
              Are you sure you want to remove <strong className="text-[#0f172a]">{deleteName}</strong> from the database? This action is permanent.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#334155] text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white text-xs font-semibold shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Removing...' : 'Delete Employee'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
