import courseData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...courseData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.courses];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = this.courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.courses.map(c => c.Id), 0);
    const newCourse = {
      Id: maxId + 1,
      currentEnrollment: 0,
      ...courseData
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    this.courses[index] = { ...this.courses[index], ...courseData };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    const deletedCourse = { ...this.courses[index] };
    this.courses.splice(index, 1);
    return deletedCourse;
  }

  async getByDepartment(department) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.courses.filter(c => c.department === department);
  }

  async getBySemester(semester, year) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.courses.filter(c => c.semester === semester && c.year === year);
  }
}

export default new CourseService();