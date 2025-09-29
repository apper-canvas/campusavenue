import { toast } from "react-toastify";

class EnrollmentService {
  constructor() {
    this.tableName = 'enrollment_c';
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
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "grade_points_c"}}
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

      return response.data.map(enrollment => ({
        Id: enrollment.Id,
        studentId: enrollment.student_id_c,
        courseId: enrollment.course_id_c,
        semester: enrollment.semester_c,
        year: enrollment.year_c,
        enrollmentDate: enrollment.enrollment_date_c,
        status: enrollment.status_c,
        grade: enrollment.grade_c,
        gradePoints: enrollment.grade_points_c
      }));
    } catch (error) {
      console.error("Error fetching enrollments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "grade_points_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const enrollment = response.data;
      return {
        Id: enrollment.Id,
        studentId: enrollment.student_id_c,
        courseId: enrollment.course_id_c,
        semester: enrollment.semester_c,
        year: enrollment.year_c,
        enrollmentDate: enrollment.enrollment_date_c,
        status: enrollment.status_c,
        grade: enrollment.grade_c,
        gradePoints: enrollment.grade_points_c
      };
    } catch (error) {
      console.error(`Error fetching enrollment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(enrollmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: `${enrollmentData.studentId} - ${enrollmentData.courseId}`,
          student_id_c: enrollmentData.studentId.toString(),
          course_id_c: enrollmentData.courseId.toString(),
          semester_c: enrollmentData.semester,
          year_c: enrollmentData.year,
          enrollment_date_c: enrollmentData.enrollmentDate || new Date().toISOString().split("T")[0],
          status_c: enrollmentData.status || "enrolled",
          grade_c: enrollmentData.grade || "",
          grade_points_c: enrollmentData.gradePoints || 0
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
          console.error(`Failed to create ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create enrollment");
    } catch (error) {
      console.error("Error creating enrollment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, enrollmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${enrollmentData.studentId || ''} - ${enrollmentData.courseId || ''}`,
          student_id_c: enrollmentData.studentId?.toString(),
          course_id_c: enrollmentData.courseId?.toString(),
          semester_c: enrollmentData.semester,
          year_c: enrollmentData.year,
          enrollment_date_c: enrollmentData.enrollmentDate,
          status_c: enrollmentData.status,
          grade_c: enrollmentData.grade,
          grade_points_c: enrollmentData.gradePoints
        }]
      };
      
      // Remove undefined fields from the record
      const record = params.records[0];
      Object.keys(record).forEach(key => {
        if (record[key] === undefined) {
          delete record[key];
        }
      });
      
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
          console.error(`Failed to update ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update enrollment");
    } catch (error) {
      console.error("Error updating enrollment:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting enrollment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByStudent(studentId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "grade_points_c"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [studentId.toString()]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching enrollments by student:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByCourse(courseId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "grade_points_c"}}
        ],
        where: [{"FieldName": "course_id_c", "Operator": "EqualTo", "Values": [courseId.toString()]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching enrollments by course:", error?.response?.data?.message || error);
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
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "grade_points_c"}}
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
      console.error("Error fetching enrollments by semester:", error?.response?.data?.message || error);
      return [];
    }
  }
}
}

const enrollmentService = new EnrollmentService();
export default enrollmentService;