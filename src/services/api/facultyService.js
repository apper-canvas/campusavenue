import facultyData from "@/services/mockData/faculty.json";

class FacultyService {
  constructor() {
    this.faculty = [...facultyData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.faculty];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const member = this.faculty.find(f => f.Id === parseInt(id));
    if (!member) {
      throw new Error("Faculty member not found");
    }
    return { ...member };
  }

  async create(facultyData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.faculty.map(f => f.Id), 0);
    const newFaculty = {
      Id: maxId + 1,
      courses: [],
      ...facultyData
    };
    this.faculty.push(newFaculty);
    return { ...newFaculty };
  }

  async update(id, facultyData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.faculty.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Faculty member not found");
    }
    this.faculty[index] = { ...this.faculty[index], ...facultyData };
    return { ...this.faculty[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.faculty.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Faculty member not found");
    }
    const deletedFaculty = { ...this.faculty[index] };
    this.faculty.splice(index, 1);
    return deletedFaculty;
  }

  async getByDepartment(department) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.faculty.filter(f => f.department === department);
  }
}

export default new FacultyService();