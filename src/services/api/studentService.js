import studentData from "@/services/mockData/students.json";

class StudentService {
  constructor() {
    this.students = [...studentData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.students];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const student = this.students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  }

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.students.map(s => s.Id), 0);
    const newStudent = {
      Id: maxId + 1,
      studentId: `STU${(maxId + 1).toString().padStart(5, "0")}`,
      enrollmentDate: new Date().toISOString().split("T")[0],
      ...studentData
    };
    this.students.push(newStudent);
    return { ...newStudent };
  }

  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    this.students[index] = { ...this.students[index], ...studentData };
    return { ...this.students[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    const deletedStudent = { ...this.students[index] };
    this.students.splice(index, 1);
    return deletedStudent;
  }

  async getByProgram(program) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.students.filter(s => s.program === program);
  }

  async getByAcademicStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.students.filter(s => s.academicStatus === status);
  }
}

export default new StudentService();