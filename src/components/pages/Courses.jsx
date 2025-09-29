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
import courseService from "@/services/api/courseService";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    title: "",
    description: "",
    credits: "",
    department: "",
    prerequisites: [],
    maxEnrollment: "",
    semester: "Fall",
    year: new Date().getFullYear()
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

  const semesters = ["Fall", "Spring", "Summer"];

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await courseService.getAll();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDepartment) {
      filtered = filtered.filter(course => course.department === filterDepartment);
    }

    if (filterSemester) {
      filtered = filtered.filter(course => course.semester === filterSemester);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, filterDepartment, filterSemester]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits),
        maxEnrollment: parseInt(formData.maxEnrollment),
        year: parseInt(formData.year)
      };

      if (selectedCourse) {
        await courseService.update(selectedCourse.Id, courseData);
        toast.success("Course updated successfully!");
      } else {
        await courseService.create(courseData);
        toast.success("Course added successfully!");
      }

      setShowAddForm(false);
      setSelectedCourse(null);
      resetForm();
      loadCourses();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      courseCode: course.courseCode,
      title: course.title,
      description: course.description,
      credits: course.credits.toString(),
      department: course.department,
      prerequisites: course.prerequisites,
      maxEnrollment: course.maxEnrollment.toString(),
      semester: course.semester,
      year: course.year
    });
    setShowAddForm(true);
  };

  const handleDelete = async (course) => {
    if (window.confirm(`Are you sure you want to delete ${course.title}?`)) {
      try {
        await courseService.delete(course.Id);
        toast.success("Course deleted successfully!");
        loadCourses();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      courseCode: "",
      title: "",
      description: "",
      credits: "",
      department: "",
      prerequisites: [],
      maxEnrollment: "",
      semester: "Fall",
      year: new Date().getFullYear()
    });
  };

  const getEnrollmentStatus = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return { variant: "error", text: "Full" };
    if (percentage >= 75) return { variant: "warning", text: "Almost Full" };
    return { variant: "success", text: "Available" };
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 gradient-text">Courses</h1>
          <p className="text-secondary mt-1">Manage course catalog and enrollment</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setSelectedCourse(null);
            resetForm();
          }}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary to-accent text-white"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Course
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
            placeholder="Search courses..."
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
            placeholder="Filter by Semester"
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            options={[
              { value: "", label: "All Semesters" },
              ...semesters.map(sem => ({ value: sem, label: sem }))
            ]}
          />
        </div>
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredCourses.length === 0 ? (
          <Empty
            type="courses"
            onAction={() => {
              setShowAddForm(true);
              setSelectedCourse(null);
              resetForm();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrollmentStatus = getEnrollmentStatus(course.currentEnrollment, course.maxEnrollment);
              return (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-card p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{course.courseCode}</h3>
                      <h4 className="font-semibold text-primary">{course.title}</h4>
                    </div>
                    <Badge variant={enrollmentStatus.variant}>
                      {enrollmentStatus.text}
                    </Badge>
                  </div>

                  <p className="text-secondary text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">Department:</span>
                      <span className="text-sm font-medium">{course.department}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">Credits:</span>
                      <span className="text-sm font-medium">{course.credits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">Enrollment:</span>
                      <span className="text-sm font-medium">
                        {course.currentEnrollment}/{course.maxEnrollment}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">Term:</span>
                      <span className="text-sm font-medium">{course.semester} {course.year}</span>
                    </div>
                  </div>

                  {course.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm text-secondary">Prerequisites:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(course)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
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
                  {selectedCourse ? "Edit Course" : "Add New Course"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedCourse(null);
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Course Code"
                    required
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="e.g., CS101"
                  />
                  <FormField
                    label="Credits"
                    type="number"
                    required
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    min="1"
                    max="6"
                  />
                </div>

                <FormField
                  label="Course Title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Introduction to Computer Science"
                />

                <FormField
                  label="Description"
                  type="textarea"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Course description..."
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
                    label="Max Enrollment"
                    type="number"
                    required
                    value={formData.maxEnrollment}
                    onChange={(e) => setFormData({ ...formData, maxEnrollment: e.target.value })}
                    min="1"
                    max="100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Semester"
                    type="select"
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    options={semesters.map(sem => ({ value: sem, label: sem }))}
                  />
                  <FormField
                    label="Year"
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    min="2024"
                    max="2030"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedCourse(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-white">
                    {selectedCourse ? "Update Course" : "Add Course"}
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

export default Courses;