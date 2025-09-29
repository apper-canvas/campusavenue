import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FormField from "@/components/molecules/FormField";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import enrollmentService from "@/services/api/enrollmentService";
import studentService from "@/services/api/studentService";
import courseService from "@/services/api/courseService";

const Grades = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [gradeData, setGradeData] = useState({
    grade: "",
    gradePoints: ""
  });

  const grades = [
    { letter: "A+", points: 4.0 },
    { letter: "A", points: 4.0 },
    { letter: "A-", points: 3.7 },
    { letter: "B+", points: 3.3 },
    { letter: "B", points: 3.0 },
    { letter: "B-", points: 2.7 },
    { letter: "C+", points: 2.3 },
    { letter: "C", points: 2.0 },
    { letter: "C-", points: 1.7 },
    { letter: "D+", points: 1.3 },
    { letter: "D", points: 1.0 },
    { letter: "F", points: 0.0 }
  ];

  const semesters = ["Fall", "Spring", "Summer"];
  const currentYear = new Date().getFullYear();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        enrollmentService.getAll(),
        studentService.getAll(),
        courseService.getAll()
      ]);
      
      setEnrollments(enrollmentsData);
      setFilteredEnrollments(enrollmentsData);
      setStudents(studentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = enrollments;

    if (searchTerm) {
      filtered = filtered.filter(enrollment => {
        const student = students.find(s => s.studentId === enrollment.studentId);
        const course = courses.find(c => c.Id === parseInt(enrollment.courseId));
        
        return (
          student && `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student?.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course?.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filterCourse) {
      filtered = filtered.filter(enrollment => enrollment.courseId === filterCourse);
    }

    if (filterSemester) {
      filtered = filtered.filter(enrollment => enrollment.semester === filterSemester);
    }

    setFilteredEnrollments(filtered);
  }, [enrollments, searchTerm, filterCourse, filterSemester, students, courses]);

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await enrollmentService.update(selectedEnrollment.Id, {
        grade: gradeData.grade,
        gradePoints: parseFloat(gradeData.gradePoints)
      });
      
      toast.success("Grade updated successfully!");
      setShowGradeForm(false);
      setSelectedEnrollment(null);
      setGradeData({ grade: "", gradePoints: "" });
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditGrade = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setGradeData({
      grade: enrollment.grade || "",
      gradePoints: enrollment.gradePoints?.toString() || ""
    });
    setShowGradeForm(true);
  };

  const handleGradeChange = (selectedGrade) => {
    const gradeInfo = grades.find(g => g.letter === selectedGrade);
    setGradeData({
      grade: selectedGrade,
      gradePoints: gradeInfo ? gradeInfo.points.toString() : ""
    });
  };

  const getGradeVariant = (grade) => {
    if (!grade) return "secondary";
    if (["A+", "A", "A-"].includes(grade)) return "success";
    if (["B+", "B", "B-"].includes(grade)) return "primary";
    if (["C+", "C", "C-"].includes(grade)) return "warning";
    if (["D+", "D"].includes(grade)) return "info";
    return "error";
  };

  const columns = [
    {
      key: "studentName",
      label: "Student",
      sortable: true,
      render: (_, enrollment) => {
        const student = students.find(s => s.studentId === enrollment.studentId);
        return student ? `${student.firstName} ${student.lastName}` : "Unknown";
      }
    },
    {
      key: "studentId",
      label: "Student ID",
      sortable: true,
      render: (_, enrollment) => enrollment.studentId
    },
    {
      key: "courseName",
      label: "Course",
      sortable: true,
      render: (_, enrollment) => {
        const course = courses.find(c => c.Id === parseInt(enrollment.courseId));
        return course ? `${course.courseCode} - ${course.title}` : "Unknown";
      }
    },
    {
      key: "semester",
      label: "Term",
      sortable: true,
      render: (_, enrollment) => `${enrollment.semester} ${enrollment.year}`
    },
    {
      key: "grade",
      label: "Grade",
      render: (grade) => (
        <div className="flex items-center space-x-2">
          {grade ? (
            <Badge variant={getGradeVariant(grade)}>
              {grade}
            </Badge>
          ) : (
            <Badge variant="secondary">
              Not Graded
            </Badge>
          )}
        </div>
      )
    },
    {
      key: "gradePoints",
      label: "Points",
      sortable: true,
      render: (points) => points ? points.toFixed(1) : "-"
    },
    {
      key: "status",
      label: "Status",
      render: (_, enrollment) => (
        <Badge variant={enrollment.status === "enrolled" ? "success" : "secondary"}>
          {enrollment.status}
        </Badge>
      )
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 gradient-text">Grade Management</h1>
          <p className="text-secondary mt-1">Record and manage student grades</p>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-3 rounded-lg">
              <ApperIcon name="Users" size={24} className="text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm">Graded</p>
              <p className="text-2xl font-bold text-success">
                {enrollments.filter(e => e.grade).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-success/10 to-success/5 p-3 rounded-lg">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm">Pending</p>
              <p className="text-2xl font-bold text-warning">
                {enrollments.filter(e => !e.grade).length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-warning/10 to-warning/5 p-3 rounded-lg">
              <ApperIcon name="Clock" size={24} className="text-warning" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm">Average GPA</p>
              <p className="text-2xl font-bold gradient-text">
                {enrollments.filter(e => e.gradePoints).length > 0 
                  ? (enrollments.reduce((sum, e) => sum + (e.gradePoints || 0), 0) / 
                     enrollments.filter(e => e.gradePoints).length).toFixed(2)
                  : "0.00"
                }
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-3 rounded-lg">
              <ApperIcon name="Award" size={24} className="text-accent" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-card p-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            placeholder="Search students or courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormField
            type="select"
            placeholder="Filter by Course"
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            options={[
              { value: "", label: "All Courses" },
              ...courses.map(course => ({ 
                value: course.Id.toString(), 
                label: `${course.courseCode} - ${course.title}` 
              }))
            ]}
          />
          <FormField
            type="select"
            placeholder="Filter by Semester"
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            options={[
              { value: "", label: "All Semesters" },
              ...semesters.map(sem => ({ value: sem, label: `${sem} ${currentYear}` }))
            ]}
          />
        </div>
      </motion.div>

      {/* Grades Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredEnrollments.length === 0 ? (
          <Empty 
            type="grades" 
            title="No enrollments found"
            description="No student enrollments match your current filters."
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredEnrollments}
            onEdit={handleEditGrade}
          />
        )}
      </motion.div>

      {/* Grade Form Modal */}
      {showGradeForm && selectedEnrollment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Enter Grade</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowGradeForm(false);
                    setSelectedEnrollment(null);
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <div className="mb-4 p-4 bg-surface rounded-lg">
                <div className="text-sm text-secondary mb-1">Student:</div>
                <div className="font-medium">
                  {(() => {
                    const student = students.find(s => s.studentId === selectedEnrollment.studentId);
                    return student ? `${student.firstName} ${student.lastName}` : "Unknown";
                  })()}
                </div>
                <div className="text-sm text-secondary mt-2 mb-1">Course:</div>
                <div className="font-medium">
                  {(() => {
                    const course = courses.find(c => c.Id === parseInt(selectedEnrollment.courseId));
                    return course ? `${course.courseCode} - ${course.title}` : "Unknown";
                  })()}
                </div>
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <FormField
                  label="Grade"
                  type="select"
                  required
                  value={gradeData.grade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  options={grades.map(grade => ({ 
                    value: grade.letter, 
                    label: `${grade.letter} (${grade.points})` 
                  }))}
                />

                <FormField
                  label="Grade Points"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  required
                  value={gradeData.gradePoints}
                  onChange={(e) => setGradeData({ ...gradeData, gradePoints: e.target.value })}
                  disabled
                />

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowGradeForm(false);
                      setSelectedEnrollment(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-white">
                    Save Grade
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

export default Grades;