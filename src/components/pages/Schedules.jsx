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
import scheduleService from "@/services/api/scheduleService";
import courseService from "@/services/api/courseService";
import facultyService from "@/services/api/facultyService";

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    courseId: "",
    facultyId: "",
    room: "",
    dayOfWeek: "Monday",
    startTime: "",
    endTime: "",
    semester: "Fall",
    year: new Date().getFullYear()
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const semesters = ["Fall", "Spring", "Summer"];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [schedulesData, coursesData, facultyData] = await Promise.all([
        scheduleService.getAll(),
        courseService.getAll(),
        facultyService.getAll()
      ]);
      
      setSchedules(schedulesData);
      setFilteredSchedules(schedulesData);
      setCourses(coursesData);
      setFaculty(facultyData);
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
    let filtered = schedules;

    if (searchTerm) {
      filtered = filtered.filter(schedule => {
        const course = courses.find(c => c.Id === parseInt(schedule.courseId));
        const facultyMember = faculty.find(f => f.Id === parseInt(schedule.facultyId));
        
        return (
          course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course?.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${facultyMember?.firstName} ${facultyMember?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          schedule.room.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filterDay) {
      filtered = filtered.filter(schedule => schedule.dayOfWeek === filterDay);
    }

    if (filterSemester) {
      filtered = filtered.filter(schedule => schedule.semester === filterSemester);
    }

    setFilteredSchedules(filtered);
  }, [schedules, searchTerm, filterDay, filterSemester, courses, faculty]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const scheduleData = {
        ...formData,
        year: parseInt(formData.year)
      };

      if (selectedSchedule) {
        await scheduleService.update(selectedSchedule.Id, scheduleData);
        toast.success("Schedule updated successfully!");
      } else {
        await scheduleService.create(scheduleData);
        toast.success("Schedule created successfully!");
      }

      setShowAddForm(false);
      setSelectedSchedule(null);
      resetForm();
      loadData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      courseId: schedule.courseId,
      facultyId: schedule.facultyId,
      room: schedule.room,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      semester: schedule.semester,
      year: schedule.year
    });
    setShowAddForm(true);
  };

  const handleDelete = async (schedule) => {
    const course = courses.find(c => c.Id === parseInt(schedule.courseId));
    if (window.confirm(`Are you sure you want to delete the schedule for ${course?.title}?`)) {
      try {
        await scheduleService.delete(schedule.Id);
        toast.success("Schedule deleted successfully!");
        loadData();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: "",
      facultyId: "",
      room: "",
      dayOfWeek: "Monday",
      startTime: "",
      endTime: "",
      semester: "Fall",
      year: new Date().getFullYear()
    });
  };

  const getDayColor = (day) => {
    const colors = {
      Monday: "primary",
      Tuesday: "accent",
      Wednesday: "success",
      Thursday: "warning",
      Friday: "info",
      Saturday: "secondary"
    };
    return colors[day] || "secondary";
  };

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
          <h1 className="text-2xl font-bold text-gray-900 gradient-text">Class Schedules</h1>
          <p className="text-secondary mt-1">Manage course schedules and room assignments</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true);
            setSelectedSchedule(null);
            resetForm();
          }}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-primary to-accent text-white"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Create Schedule
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
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormField
            type="select"
            placeholder="Filter by Day"
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            options={[
              { value: "", label: "All Days" },
              ...daysOfWeek.map(day => ({ value: day, label: day }))
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

      {/* Schedules Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredSchedules.length === 0 ? (
          <Empty
            type="schedules"
            onAction={() => {
              setShowAddForm(true);
              setSelectedSchedule(null);
              resetForm();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule) => {
              const course = courses.find(c => c.Id === parseInt(schedule.courseId));
              const facultyMember = faculty.find(f => f.Id === parseInt(schedule.facultyId));
              
              return (
                <motion.div
                  key={schedule.Id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-card p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {course?.courseCode}
                      </h3>
                      <h4 className="font-semibold text-primary text-sm">
                        {course?.title}
                      </h4>
                    </div>
                    <Badge variant={getDayColor(schedule.dayOfWeek)}>
                      {schedule.dayOfWeek}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="User" size={16} className="text-secondary" />
                      <span className="text-sm text-secondary">
                        {facultyMember?.firstName} {facultyMember?.lastName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="MapPin" size={16} className="text-secondary" />
                      <span className="text-sm text-secondary">{schedule.room}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Clock" size={16} className="text-secondary" />
                      <span className="text-sm text-secondary">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" size={16} className="text-secondary" />
                      <span className="text-sm text-secondary">
                        {schedule.semester} {schedule.year}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                      <span className="text-sm text-primary font-medium">
                        {(() => {
                          const start = new Date(`1970-01-01T${schedule.startTime}`);
                          const end = new Date(`1970-01-01T${schedule.endTime}`);
                          const duration = (end - start) / (1000 * 60);
                          return `${duration} minutes`;
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(schedule)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(schedule)}
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
                  {selectedSchedule ? "Edit Schedule" : "Create New Schedule"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedSchedule(null);
                  }}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Course"
                    type="select"
                    required
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    options={courses.map(course => ({ 
                      value: course.Id.toString(), 
                      label: `${course.courseCode} - ${course.title}` 
                    }))}
                  />
                  <FormField
                    label="Instructor"
                    type="select"
                    required
                    value={formData.facultyId}
                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                    options={faculty.map(member => ({ 
                      value: member.Id.toString(), 
                      label: `${member.firstName} ${member.lastName}` 
                    }))}
                  />
                </div>

                <FormField
                  label="Room"
                  required
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="e.g., Tech 101"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="Day of Week"
                    type="select"
                    required
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    options={daysOfWeek.map(day => ({ value: day, label: day }))}
                  />
                  <FormField
                    label="Start Time"
                    type="select"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    options={timeSlots.map(time => ({ value: time, label: time }))}
                  />
                  <FormField
                    label="End Time"
                    type="select"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    options={timeSlots.map(time => ({ value: time, label: time }))}
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
                      setSelectedSchedule(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-white">
                    {selectedSchedule ? "Update Schedule" : "Create Schedule"}
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

export default Schedules;