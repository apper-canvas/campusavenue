import scheduleData from "@/services/mockData/schedules.json";

class ScheduleService {
  constructor() {
    this.schedules = [...scheduleData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.schedules];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const schedule = this.schedules.find(s => s.Id === parseInt(id));
    if (!schedule) {
      throw new Error("Schedule not found");
    }
    return { ...schedule };
  }

  async create(scheduleData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.schedules.map(s => s.Id), 0);
    const newSchedule = {
      Id: maxId + 1,
      ...scheduleData
    };
    this.schedules.push(newSchedule);
    return { ...newSchedule };
  }

  async update(id, scheduleData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    this.schedules[index] = { ...this.schedules[index], ...scheduleData };
    return { ...this.schedules[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.schedules.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Schedule not found");
    }
    const deletedSchedule = { ...this.schedules[index] };
    this.schedules.splice(index, 1);
    return deletedSchedule;
  }

  async getBySemester(semester, year) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.schedules.filter(s => s.semester === semester && s.year === year);
  }

  async getByFaculty(facultyId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.schedules.filter(s => s.facultyId === facultyId);
  }
}

export default new ScheduleService();