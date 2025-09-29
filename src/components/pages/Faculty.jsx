import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import facultyService from "@/services/api/facultyService";

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    position: "Assistant Professor",
    officeLocation: "",
    maxCourseLoad: "3"
  });

  const departments = [
    "Computer Science",
    "Mathematics",
    "English",
    "Biology",
    "History",
    "Chemistry",
    "Psychology",
    "Economics",
    "Art",
    "Physics"
  ];

  const positions = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Instructor"
  ];

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await facultyService.getAll();
      setFaculty(data);
      setFilteredFaculty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  useEffect(() => {
    let filtered = faculty;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter(member => member.department === filterDepartment);
    }

    if (filterPosition) {
      filtered = filtered.filter(member => member.position === filterPosition);
    }

    setFilteredFaculty(filtered);
  }, [faculty, searchTerm, filterDepartment, filterPosition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const facultyData = {
        ...formData,
        maxCourseLoad: parseInt(formData.maxCourseLoad)
      };

      if (selectedFaculty) {
        await facultyService.update(selectedFaculty.Id, facultyData);
        toast.success("Faculty member updated successfully!");
      } else {
        await facultyService.create(facultyData);
        toast.success("Faculty member added successfully!");
      }

      setShowAddForm(false);
      setSelectedFaculty(null);
      resetForm();
      loadFaculty();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (member) => {
    setSelectedFaculty(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      department: member.department,
      position: member.position,
      officeLocation: member.officeLocation,
      maxCourseLoad: member.maxCourseLoad.toString()
    });
    setShowAddForm(true);
  };

  const handleDelete = async (member) => {
    if (window.confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
      try {
        await facultyService.delete(member.Id);
        toast.success("Faculty member deleted successfully!");
        loadFaculty();
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
      department: "",
      position: "Assistant Professor",
      officeLocation: "",
      maxCourseLoad: "3"
    });
  };

  const getPositionVariant = (position) => {
    switch (position) {
      case "Professor": return "primary";
      case "Associate Professor": return "accent";
      case "Assistant Professor": return "success";
      default: return "secondary";
    }
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadFaculty} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 gradient-text">Faculty</h1>
          <p className="text-secondary mt-1">Manage faculty members and assignments</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setSelectedFaculty(null);
            resetForm();
          }}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary to-accent text-white"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Faculty
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
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormField
            type="select"
            placeholder="Filter by Department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            options={[
              { value: "", label: "All Departments" },
              ...departments.map(dept => ({ value: dept, label: dept }))
            ]}
          />
          <FormField
            type="select"
            placeholder="Filter by Position"
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            options={[
              { value: "", label: "All Positions" },
              ...positions.map(pos => ({ value: pos, label: pos }))
            ]}
          />
        </div>
      </motion.div>

      {/* Faculty Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredFaculty.length === 0 ? (
          <Empty
            type="faculty"
            onAction={() => {
              setShowAddForm(true);
              setSelectedFaculty(null);
              resetForm();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((member) => (
              <motion.div
                key={member.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-card p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-3 rounded-full">
                      <ApperIcon name="UserCheck" size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {member.firstName} {member.lastName}
                      </h3>
                      <Badge variant={getPositionVariant(member.position)}>
                        {member.position}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" size={16} className="text-secondary" />
                    <span className="text-sm text-secondary">{member.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Building" size={16} className="text-secondary" />
                    <span className="text-sm text-secondary">{member.department}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="MapPin" size={16} className="text-secondary" />
                    <span className="text-sm text-secondary">{member.officeLocation}</span>
                  </div>
                </div>

                <div className="bg-surface p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Course Load</span>
                    <span className="text-sm text-secondary">
                      {member.courses.length}/{member.maxCourseLoad}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                      style={{ 
                        width: `${(member.courses.length / member.maxCourseLoad) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {member.courses.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Current Courses:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.courses.map((course, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(member)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
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
                  {selectedFaculty ? "Edit Faculty Member" : "Add Faculty Member"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedFaculty(null);
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
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <FormField
                    label="Last Name"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>

                <FormField
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Department"
                    type="select"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    options={departments.map(dept => ({ value: dept, label: dept }))}
                  />
                  <FormField
                    label="Position"
                    type="select"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    options={positions.map(pos => ({ value: pos, label: pos }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Office Location"
                    required
                    value={formData.officeLocation}
                    onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                    placeholder="e.g., Tech Building 301"
                  />
                  <FormField
                    label="Max Course Load"
                    type="number"
                    required
                    value={formData.maxCourseLoad}
                    onChange={(e) => setFormData({ ...formData, maxCourseLoad: e.target.value })}
                    min="1"
                    max="8"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedFaculty(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-white">
                    {selectedFaculty ? "Update Faculty" : "Add Faculty"}
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

export default Faculty;