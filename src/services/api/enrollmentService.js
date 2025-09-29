import enrollmentData from "@/services/mockData/enrollments.json";

class EnrollmentService {
  constructor() {
    this.enrollments = [...enrollmentData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.enrollments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const enrollment = this.enrollments.find(e => e.Id === parseInt(id));
    if (!enrollment) {
      throw new Error("Enrollment not found");
    }
    return { ...enrollment };
  }

  async create(enrollmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.enrollments.map(e => e.Id), 0);
    const newEnrollment = {
      Id: maxId + 1,
      enrollmentDate: new Date().toISOString().split("T")[0],
      status: "enrolled",
      ...enrollmentData
    };
    this.enrollments.push(newEnrollment);
    return { ...newEnrollment };
  }

  async update(id, enrollmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.enrollments.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Enrollment not found");
    }
    this.enrollments[index] = { ...this.enrollments[index], ...enrollmentData };
    return { ...this.enrollments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.enrollments.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Enrollment not found");
    }
    const deletedEnrollment = { ...this.enrollments[index] };
    this.enrollments.splice(index, 1);
    return deletedEnrollment;
  }

  async getByStudent(studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.enrollments.filter(e => e.studentId === studentId);
  }

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.enrollments.filter(e => e.courseId === courseId);
  }

  async getBySemester(semester, year) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.enrollments.filter(e => e.semester === semester && e.year === year);
  }
}

export default new EnrollmentService();