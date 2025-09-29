import { toast } from 'react-toastify';

class CourseService {
  constructor() {
    this.tableName = 'course_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_code_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "prerequisites_c"}},
          {"field": {"Name": "max_enrollment_c"}},
          {"field": {"Name": "current_enrollment_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(course => ({
        Id: course.Id,
        courseCode: course.course_code_c,
        title: course.title_c,
        description: course.description_c,
        credits: course.credits_c,
        department: course.department_c,
        prerequisites: course.prerequisites_c ? course.prerequisites_c.split(',') : [],
        maxEnrollment: course.max_enrollment_c,
        currentEnrollment: course.current_enrollment_c || 0,
        semester: course.semester_c,
        year: course.year_c
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_code_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "prerequisites_c"}},
          {"field": {"Name": "max_enrollment_c"}},
          {"field": {"Name": "current_enrollment_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const course = response.data;
      return {
        Id: course.Id,
        courseCode: course.course_code_c,
        title: course.title_c,
        description: course.description_c,
        credits: course.credits_c,
        department: course.department_c,
        prerequisites: course.prerequisites_c ? course.prerequisites_c.split(',') : [],
        maxEnrollment: course.max_enrollment_c,
        currentEnrollment: course.current_enrollment_c || 0,
        semester: course.semester_c,
        year: course.year_c
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(courseData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: courseData.title,
          course_code_c: courseData.courseCode,
          title_c: courseData.title,
          description_c: courseData.description,
          credits_c: courseData.credits,
          department_c: courseData.department,
          prerequisites_c: Array.isArray(courseData.prerequisites) ? courseData.prerequisites.join(',') : courseData.prerequisites,
          max_enrollment_c: courseData.maxEnrollment,
          current_enrollment_c: 0,
          semester_c: courseData.semester,
          year_c: courseData.year
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create course");
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, courseData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: courseData.title,
          course_code_c: courseData.courseCode,
          title_c: courseData.title,
          description_c: courseData.description,
          credits_c: courseData.credits,
          department_c: courseData.department,
          prerequisites_c: Array.isArray(courseData.prerequisites) ? courseData.prerequisites.join(',') : courseData.prerequisites,
          max_enrollment_c: courseData.maxEnrollment,
          current_enrollment_c: courseData.currentEnrollment || 0,
          semester_c: courseData.semester,
          year_c: courseData.year
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update course");
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByDepartment(department) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_code_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "department_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getBySemester(semester, year) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_code_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}}
        ],
        where: [
          {"FieldName": "semester_c", "Operator": "EqualTo", "Values": [semester]},
          {"FieldName": "year_c", "Operator": "EqualTo", "Values": [year]}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses by semester:", error?.response?.data?.message || error);
      return [];
    }
  }
}

const courseService = new CourseService();
export default courseService;

export default new CourseService();