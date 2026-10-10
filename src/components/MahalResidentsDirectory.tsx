import React, { useState, useMemo } from 'react';
import {
  Users,
  Home,
  Search,
  Filter,
  Phone,
  MessageSquare,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Download,
  Printer,
  PlusCircle,
  ShieldCheck,
  HeartHandshake,
  Calendar,
  MapPin,
  Building2,
  Clock,
  Coins,
  AlertCircle,
  ExternalLink,
  Edit3,
  X,
  UserCheck
} from 'lucide-react';
import { MahalResident, FamilyMember, HistoricalAidEntry } from '../types';

interface MahalResidentsDirectoryProps {
  onBack?: () => void;
  onOpenApplicationWithResident?: (resident: MahalResident) => void;
  isNewAccount?: boolean;
}

const INITIAL_RESIDENTS: MahalResident[] = [
  {
    id: 'MHL-084',
    householdId: 'HH-142',
    fullName: 'Muhammed Shafi',
    age: 48,
    gender: 'M',
    isHeadOfHousehold: true,
    houseName: 'Darul Aman House',
    houseNumber: '3/184',
    ward: 'Ward 3',
    phone: '+91 98471 28910',
    whatsapp: '919847128910',
    address: 'Near Old Market Post, Ward 3, Juma Masjid Mahallu',
    occupation: 'Daily Wage Carpenter',
    education: 'Secondary School (SSLC)',
    dateOfBirth: '1978-04-12',
    zakatClassification: 'Eligible for Zakat',
    quranicCategory: 'Al-Fuqara',
    incomeBracket: '< ₹12,000 / month',
    specialConsiderations: [
      'Chronic Diabetic Retinopathy requiring monthly medication',
      'Irregular seasonal construction labor'
    ],
    familyMembers: [
      { id: 'FM-1', name: 'Muhammed Shafi', relation: 'Self (Head)', age: 48, gender: 'Male', maritalStatus: 'Married', occupation: 'Carpenter' },
      { id: 'FM-2', name: 'Suhara Shafi', relation: 'Spouse', age: 44, gender: 'Female', maritalStatus: 'Married', occupation: 'Homemaker' },
      { id: 'FM-3', name: 'Bilal Shafi', relation: 'Son', age: 16, gender: 'Male', maritalStatus: 'Unmarried', occupation: 'Student (Class 11)' },
      { id: 'FM-4', name: 'Ayesha Shafi', relation: 'Daughter', age: 13, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'Student (Class 8)' },
    ],
    aidHistory: [
      { id: 'AID-901', date: '2026-03-14', category: 'Medical Aid', amount: 4500, signatory: 'Hafiz Usman (Trustee)', receiptNumber: 'TZK-MHL-MED-901', purpose: 'Insulin and eye clinic therapy support' },
      { id: 'AID-842', date: '2025-04-02', category: 'Ramzan Ration Kit', amount: 3200, signatory: 'President, Juma Masjid', receiptNumber: 'TZK-MHL-RMN-842', purpose: 'Essential staple groceries kit' },
    ],
    verificationStatus: 'Verified by Trustee',
    lastCensusDate: '2026-08-15',
    notes: 'Elderly mother visits during monsoon. High priority for Mahallu medical fund subsidies.',
  },
  {
    id: 'MHL-012',
    householdId: 'HH-089',
    fullName: 'Sister Zainaba Beevi',
    age: 42,
    gender: 'F',
    isHeadOfHousehold: true,
    houseName: 'Baitul Noor',
    houseNumber: '3/092',
    ward: 'Ward 3',
    phone: '+91 94462 81092',
    whatsapp: '919446281092',
    address: 'Noor Street, Ward 3, Juma Masjid Mahallu',
    occupation: 'Home Tailoring / Seamstress',
    education: 'Higher Secondary',
    dateOfBirth: '1984-11-05',
    zakatClassification: 'Eligible for Zakat',
    quranicCategory: 'Al-Masakin',
    incomeBracket: '< ₹8,000 / month',
    specialConsiderations: [
      'Husband passed away in 2024 (Cardiac failure)',
      'Sole earner for 3 school-going children'
    ],
    familyMembers: [
      { id: 'FM-5', name: 'Sister Zainaba Beevi', relation: 'Self (Head)', age: 42, gender: 'Female', maritalStatus: 'Widowed', occupation: 'Tailoring' },
      { id: 'FM-6', name: 'Fathima Nihala', relation: 'Daughter', age: 14, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'Student (Class 9)' },
      { id: 'FM-7', name: 'Zayan Ahmed', relation: 'Son', age: 11, gender: 'Male', maritalStatus: 'Unmarried', occupation: 'Student (Class 6)' },
      { id: 'FM-8', name: 'Mariyam Beevi', relation: 'Daughter', age: 8, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'Student (Class 3)' },
    ],
    aidHistory: [
      { id: 'AID-915', date: '2026-06-10', category: 'Education Support', amount: 12000, signatory: 'Education Convenor', receiptNumber: 'TZK-MHL-EDU-915', purpose: 'Annual school fees & textbooks challan' },
      { id: 'AID-870', date: '2025-11-20', category: 'Widow Support', amount: 6000, signatory: 'Treasurer, Mahallu', receiptNumber: 'TZK-MHL-WDW-870', purpose: 'Home sewing material roll stipend' },
    ],
    verificationStatus: 'Verified by Trustee',
    lastCensusDate: '2026-09-01',
    notes: 'Active beneficiary under the Mahallu Orphan & Widow Care Wing. Dependents are high-ranking students.',
  },
  {
    id: 'MHL-105',
    householdId: 'HH-214',
    fullName: 'Haji Abdul Rahman K.',
    age: 58,
    gender: 'M',
    isHeadOfHousehold: true,
    houseName: 'Al-Barakah Manzil',
    houseNumber: '2/441',
    ward: 'Ward 2',
    phone: '+91 98950 44211',
    whatsapp: '919895044211',
    address: 'East Crescent Road, Ward 2, Juma Masjid Mahallu',
    occupation: 'Hardware Merchant & Business Owner',
    education: 'Graduate (B.Com)',
    dateOfBirth: '1968-02-28',
    zakatClassification: 'Active Contributor / Donor',
    quranicCategory: 'General',
    incomeBracket: '> ₹80,000 / month',
    specialConsiderations: [
      'Regular Mahallu Zakat & Sadaqah donor',
      'Provides voluntary audit consultation to the committee'
    ],
    familyMembers: [
      { id: 'FM-9', name: 'Haji Abdul Rahman K.', relation: 'Self (Head)', age: 58, gender: 'Male', maritalStatus: 'Married', occupation: 'Merchant' },
      { id: 'FM-10', name: 'Jameela Rahman', relation: 'Spouse', age: 52, gender: 'Female', maritalStatus: 'Married', occupation: 'Homemaker' },
      { id: 'FM-11', name: 'Er. Salman Rahman', relation: 'Son', age: 27, gender: 'Male', maritalStatus: 'Married', occupation: 'Civil Engineer (UAE)' },
      { id: 'FM-12', name: 'Dr. Afreen Rahman', relation: 'Daughter', age: 24, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'Medical Resident' },
    ],
    aidHistory: [],
    verificationStatus: 'Annual Census Updated',
    lastCensusDate: '2026-07-20',
    notes: 'Key community benefactor. Paid ₹45,000 directly to Mahallu Zakat Fund in Ramadan 2026.',
  },
  {
    id: 'MHL-219',
    householdId: 'HH-312',
    fullName: 'Khadija Parveen',
    age: 21,
    gender: 'F',
    isHeadOfHousehold: false,
    houseName: 'Gulshan Villa',
    houseNumber: '3/058',
    ward: 'Ward 3',
    phone: '+91 85901 32910',
    whatsapp: '918590132910',
    address: 'Near Government High School, Ward 3',
    occupation: 'Student (Final Year B.Sc Chemistry)',
    education: 'Undergraduate',
    dateOfBirth: '2005-08-19',
    zakatClassification: 'Eligible for Zakat',
    quranicCategory: 'Al-Masakin',
    incomeBracket: '< ₹6,000 / month',
    specialConsiderations: [
      'Orphan student (Lives with elderly maternal aunt)',
      'Awaiting semester final exam fee payment'
    ],
    familyMembers: [
      { id: 'FM-13', name: 'Khadija Parveen', relation: 'Self (Head)', age: 21, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'College Student' },
      { id: 'FM-14', name: 'Maimoona Beevi', relation: 'Elderly Dependent', age: 67, gender: 'Female', maritalStatus: 'Widowed', occupation: 'Retired' },
    ],
    aidHistory: [
      { id: 'AID-930', date: '2026-09-18', category: 'Education Support', amount: 12000, signatory: 'Ward 3 Convenor', receiptNumber: 'TZK-MHL-EDU-930', purpose: 'Degree semester examination fee grant' },
    ],
    verificationStatus: 'Verified by Trustee',
    lastCensusDate: '2026-09-15',
    notes: 'Consistently holds distinction grades in college. Eligible for ongoing scholarship support.',
  },
  {
    id: 'MHL-045',
    householdId: 'HH-054',
    fullName: 'Moideen Kutty Haji',
    age: 72,
    gender: 'M',
    isHeadOfHousehold: true,
    houseName: 'Firdous House',
    houseNumber: '1/112',
    ward: 'Ward 1',
    phone: '+91 94470 19283',
    whatsapp: '919447019283',
    address: 'Mosque Road West, Ward 1, Juma Masjid Mahallu',
    occupation: 'Retired Government School Clerk',
    education: 'Graduate',
    dateOfBirth: '1954-06-15',
    zakatClassification: 'General Resident',
    quranicCategory: 'General',
    incomeBracket: '₹22,000 / month (Pension)',
    specialConsiderations: [
      'Senior Citizen with arthritis mobility limitation',
      'Independent pension suffices basic expenses'
    ],
    familyMembers: [
      { id: 'FM-15', name: 'Moideen Kutty Haji', relation: 'Self (Head)', age: 72, gender: 'Male', maritalStatus: 'Married', occupation: 'Pensioner' },
      { id: 'FM-16', name: 'Kadeeja Kutty', relation: 'Spouse', age: 68, gender: 'Female', maritalStatus: 'Married', occupation: 'Homemaker' },
    ],
    aidHistory: [],
    verificationStatus: 'Annual Census Updated',
    lastCensusDate: '2026-06-10',
    notes: 'Elderly resident of the Mahallu for 50+ years. Self-sufficient household.',
  },
  {
    id: 'MHL-168',
    householdId: 'HH-288',
    fullName: 'Muhammad Basheer K.',
    age: 51,
    gender: 'M',
    isHeadOfHousehold: true,
    houseName: 'Rahmath Manzil',
    houseNumber: '3/220',
    ward: 'Ward 3',
    phone: '+91 97452 61099',
    whatsapp: '919745261099',
    address: 'Old Market Lane, Ward 3, Juma Masjid Mahallu',
    occupation: 'Small Stationery Stall Owner',
    education: 'Matriculation',
    dateOfBirth: '1975-01-30',
    zakatClassification: 'Eligible for Zakat',
    quranicCategory: 'Al-Gharimin',
    incomeBracket: '< ₹15,000 / month',
    specialConsiderations: [
      'Flash flood inventory losses of ₹35,000',
      'Supplier debt due; interest-free rehabilitation needed'
    ],
    familyMembers: [
      { id: 'FM-17', name: 'Muhammad Basheer K.', relation: 'Self (Head)', age: 51, gender: 'Male', maritalStatus: 'Married', occupation: 'Stall Owner' },
      { id: 'FM-18', name: 'Naseema Basheer', relation: 'Spouse', age: 46, gender: 'Female', maritalStatus: 'Married', occupation: 'Homemaker' },
      { id: 'FM-19', name: 'Shakir Basheer', relation: 'Son', age: 19, gender: 'Male', maritalStatus: 'Unmarried', occupation: 'Diploma Student' },
      { id: 'FM-20', name: 'Shifa Basheer', relation: 'Daughter', age: 15, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'Student (Class 10)' },
      { id: 'FM-21', name: 'Shaniba Basheer', relation: 'Daughter', age: 12, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'Student (Class 7)' },
    ],
    aidHistory: [
      { id: 'AID-941', date: '2026-10-01', category: 'Al-Gharimin Debt Relief', amount: 20000, signatory: 'Ward Field Auditor', receiptNumber: 'TZK-MHL-GHR-941', purpose: 'Supplier challan partial settlement' },
    ],
    verificationStatus: 'Verified by Trustee',
    lastCensusDate: '2026-10-02',
    notes: 'Case audited by Hafiz Usman. Micro-loan or zakat relief granted for business stabilization.',
  },
  {
    id: 'MHL-310',
    householdId: 'HH-401',
    fullName: 'Dr. Anas Ahmed',
    age: 36,
    gender: 'M',
    isHeadOfHousehold: true,
    houseName: 'Peace Cottage',
    houseNumber: '2/108',
    ward: 'Ward 2',
    phone: '+91 96331 82741',
    whatsapp: '919633182741',
    address: 'Near Community Health Centre, Ward 2',
    occupation: 'General Physician / Medical Officer',
    education: 'MBBS, MD',
    dateOfBirth: '1990-09-14',
    zakatClassification: 'Active Contributor / Donor',
    quranicCategory: 'General',
    incomeBracket: '> ₹90,000 / month',
    specialConsiderations: [
      'Conducts monthly free medical camp at Mahallu Hall',
      'Annual Zakat donor'
    ],
    familyMembers: [
      { id: 'FM-22', name: 'Dr. Anas Ahmed', relation: 'Self (Head)', age: 36, gender: 'Male', maritalStatus: 'Married', occupation: 'Doctor' },
      { id: 'FM-23', name: 'Dr. Rania Anas', relation: 'Spouse', age: 34, gender: 'Female', maritalStatus: 'Married', occupation: 'Dentist' },
      { id: 'FM-24', name: 'Ibrahim Anas', relation: 'Son', age: 5, gender: 'Male', maritalStatus: 'Unmarried', occupation: 'Kindergarten' },
    ],
    aidHistory: [],
    verificationStatus: 'Annual Census Updated',
    lastCensusDate: '2026-08-30',
    notes: 'Assists Mahallu in vetting medical bills presented by claimants.',
  },
  {
    id: 'MHL-077',
    householdId: 'HH-112',
    fullName: 'Sister Fatima V.',
    age: 39,
    gender: 'F',
    isHeadOfHousehold: true,
    houseName: 'Subhan Villa',
    houseNumber: '1/319',
    ward: 'Ward 1',
    phone: '+91 95621 44890',
    whatsapp: '919562144890',
    address: 'Industrial Colony, Ward 1, Juma Masjid Mahallu',
    occupation: 'Micro-Enterprise Home Tailor',
    education: 'Secondary School',
    dateOfBirth: '1987-03-22',
    zakatClassification: 'Eligible for Zakat',
    quranicCategory: 'Al-Fuqara',
    incomeBracket: '< ₹10,000 / month',
    specialConsiderations: [
      'Widowed mother of 3 young children',
      'Beneficiary of 2026 Mahallu livelihood equipment initiative'
    ],
    familyMembers: [
      { id: 'FM-25', name: 'Sister Fatima V.', relation: 'Self (Head)', age: 39, gender: 'Female', maritalStatus: 'Widowed', occupation: 'Tailoring' },
      { id: 'FM-26', name: 'Zahra Fatima', relation: 'Daughter', age: 12, gender: 'Female', maritalStatus: 'Unmarried', occupation: 'Student' },
      { id: 'FM-27', name: 'Ammar Fatima', relation: 'Son', age: 9, gender: 'Male', maritalStatus: 'Unmarried', occupation: 'Student' },
      { id: 'FM-28', name: 'Hamza Fatima', relation: 'Son', age: 6, gender: 'Male', maritalStatus: 'Unmarried', occupation: 'Student' },
    ],
    aidHistory: [
      { id: 'AID-960', date: '2026-10-02', category: 'Livelihood Equipment', amount: 18000, signatory: 'Mahallu President', receiptNumber: 'TZK-MHL-LVH-960', purpose: 'Industrial heavy-duty sewing machine for micro-income' },
    ],
    verificationStatus: 'Verified by Trustee',
    lastCensusDate: '2026-10-03',
    notes: 'Reported steady daily earnings with the new equipment. On track toward financial self-reliance.',
  }
];

export const MahalResidentsDirectory: React.FC<MahalResidentsDirectoryProps> = ({
  onBack,
  onOpenApplicationWithResident,
  isNewAccount = false,
}) => {
  const [residents, setResidents] = useState<MahalResident[]>(() => {
    if (isNewAccount) {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('tazku_fresh_mahallu_residents');
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch {}
        }
      }
      return [];
    }
    return INITIAL_RESIDENTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedResident, setSelectedResident] = useState<MahalResident | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<MahalResident>>({});
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter chips options
  const filterChips = [
    { id: 'All', label: 'All Residents' },
    { id: 'Heads', label: 'Households (Heads)' },
    { id: 'Ward 1', label: 'Ward 1' },
    { id: 'Ward 2', label: 'Ward 2' },
    { id: 'Ward 3', label: 'Ward 3' },
    { id: 'Zakat Eligible', label: 'Eligible for Zakat' },
    { id: 'Donors', label: 'Active Donors' },
    { id: 'Seniors', label: 'Senior Citizens (60+)' },
  ];

  // Filtered residents list
  const filteredResidents = useMemo(() => {
    return residents.filter((r) => {
      // Search query
      const matchesSearch =
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.houseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery) ||
        r.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter category
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Heads') return r.isHeadOfHousehold;
      if (activeFilter === 'Ward 1') return r.ward === 'Ward 1';
      if (activeFilter === 'Ward 2') return r.ward === 'Ward 2';
      if (activeFilter === 'Ward 3') return r.ward === 'Ward 3';
      if (activeFilter === 'Zakat Eligible') return r.zakatClassification === 'Eligible for Zakat';
      if (activeFilter === 'Donors') return r.zakatClassification === 'Active Contributor / Donor';
      if (activeFilter === 'Seniors') return r.age >= 60;

      return true;
    });
  }, [residents, searchQuery, activeFilter]);

  // Aggregate stats (dynamic for new committee, realistic demo totals for default)
  const totalResidentsCount = isNewAccount ? residents.length : 1420;
  const totalHouseholdsCount = isNewAccount ? residents.filter(r => r.isHeadOfHousehold).length : 312;
  const zakatEligibleCount = residents.filter(r => r.zakatClassification === 'Eligible for Zakat').length;
  const activeDonorsCount = residents.filter(r => r.zakatClassification === 'Active Contributor / Donor').length;

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Mahal ID',
      'Full Name',
      'Age',
      'Gender',
      'Head of Household',
      'House Name',
      'House Number',
      'Ward',
      'Phone',
      'Occupation',
      'Zakat Classification',
      'Family Members Count',
      'Monthly Income Bracket',
      'Verification Status'
    ];

    const rows = filteredResidents.map(r => [
      r.id,
      `"${r.fullName}"`,
      r.age,
      r.gender,
      r.isHeadOfHousehold ? 'Yes' : 'No',
      `"${r.houseName}"`,
      r.houseNumber,
      r.ward,
      `"${r.phone}"`,
      `"${r.occupation}"`,
      `"${r.zakatClassification}"`,
      r.familyMembers.length,
      `"${r.incomeBracket}"`,
      `"${r.verificationStatus}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mahallu_Residents_Census_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Census Directory exported as CSV successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  // Open Edit Dossier
  const handleStartEdit = (resident: MahalResident) => {
    setEditFormData({
      fullName: resident.fullName,
      houseName: resident.houseName,
      houseNumber: resident.houseNumber,
      phone: resident.phone,
      occupation: resident.occupation,
      incomeBracket: resident.incomeBracket,
      zakatClassification: resident.zakatClassification,
      notes: resident.notes,
    });
    setIsEditing(true);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResident) return;

    const updated: MahalResident = {
      ...selectedResident,
      fullName: editFormData.fullName || selectedResident.fullName,
      houseName: editFormData.houseName || selectedResident.houseName,
      houseNumber: editFormData.houseNumber || selectedResident.houseNumber,
      phone: editFormData.phone || selectedResident.phone,
      occupation: editFormData.occupation || selectedResident.occupation,
      incomeBracket: editFormData.incomeBracket || selectedResident.incomeBracket,
      zakatClassification: (editFormData.zakatClassification as any) || selectedResident.zakatClassification,
      notes: editFormData.notes || selectedResident.notes,
      lastCensusDate: new Date().toISOString().slice(0, 10),
    };

    setResidents(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedResident(updated);
    setIsEditing(false);
    showToast(`Resident record #${updated.id} updated successfully`);
  };

  // Quick Toggle Classification
  const handleToggleEligibility = (resident: MahalResident) => {
    const nextClassification: MahalResident['zakatClassification'] =
      resident.zakatClassification === 'Eligible for Zakat'
        ? 'General Resident'
        : resident.zakatClassification === 'General Resident'
        ? 'Active Contributor / Donor'
        : 'Eligible for Zakat';

    const updated: MahalResident = {
      ...resident,
      zakatClassification: nextClassification,
      lastCensusDate: new Date().toISOString().slice(0, 10),
    };

    setResidents(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedResident(updated);
    showToast(`Updated classification for ${updated.fullName}: ${nextClassification}`);
  };

  // Register New Resident Submit
  const [newRegForm, setNewRegForm] = useState({
    fullName: '',
    age: '',
    gender: 'M',
    houseName: '',
    houseNumber: '',
    ward: 'Ward 3',
    phone: '',
    occupation: '',
    zakatClassification: 'General Resident' as MahalResident['zakatClassification'],
    incomeBracket: '₹15,000 - ₹25,000 / month',
    familySize: '4',
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegForm.fullName || !newRegForm.houseName) return;

    const newId = `MHL-${(residents.length + 100).toString().padStart(3, '0')}`;
    const newResident: MahalResident = {
      id: newId,
      householdId: `HH-${(residents.length + 300)}`,
      fullName: newRegForm.fullName,
      age: parseInt(newRegForm.age) || 35,
      gender: newRegForm.gender as 'M' | 'F',
      isHeadOfHousehold: true,
      houseName: newRegForm.houseName,
      houseNumber: newRegForm.houseNumber || '3/NEW',
      ward: newRegForm.ward,
      phone: newRegForm.phone || '+91 90000 00000',
      whatsapp: (newRegForm.phone || '9000000000').replace(/\D/g, ''),
      address: `${newRegForm.houseName}, ${newRegForm.ward}, Juma Masjid Mahallu`,
      occupation: newRegForm.occupation || 'Resident',
      education: 'Secondary School',
      zakatClassification: newRegForm.zakatClassification,
      incomeBracket: newRegForm.incomeBracket,
      familyMembers: [
        { id: `FM-${Date.now()}-1`, name: newRegForm.fullName, relation: 'Self (Head)', age: parseInt(newRegForm.age) || 35, gender: newRegForm.gender === 'M' ? 'Male' : 'Female', maritalStatus: 'Married', occupation: newRegForm.occupation || 'Resident' },
        { id: `FM-${Date.now()}-2`, name: 'Spouse', relation: 'Spouse', age: (parseInt(newRegForm.age) || 35) - 3, gender: newRegForm.gender === 'M' ? 'Female' : 'Male', maritalStatus: 'Married', occupation: 'Homemaker' },
      ],
      aidHistory: [],
      verificationStatus: 'Pending Field Verification',
      lastCensusDate: new Date().toISOString().slice(0, 10),
      notes: 'Newly enrolled resident through Mahallu administrative portal.',
    };

    setResidents(prev => {
      const updated = [newResident, ...prev];
      if (isNewAccount && typeof window !== 'undefined') {
        try {
          localStorage.setItem('tazku_fresh_mahallu_residents', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
    setIsRegisterModalOpen(false);
    setNewRegForm({
      fullName: '',
      age: '',
      gender: 'M',
      houseName: '',
      houseNumber: '',
      ward: 'Ward 3',
      phone: '',
      occupation: '',
      zakatClassification: 'General Resident',
      incomeBracket: '₹15,000 - ₹25,000 / month',
      familySize: '4',
    });
    showToast(`Resident ${newResident.fullName} added to Mahallu Census as #${newId}`);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1B4332] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 border border-[#40916C]/40">
          <CheckCircle2 className="w-4 h-4 text-[#E9F3ED]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top App Bar Header (Deep Forest Emerald #1B4332) */}
      <div className="bg-[#1B4332] text-white p-4 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold leading-tight flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#E9F3ED]" />
                <span>Mahal Residents Census</span>
              </h2>
              <span className="text-[11px] text-[#F3EFE6] block">
                Ward 1, 2 & 3 Jurisdiction • Live Registry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1 text-[11px] font-bold bg-white/15 hover:bg-white/25 text-white px-2.5 py-1.5 rounded-xl transition border border-white/20 shadow-2xs cursor-pointer"
              title="Export Census CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#E9F3ED]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition border border-white/20 cursor-pointer"
              title="Print Roster"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="flex items-center gap-1 text-[11px] font-bold bg-white text-[#1B4332] hover:bg-[#F3EFE6] px-2.5 py-1.5 rounded-xl transition shadow-sm cursor-pointer"
              title="Enroll Resident"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Enroll</span>
            </button>
          </div>
        </div>

        {/* Aggregate Census Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-center">
          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-[#F3EFE6] block">Total Census</span>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono block">
              {totalResidentsCount.toLocaleString()} Res.
            </span>
            <span className="text-[9px] text-[#E9F3ED]">{totalHouseholdsCount} Households</span>
          </div>

          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-[#F3EFE6] block">Zakat Eligible</span>
            <span className="text-xs sm:text-sm font-extrabold text-[#E9F3ED] font-mono block">
              {zakatEligibleCount} Families
            </span>
            <span className="text-[9px] text-[#E9F3ED]">Al-Fuqara / Masakin</span>
          </div>

          <div className="bg-white/10 rounded-xl p-2">
            <span className="text-[10px] text-[#F3EFE6] block">Contributors</span>
            <span className="text-xs sm:text-sm font-extrabold text-white font-mono block">
              {activeDonorsCount} Donors
            </span>
            <span className="text-[9px] text-[#F3EFE6]">Annual Contributors</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#526059] absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by resident name, house name, family ID, or phone..."
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#EBE5D8] rounded-2xl text-xs font-semibold text-[#112A20] placeholder:text-[#526059] focus:outline-hidden focus:border-[#40916C] focus:ring-1 focus:ring-[#40916C] shadow-2xs transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-[#526059] hover:text-[#112A20] p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Chips Horizontal Scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setActiveFilter(chip.id)}
            className={`py-1.5 px-3 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
              activeFilter === chip.id
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'bg-white text-[#526059] border border-[#EBE5D8] hover:border-[#40916C]/40 hover:text-[#1B4332]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Result Count and Active Filter Summary */}
      <div className="flex items-center justify-between px-1 text-[11px] text-[#526059] font-medium">
        <span>
          Showing <strong>{filteredResidents.length}</strong> resident records
          {activeFilter !== 'All' && <span> in <strong>{activeFilter}</strong></span>}
        </span>
        <span className="text-[#1B4332] font-bold">
          {isNewAccount ? 'Official Ward Registry' : 'Juma Masjid Mahallu Registry'}
        </span>
      </div>

      {/* Resident List Cards */}
      <div className="space-y-3">
        {residents.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#EBE5D8] text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F3ED] text-[#1B4332] flex items-center justify-center mx-auto shadow-2xs">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-[#112A20]">Census Directory is Fresh & Empty</h4>
              <p className="text-xs text-[#526059] max-w-xs mx-auto leading-relaxed">
                As a newly registered Mahallu committee, your community census is clean. Enroll your first household to begin tracking residents, heads of families, and Zakat eligibility.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#E9F3ED]" />
                <span>Enroll First Resident</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setResidents(INITIAL_RESIDENTS);
                  showToast('Sample census roster loaded for demonstration');
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#F3EFE6] hover:bg-[#EBE5D8] text-[#2D6A4F] rounded-full font-bold text-xs transition cursor-pointer"
              >
                Load Demo Roster
              </button>
            </div>
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#EBE5D8] text-center space-y-2 shadow-xs">
            <Users className="w-8 h-8 text-[#526059]/40 mx-auto" />
            <h4 className="text-sm font-bold text-[#112A20]">No Matching Residents Found</h4>
            <p className="text-xs text-[#526059] max-w-xs mx-auto">
              No matching records for "{searchQuery}". Try searching by another keyword or reset filters.
            </p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
              className="mt-2 text-xs font-bold text-[#40916C] hover:underline cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredResidents.map((resident) => {
            const isEligible = resident.zakatClassification === 'Eligible for Zakat';
            const isDonor = resident.zakatClassification === 'Active Contributor / Donor';

            return (
              <div
                key={resident.id}
                onClick={() => setSelectedResident(resident)}
                className="bg-white p-4 rounded-3xl border border-[#EBE5D8] hover:border-[#40916C]/40 shadow-xs hover:shadow-md transition cursor-pointer space-y-3 group"
              >
                {/* Header Row: Name & Age & Tags */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#112A20] group-hover:text-[#1B4332] transition">
                        {resident.fullName}
                      </h3>
                      <span className="text-xs text-[#526059] font-semibold">
                        ({resident.age} {resident.gender})
                      </span>
                      {resident.isHeadOfHousehold && (
                        <span className="text-[10px] font-bold bg-[#E9F3ED] text-[#1B4332] px-2 py-0.5 rounded-full border border-[#40916C]/20">
                          Head of Household
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#526059]">
                      <Home className="w-3.5 h-3.5 text-[#526059] shrink-0" />
                      <span className="font-medium text-[#112A20]">{resident.houseName}</span>
                      <span className="text-[#526059]">•</span>
                      <span className="text-[#526059]">{resident.ward}</span>
                      <span className="text-[#526059]">•</span>
                      <span className="font-mono text-[11px] text-[#526059]">{resident.id}</span>
                    </div>
                  </div>

                  {/* Open Dossier Button */}
                  <div className="w-8 h-8 rounded-full bg-[#F3EFE6] group-hover:bg-[#E9F3ED] flex items-center justify-center text-[#526059] group-hover:text-[#1B4332] transition shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Classification Badge & Dependents Count */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EBE5D8]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        isEligible
                          ? 'bg-[#E9F3ED] text-[#1B4332] border border-[#40916C]/20'
                          : isDonor
                          ? 'bg-[#F3EFE6] text-[#2D6A4F] border border-[#EBE5D8]'
                          : 'bg-[#FBFBF9] text-[#526059] border border-[#EBE5D8]'
                      }`}
                    >
                      {isEligible && <HeartHandshake className="w-3 h-3 text-[#40916C]" />}
                      {isDonor && <Coins className="w-3 h-3 text-[#1B4332]" />}
                      <span>{resident.zakatClassification}</span>
                    </span>

                    <span className="text-[11px] text-[#526059]">
                      {resident.familyMembers.length} Family Members
                    </span>
                  </div>

                  {/* Quick Contact & WhatsApp Actions */}
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`tel:${resident.phone}`}
                      className="w-7 h-7 rounded-full bg-[#F3EFE6] hover:bg-[#E9F3ED] hover:text-[#1B4332] flex items-center justify-center text-[#526059] transition"
                      title={`Call ${resident.fullName}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?phone=${resident.whatsapp}&text=Assalamu%20Alaykum%20${encodeURIComponent(resident.fullName)},%20from%20Juma%20Masjid%20Mahallu%20Committee.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full bg-[#E9F3ED] hover:bg-[#d8ece0] text-[#1B4332] flex items-center justify-center transition"
                      title="WhatsApp Chat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Special Considerations or Past Aid Tag */}
                {resident.specialConsiderations && resident.specialConsiderations.length > 0 && (
                  <div className="bg-[#FBFBF9] p-2 rounded-xl text-[11px] text-[#526059] space-y-0.5 border border-[#EBE5D8]">
                    <span className="font-bold text-[#112A20] block">Assessment Notes:</span>
                    <p className="text-[#526059] line-clamp-1">
                      {resident.specialConsiderations.join(' • ')}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* DETAILED RESIDENT PROFILE MODAL / DOSSIER                                */}
      {/* ========================================================================= */}
      {selectedResident && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-[#1B4332] text-white p-4 sm:p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-white/20 text-white px-2 py-0.5 rounded-md font-bold">
                    {selectedResident.id}
                  </span>
                  <span className="text-xs text-[#F3EFE6]">
                    {selectedResident.ward} • House #{selectedResident.houseNumber}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedResident.fullName}
                </h3>
                <p className="text-xs text-[#F3EFE6]">
                  {selectedResident.houseName} • {selectedResident.occupation}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { setSelectedResident(null); setIsEditing(false); }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 font-sans">
              
              {/* Classification & Status Bar */}
              <div className="flex items-center justify-between p-3 bg-[#E9F3ED] rounded-2xl border border-[#40916C]/20">
                <div>
                  <span className="text-[10px] text-[#1B4332] uppercase font-bold tracking-wider block">
                    Zakat & Economic Tag:
                  </span>
                  <span className="text-xs font-extrabold text-[#1B4332]">
                    {selectedResident.zakatClassification}
                  </span>
                  {selectedResident.quranicCategory && (
                    <span className="text-[11px] text-[#526059] block">
                      Category: {selectedResident.quranicCategory}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleEligibility(selectedResident)}
                  className="px-2.5 py-1 bg-white hover:bg-[#F3EFE6] border border-[#EBE5D8] text-[#1B4332] rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                  title="Toggle between Zakat Eligible, Donor, or General"
                >
                  Change Status
                </button>
              </div>

              {/* 1. Personal Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#112A20] uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#40916C]" />
                  <span>Personal & Contact Information</span>
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#FBFBF9] rounded-xl border border-[#EBE5D8]">
                    <span className="text-[10px] text-[#526059] block">Phone & WhatsApp</span>
                    <span className="font-bold text-[#112A20] block mt-0.5">{selectedResident.phone}</span>
                  </div>
                  <div className="p-2.5 bg-[#FBFBF9] rounded-xl border border-[#EBE5D8]">
                    <span className="text-[10px] text-[#526059] block">Monthly Income</span>
                    <span className="font-bold text-[#112A20] block mt-0.5">{selectedResident.incomeBracket}</span>
                  </div>
                  <div className="p-2.5 bg-[#FBFBF9] rounded-xl border border-[#EBE5D8]">
                    <span className="text-[10px] text-[#526059] block">Education Background</span>
                    <span className="font-bold text-[#112A20] block mt-0.5">{selectedResident.education}</span>
                  </div>
                  <div className="p-2.5 bg-[#FBFBF9] rounded-xl border border-[#EBE5D8]">
                    <span className="text-[10px] text-[#526059] block">Verification Status</span>
                    <span className="font-bold text-[#1B4332] block mt-0.5">{selectedResident.verificationStatus}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#FBFBF9] rounded-xl border border-[#EBE5D8] text-xs">
                  <span className="text-[10px] text-[#526059] block">Verified Residential Address</span>
                  <span className="font-medium text-[#112A20] block mt-0.5">{selectedResident.address}</span>
                </div>
              </div>

              {/* 2. Family Members Roster Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#112A20] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#40916C]" />
                    <span>Family Members Roster ({selectedResident.familyMembers.length})</span>
                  </h4>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#EBE5D8] shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F3EFE6] text-[#526059] font-bold border-b border-[#EBE5D8]">
                      <tr>
                        <th className="p-2.5">Member Name</th>
                        <th className="p-2.5">Relation</th>
                        <th className="p-2.5">Age / Sex</th>
                        <th className="p-2.5">Occupation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE5D8] text-[#112A20]">
                      {selectedResident.familyMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-[#F3EFE6]/50">
                          <td className="p-2.5 font-bold text-[#112A20]">{member.name}</td>
                          <td className="p-2.5 text-[#526059]">{member.relation}</td>
                          <td className="p-2.5">{member.age} ({member.gender[0]})</td>
                          <td className="p-2.5 text-[#526059]">{member.occupation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Mahal Financial Assessment & Historical Aid Ledger */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#112A20] uppercase tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[#40916C]" />
                  <span>Past Mahal Aid History</span>
                </h4>

                {selectedResident.aidHistory.length === 0 ? (
                  <div className="p-3 bg-[#FBFBF9] border border-[#EBE5D8] rounded-2xl text-center text-xs text-[#526059]">
                    No recorded aid disbursement history for this household.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedResident.aidHistory.map((aid) => (
                      <div
                        key={aid.id}
                        className="p-3 bg-white rounded-2xl border border-[#EBE5D8] shadow-2xs flex justify-between items-center text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#112A20] block">{aid.category}</span>
                          <span className="text-[11px] text-[#526059]">{aid.purpose}</span>
                          <span className="text-[10px] font-mono text-[#526059] block mt-0.5">
                            Ref: {aid.receiptNumber} • Signed by {aid.signatory}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-[#1B4332] font-mono block">
                            ₹ {aid.amount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#526059]">{aid.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Committee Notes */}
              {selectedResident.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Committee Confidential Notes:</span>
                  </span>
                  <p className="text-amber-800 leading-relaxed text-[11px]">
                    {selectedResident.notes}
                  </p>
                </div>
              )}

              {/* Inline Edit Form if Activated */}
              {isEditing && (
                <form onSubmit={handleSaveEdit} className="p-4 bg-[#FBFBF9] rounded-2xl border border-[#EBE5D8] space-y-3 animate-in fade-in">
                  <h4 className="text-xs font-bold text-[#112A20] flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-[#40916C]" />
                    <span>Edit Resident Information</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#526059] mb-0.5">Full Name</label>
                      <input
                        type="text"
                        value={editFormData.fullName || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full p-2 bg-white border border-[#EBE5D8] rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#526059] mb-0.5">Phone Number</label>
                      <input
                        type="text"
                        value={editFormData.phone || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-2 bg-white border border-[#EBE5D8] rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#526059] mb-0.5">House Name</label>
                      <input
                        type="text"
                        value={editFormData.houseName || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, houseName: e.target.value }))}
                        className="w-full p-2 bg-white border border-[#EBE5D8] rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#526059] mb-0.5">Occupation</label>
                      <input
                        type="text"
                        value={editFormData.occupation || ''}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full p-2 bg-white border border-[#EBE5D8] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#526059] mb-0.5">Zakat Classification</label>
                    <select
                      value={editFormData.zakatClassification}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, zakatClassification: e.target.value as any }))}
                      className="w-full p-2 bg-white border border-[#EBE5D8] rounded-xl text-xs"
                    >
                      <option value="Eligible for Zakat">Eligible for Zakat</option>
                      <option value="Active Contributor / Donor">Active Contributor / Donor</option>
                      <option value="General Resident">General Resident</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 bg-white border border-[#EBE5D8] rounded-xl text-xs font-bold text-[#526059] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-[#1B4332] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[#FBFBF9] border-t border-[#EBE5D8] flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStartEdit(selectedResident)}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-[#F3EFE6] text-[#112A20] border border-[#EBE5D8] rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#40916C]" />
                <span>Edit Details</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenApplicationWithResident) {
                    onOpenApplicationWithResident(selectedResident);
                    setSelectedResident(null);
                  } else {
                    showToast(`Aid Case initiation started for ${selectedResident.fullName}`);
                  }
                }}
                className="flex-1 py-2.5 px-3 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-full font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Assign Aid Case</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REGISTER NEW RESIDENT MODAL                                              */}
      {/* ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 border border-[#EBE5D8]">
            <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#112A20]">
                  Enroll Resident into Mahal Census
                </h3>
                <span className="text-[11px] text-[#526059]">Official Mahallu Ward Registrar</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#F3EFE6] flex items-center justify-center text-[#526059] hover:text-[#112A20] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#112A20] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newRegForm.fullName}
                  onChange={(e) => setNewRegForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="e.g. Abdulla Rahman"
                  className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#112A20] mb-1">Age</label>
                  <input
                    type="number"
                    value={newRegForm.age}
                    onChange={(e) => setNewRegForm(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="e.g. 45"
                    className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#112A20] mb-1">Gender</label>
                  <select
                    value={newRegForm.gender}
                    onChange={(e) => setNewRegForm(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#112A20] mb-1">House Name *</label>
                  <input
                    type="text"
                    required
                    value={newRegForm.houseName}
                    onChange={(e) => setNewRegForm(prev => ({ ...prev, houseName: e.target.value }))}
                    placeholder="e.g. Madina Manzil"
                    className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#112A20] mb-1">Ward Jurisdiction</label>
                  <select
                    value={newRegForm.ward}
                    onChange={(e) => setNewRegForm(prev => ({ ...prev, ward: e.target.value }))}
                    className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                  >
                    <option value="Ward 1">Ward 1</option>
                    <option value="Ward 2">Ward 2</option>
                    <option value="Ward 3">Ward 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#112A20] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newRegForm.phone}
                    onChange={(e) => setNewRegForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98..."
                    className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#112A20] mb-1">Occupation</label>
                  <input
                    type="text"
                    value={newRegForm.occupation}
                    onChange={(e) => setNewRegForm(prev => ({ ...prev, occupation: e.target.value }))}
                    placeholder="e.g. Driver"
                    className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#112A20] mb-1">Initial Classification</label>
                <select
                  value={newRegForm.zakatClassification}
                  onChange={(e) => setNewRegForm(prev => ({ ...prev, zakatClassification: e.target.value as any }))}
                  className="w-full p-2.5 bg-white border border-[#EBE5D8] rounded-xl text-xs font-semibold focus:border-[#40916C] focus:outline-hidden"
                >
                  <option value="General Resident">General Resident</option>
                  <option value="Eligible for Zakat">Eligible for Zakat (Al-Fuqara / Al-Masakin)</option>
                  <option value="Active Contributor / Donor">Active Contributor / Donor</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="flex-1 py-3 bg-[#F3EFE6] text-[#526059] hover:bg-[#EBE5D8] rounded-full font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1B4332] text-white rounded-full font-bold shadow-md hover:bg-[#2D6A4F] cursor-pointer"
                >
                  Enroll in Census
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
