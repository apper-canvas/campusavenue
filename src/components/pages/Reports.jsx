import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import studentService from "@/services/api/studentService";
import courseService from "@/services/api/courseService";
import facultyService from "@/services/api/facultyService";
import enrollmentService from "@/services/api/enrollmentService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState("current");

  const reportTypes = [
    { value: "overview", label: "Overview", icon: "BarChart3" },
    { value: "enrollment", label: "Enrollment Trends", icon: "TrendingUp" },
    { value: "academic", label: "Academic Performance", icon: "Award" },
    { value: "faculty", label: "Faculty Workload", icon: "Users" }
  ];

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, courses, faculty, enrollments] = await Promise.all([
        studentService.getAll(),
        courseService.getAll(),
        facultyService.getAll(),
        enrollmentService.getAll()
      ]);

      // Process enrollment data by program
      const programEnrollment = students.reduce((acc, student) => {
        acc[student.program] = (acc[student.program] || 0) + 1;
        return acc;
      }, {});

      // Process academic status data
      const statusData = students.reduce((acc, student) => {
        acc[student.academicStatus] = (acc[student.academicStatus] || 0) + 1;
        return acc;
      }, {});

      // Process grade distribution
      const gradeDistribution = enrollments.reduce((acc, enrollment) => {
        if (enrollment.grade) {
          acc[enrollment.grade] = (acc[enrollment.grade] || 0) + 1;
        }
        return acc;
      }, {});

      // Process department distribution
      const departmentDistribution = faculty.reduce((acc, member) => {
        acc[member.department] = (acc[member.department] || 0) + 1;
        return acc;
      }, {});

      // Calculate monthly enrollment trend (mock data for demonstration)
      const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
      const enrollmentTrend = months.map(() => Math.floor(Math.random() * 50) + 200);

      setData({
        students,
        courses,
        faculty,
        enrollments,
        programEnrollment,
        statusData,
        gradeDistribution,
        departmentDistribution,
        enrollmentTrend,
        months
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  const generateProgramChart = () => {
    const programs = Object.keys(data.programEnrollment || {});
    const counts = Object.values(data.programEnrollment || {});

    return {
      labels: programs,
      datasets: [{
        label: "Students",
        data: counts,
        backgroundColor: [
          "rgba(30, 58, 138, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(5, 150, 105, 0.8)",
          "rgba(217, 119, 6, 0.8)",
          "rgba(220, 38, 38, 0.8)",
          "rgba(2, 132, 199, 0.8)",
          "rgba(147, 51, 234, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)"
        ],
        borderColor: [
          "rgba(30, 58, 138, 1)",
          "rgba(14, 165, 233, 1)",
          "rgba(5, 150, 105, 1)",
          "rgba(217, 119, 6, 1)",
          "rgba(220, 38, 38, 1)",
          "rgba(2, 132, 199, 1)",
          "rgba(147, 51, 234, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        borderWidth: 2
      }]
    };
  };

  const generateStatusChart = () => {
    const statuses = Object.keys(data.statusData || {});
    const counts = Object.values(data.statusData || {});

    return {
      labels: statuses,
      datasets: [{
        data: counts,
        backgroundColor: [
          "rgba(5, 150, 105, 0.8)",
          "rgba(217, 119, 6, 0.8)",
          "rgba(220, 38, 38, 0.8)",
          "rgba(100, 116, 139, 0.8)"
        ],
        borderColor: [
          "rgba(5, 150, 105, 1)",
          "rgba(217, 119, 6, 1)",
          "rgba(220, 38, 38, 1)",
          "rgba(100, 116, 139, 1)"
        ],
        borderWidth: 2
      }]
    };
  };

  const generateEnrollmentTrendChart = () => {
    return {
      labels: data.months || [],
      datasets: [{
        label: "New Enrollments",
        data: data.enrollmentTrend || [],
        borderColor: "rgba(30, 58, 138, 1)",
        backgroundColor: "rgba(30, 58, 138, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgba(30, 58, 138, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter"
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          family: "Inter"
        },
        bodyFont: {
          size: 12,
          family: "Inter"
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: "Inter"
          }
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)"
        }
      },
      x: {
        ticks: {
          font: {
            family: "Inter"
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Inter"
          }
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8
      }
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 gradient-text">Analytics & Reports</h1>
          <p className="text-secondary mt-1">Comprehensive insights into institutional performance</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <FormField
            type="select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={[
              { value: "current", label: "Current Semester" },
              { value: "year", label: "Academic Year" },
              { value: "all", label: "All Time" }
            ]}
          />
          <Button className="bg-gradient-to-r from-primary to-accent text-white">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Report Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-card p-6 border border-gray-200"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportTypes.map((report) => (
            <motion.button
              key={report.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedReport(report.value)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedReport === report.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <ApperIcon name={report.icon} size={24} className="mb-2" />
              <span className="text-sm font-medium">{report.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Students</p>
              <p className="text-3xl font-bold">{data.students?.length || 0}</p>
              <p className="text-blue-100 text-sm mt-1">+12% from last semester</p>
            </div>
            <ApperIcon name="Users" size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-success to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Course Completion</p>
              <p className="text-3xl font-bold">94%</p>
              <p className="text-green-100 text-sm mt-1">+3% improvement</p>
            </div>
            <ApperIcon name="CheckCircle" size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-warning to-amber-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Average GPA</p>
              <p className="text-3xl font-bold">3.6</p>
              <p className="text-yellow-100 text-sm mt-1">Institutional average</p>
            </div>
            <ApperIcon name="Award" size={32} className="text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-info to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Faculty Ratio</p>
              <p className="text-3xl font-bold">1:15</p>
              <p className="text-cyan-100 text-sm mt-1">Student to faculty</p>
            </div>
            <ApperIcon name="UserCheck" size={32} className="text-cyan-200" />
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      {selectedReport === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="PieChart" size={20} className="text-accent mr-2" />
              Enrollment by Program
            </h3>
            <div className="h-80">
              <Bar data={generateProgramChart()} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Target" size={20} className="text-accent mr-2" />
              Student Status Distribution
            </h3>
            <div className="h-80">
              <Doughnut data={generateStatusChart()} options={pieOptions} />
            </div>
          </div>
        </motion.div>
      )}

      {selectedReport === "enrollment" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-card p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="TrendingUp" size={20} className="text-accent mr-2" />
            Enrollment Trends Over Time
          </h3>
          <div className="h-96">
            <Line data={generateEnrollmentTrendChart()} options={chartOptions} />
          </div>
        </motion.div>
      )}

      {selectedReport === "academic" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Award" size={20} className="text-accent mr-2" />
              Grade Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(data.gradeDistribution || {}).map(([grade, count]) => (
                <div key={grade} className="text-center p-4 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-secondary">{grade}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Top Performers</h4>
              <div className="space-y-3">
                {data.students?.filter(s => s.gpa >= 3.8).slice(0, 5).map((student, index) => (
                  <div key={student.Id} className="flex items-center justify-between">
                    <span className="text-sm">{student.firstName} {student.lastName}</span>
                    <Badge variant="success">{student.gpa.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">At Risk Students</h4>
              <div className="space-y-3">
                {data.students?.filter(s => s.gpa < 2.5).slice(0, 5).map((student, index) => (
                  <div key={student.Id} className="flex items-center justify-between">
                    <span className="text-sm">{student.firstName} {student.lastName}</span>
                    <Badge variant="warning">{student.gpa.toFixed(2)}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Program Performance</h4>
              <div className="space-y-3">
                {Object.entries(data.programEnrollment || {}).slice(0, 5).map(([program, count]) => (
                  <div key={program} className="flex items-center justify-between">
                    <span className="text-sm">{program}</span>
                    <Badge variant="primary">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {selectedReport === "faculty" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Users" size={20} className="text-accent mr-2" />
              Faculty Distribution by Department
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(data.departmentDistribution || {}).map(([dept, count]) => (
                <div key={dept} className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-secondary">{dept}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Faculty Workload Analysis</h4>
              <div className="space-y-4">
                {data.faculty?.slice(0, 6).map((member) => (
                  <div key={member.Id} className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{member.firstName} {member.lastName}</div>
                      <div className="text-xs text-secondary">{member.department}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm">{member.courses.length}/{member.maxCourseLoad}</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                          style={{ width: `${(member.courses.length / member.maxCourseLoad) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-card p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Course Load Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <span className="text-sm font-medium">Optimal Load (75-100%)</span>
                  <Badge variant="success">
                    {data.faculty?.filter(f => {
                      const load = f.courses.length / f.maxCourseLoad;
                      return load >= 0.75 && load <= 1.0;
                    }).length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                  <span className="text-sm font-medium">Under-utilized (&lt;75%)</span>
                  <Badge variant="warning">
                    {data.faculty?.filter(f => (f.courses.length / f.maxCourseLoad) < 0.75).length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-error/10 rounded-lg">
                  <span className="text-sm font-medium">Overloaded (&gt;100%)</span>
                  <Badge variant="error">
                    {data.faculty?.filter(f => (f.courses.length / f.maxCourseLoad) > 1.0).length || 0}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;