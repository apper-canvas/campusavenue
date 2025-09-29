import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import courseService from "@/services/api/courseService";
import facultyService from "@/services/api/facultyService";
import enrollmentService from "@/services/api/enrollmentService";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, courses, faculty, enrollments] = await Promise.all([
        studentService.getAll(),
        courseService.getAll(),
        facultyService.getAll(),
        enrollmentService.getAll()
      ]);

      const activeStudents = students.filter(s => s.academicStatus === "Active").length;
      const probationStudents = students.filter(s => s.academicStatus === "Probation").length;
      const totalEnrollment = enrollments.length;
      const avgGPA = students.reduce((sum, student) => sum + student.gpa, 0) / students.length;

      setStats({
        totalStudents: students.length,
        activeStudents,
        probationStudents,
        totalCourses: courses.length,
        totalFaculty: faculty.length,
        totalEnrollment,
        avgGPA: avgGPA.toFixed(2)
      });

      // Generate recent activity from enrollments
      const recentEnrollments = enrollments
        .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
        .slice(0, 8)
        .map(enrollment => {
          const student = students.find(s => s.studentId === enrollment.studentId);
          const course = courses.find(c => c.Id === parseInt(enrollment.courseId));
          return {
            id: enrollment.Id,
            type: "enrollment",
            message: `${student?.firstName} ${student?.lastName} enrolled in ${course?.title}`,
            timestamp: enrollment.enrollmentDate
          };
        });

      setRecentActivity(recentEnrollments);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to Campus Hub</h1>
        <p className="text-blue-100">
          Comprehensive college management at your fingertips
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          trend="up"
          trendValue="+12%"
          gradient
        />
        <StatCard
          title="Active Courses"
          value={stats.totalCourses}
          icon="BookOpen"
          trend="up"
          trendValue="+3%"
          gradient
        />
        <StatCard
          title="Faculty Members"
          value={stats.totalFaculty}
          icon="UserCheck"
          trend="stable"
          trendValue="0%"
          gradient
        />
        <StatCard
          title="Average GPA"
          value={stats.avgGPA}
          icon="Award"
          trend="up"
          trendValue="+0.2"
          gradient
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Academic Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-card p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ApperIcon name="PieChart" size={20} className="text-accent mr-2" />
            Student Status Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success rounded-full mr-3"></div>
                <span className="font-medium">Active Students</span>
              </div>
              <span className="text-success font-bold text-lg">{stats.activeStudents}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border border-warning/20">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning rounded-full mr-3"></div>
                <span className="font-medium">On Probation</span>
              </div>
              <span className="text-warning font-bold text-lg">{stats.probationStudents}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-accent rounded-full mr-3"></div>
                <span className="font-medium">Total Enrollments</span>
              </div>
              <span className="text-accent font-bold text-lg">{stats.totalEnrollment}</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-card p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <ApperIcon name="Activity" size={20} className="text-accent mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-2 rounded-full">
                  <ApperIcon name="UserPlus" size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-secondary mt-1">{activity.timestamp}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-card p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ApperIcon name="Zap" size={20} className="text-accent mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 hover:shadow-md transition-all duration-200"
          >
            <ApperIcon name="UserPlus" size={20} className="text-primary mr-3" />
            <span className="font-medium text-gray-900">Add Student</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20 hover:shadow-md transition-all duration-200"
          >
            <ApperIcon name="BookPlus" size={20} className="text-accent mr-3" />
            <span className="font-medium text-gray-900">New Course</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20 hover:shadow-md transition-all duration-200"
          >
            <ApperIcon name="Calendar" size={20} className="text-success mr-3" />
            <span className="font-medium text-gray-900">Schedule Class</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border border-warning/20 hover:shadow-md transition-all duration-200"
          >
            <ApperIcon name="FileText" size={20} className="text-warning mr-3" />
            <span className="font-medium text-gray-900">Generate Report</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;