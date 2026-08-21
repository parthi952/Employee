export interface DepartmentTheme {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
}

export const getDepartmentTheme = (department: string = ''): DepartmentTheme => {
  const deptLower = department.toLowerCase();

  if (deptLower.includes('engineering') || deptLower.includes('tech') || deptLower.includes('dev')) {
    return {
      bg: 'bg-[#0256c4]',
      text: 'text-white',
      border: 'border-[#0256c4]',
      badgeBg: 'bg-[#DBEAFE]',
      badgeText: 'text-[#1E40AF]',
      gradient: 'from-[#0256c4] to-[#2563eb]',
    };
  }

  if (deptLower.includes('resource') || deptLower.includes('hr')) {
    return {
      bg: 'bg-[#7c3aed]',
      text: 'text-white',
      border: 'border-[#7c3aed]',
      badgeBg: 'bg-[#F3E8FF]',
      badgeText: 'text-[#6B21A8]',
      gradient: 'from-[#7c3aed] to-[#9333ea]',
    };
  }

  if (deptLower.includes('sales') || deptLower.includes('revenue')) {
    return {
      bg: 'bg-[#059669]',
      text: 'text-white',
      border: 'border-[#059669]',
      badgeBg: 'bg-[#DCFCE7]',
      badgeText: 'text-[#15803D]',
      gradient: 'from-[#059669] to-[#10b981]',
    };
  }

  if (deptLower.includes('marketing') || deptLower.includes('growth')) {
    return {
      bg: 'bg-[#e11d48]',
      text: 'text-white',
      border: 'border-[#e11d48]',
      badgeBg: 'bg-[#FFE4E6]',
      badgeText: 'text-[#BE123C]',
      gradient: 'from-[#e11d48] to-[#f43f5e]',
    };
  }

  if (deptLower.includes('finance') || deptLower.includes('accounting')) {
    return {
      bg: 'bg-[#d97706]',
      text: 'text-white',
      border: 'border-[#d97706]',
      badgeBg: 'bg-[#FEF3C7]',
      badgeText: 'text-[#B45309]',
      gradient: 'from-[#d97706] to-[#f59e0b]',
    };
  }

  if (deptLower.includes('design') || deptLower.includes('product') || deptLower.includes('ux')) {
    return {
      bg: 'bg-[#c026d3]',
      text: 'text-white',
      border: 'border-[#c026d3]',
      badgeBg: 'bg-[#FAE8FF]',
      badgeText: 'text-[#86198F]',
      gradient: 'from-[#c026d3] to-[#d946ef]',
    };
  }

  if (deptLower.includes('operation') || deptLower.includes('support')) {
    return {
      bg: 'bg-[#0284c7]',
      text: 'text-white',
      border: 'border-[#0284c7]',
      badgeBg: 'bg-[#E0F2FE]',
      badgeText: 'text-[#0369A1]',
      gradient: 'from-[#0284c7] to-[#38bdf8]',
    };
  }

  return {
    bg: 'bg-[#0256c4]',
    text: 'text-white',
    border: 'border-[#0256c4]',
    badgeBg: 'bg-[#DBEAFE]',
    badgeText: 'text-[#1E40AF]',
    gradient: 'from-[#0256c4] to-[#2563eb]',
  };
};
