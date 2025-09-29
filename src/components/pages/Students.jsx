import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    },
    program: "",
    academicStatus: "Active"
  });

  const programs = [
    "Computer Science",
    "Business Administration", 
    "Psychology",
    "Engineering",
    "Biology",
    "Mathematics",
    "Art History",
    "Chemistry",
    "English Literature",
    "Physics"
  ];

  const academicStatuses = [
    "Active",
    "Probation",
    "Suspended",
    "Graduated",
    "Withdrawn"
  ];

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.program.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(student => student.academicStatus === filterStatus);
    }

    if (filterProgram) {
      filtered = filtered.filter(student => student.program === filterProgram);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterStatus, filterProgram]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedStudent) {
        await studentService.update(selectedStudent.Id, formData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(formData);
        toast.success("Student added successfully!");
      }
      
      setShowAddForm(false);
      setSelectedStudent(null);
      resetForm();
      loadStudents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      address: student.address,
      program: student.program,
      academicStatus: student.academicStatus
    });
    setShowAddForm(true);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success("Student deleted successfully!");
        loadStudents();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: ""
      },
      program: "",
      academicStatus: "Active"
    });
  };

  const columns = [
    {
      key: "studentId",
      label: "Student ID",
      sortable: true
    },
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (_, student) => `${student.firstName} ${student.lastName}`
    },
    {
      key: "email",
      label: "Email",
      sortable: true
    },
    {
      key: "program",
      label: "Program",
      sortable: true
    },
    {
      key: "academicStatus",
      label: "Status",
      render: (status) => (
        <Badge variant={
          status === "Active" ? "success" :
          status === "Probation" ? "warning" :
          status === "Suspended" ? "error" : "secondary"
        }>
          {status}
        </Badge>
      )
    },
    {
key: "gpa",
      label: "GPA", 
      sortable: true,
      render: (gpa) => (
        <span className="font-medium">
          {gpa != null ? gpa.toFixed(2) : "N/A"}
        </span>
      )
    },
    {
      key: "credits",
      label: "Credits",
      sortable: true
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 gradient-text">Students</h1>
          <p className="text-secondary mt-1">Manage student information and records</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setSelectedStudent(null);
            resetForm();
          }}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary to-accent text-white"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Student
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-card p-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormField
            type="select"
            placeholder="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              ...academicStatuses.map(status => ({ value: status, label: status }))
            ]}
          />
          <FormField
            type="select"
            placeholder="Filter by Program"
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            options={[
              { value: "", label: "All Programs" },
              ...programs.map(program => ({ value: program, label: program }))
            ]}
          />
        </div>
      </motion.div>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredStudents.length === 0 ? (
          <Empty 
            type="students" 
            onAction={() => {
              setShowAddForm(true);
              setSelectedStudent(null);
              resetForm();
            }}
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </motion.div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedStudent ? "Edit Student" : "Add New Student"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedStudent(null);
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  <FormField
                    label="Last Name"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <FormField
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <FormField
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                />

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <FormField
                    label="Street Address"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, street: e.target.value}
                    })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="City"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, city: e.target.value}
                      })}
                    />
                    <FormField
                      label="State"
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, state: e.target.value}
                      })}
                    />
                    <FormField
                      label="ZIP Code"
                      value={formData.address.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: {...formData.address, zipCode: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Program"
                    type="select"
                    required
                    value={formData.program}
                    onChange={(e) => setFormData({...formData, program: e.target.value})}
                    options={programs.map(program => ({ value: program, label: program }))}
                  />
                  <FormField
                    label="Academic Status"
                    type="select"
                    required
                    value={formData.academicStatus}
                    onChange={(e) => setFormData({...formData, academicStatus: e.target.value})}
                    options={academicStatuses.map(status => ({ value: status, label: status }))}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedStudent(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-white">
                    {selectedStudent ? "Update Student" : "Add Student"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Students;