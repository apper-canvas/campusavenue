import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class FacultyService {
  constructor() {
    this.tableName = 'faculty_c';
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "office_location_c"}},
          {"field": {"Name": "courses_c"}},
          {"field": {"Name": "max_course_load_c"}}
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

      return response.data.map(faculty => ({
        Id: faculty.Id,
        firstName: faculty.first_name_c,
        lastName: faculty.last_name_c,
        email: faculty.email_c,
        department: faculty.department_c,
        position: faculty.position_c,
        officeLocation: faculty.office_location_c,
        courses: faculty.courses_c ? faculty.courses_c.split(',') : [],
        maxCourseLoad: faculty.max_course_load_c
      }));
    } catch (error) {
      console.error("Error fetching faculty:", error?.response?.data?.message || error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "office_location_c"}},
          {"field": {"Name": "courses_c"}},
          {"field": {"Name": "max_course_load_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const faculty = response.data;
      return {
        Id: faculty.Id,
        firstName: faculty.first_name_c,
        lastName: faculty.last_name_c,
        email: faculty.email_c,
        department: faculty.department_c,
        position: faculty.position_c,
        officeLocation: faculty.office_location_c,
        courses: faculty.courses_c ? faculty.courses_c.split(',') : [],
        maxCourseLoad: faculty.max_course_load_c
      };
    } catch (error) {
      console.error(`Error fetching faculty ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(facultyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: `${facultyData.firstName} ${facultyData.lastName}`,
          first_name_c: facultyData.firstName,
          last_name_c: facultyData.lastName,
          email_c: facultyData.email,
          department_c: facultyData.department,
          position_c: facultyData.position,
          office_location_c: facultyData.officeLocation,
          courses_c: '',
          max_course_load_c: facultyData.maxCourseLoad
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
          console.error(`Failed to create ${failed.length} faculty:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create faculty");
    } catch (error) {
      console.error("Error creating faculty:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, facultyData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${facultyData.firstName} ${facultyData.lastName}`,
          first_name_c: facultyData.firstName,
          last_name_c: facultyData.lastName,
          email_c: facultyData.email,
          department_c: facultyData.department,
          position_c: facultyData.position,
          office_location_c: facultyData.officeLocation,
          courses_c: Array.isArray(facultyData.courses) ? facultyData.courses.join(',') : facultyData.courses,
          max_course_load_c: facultyData.maxCourseLoad
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
          console.error(`Failed to update ${failed.length} faculty:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update faculty");
    } catch (error) {
      console.error("Error updating faculty:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} faculty:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting faculty:", error?.response?.data?.message || error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "position_c"}}
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
      console.error("Error fetching faculty by department:", error?.response?.data?.message || error);
      return [];
    }
  }
}

const facultyService = new FacultyService();
export default facultyService;