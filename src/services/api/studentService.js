import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class StudentService {
  constructor() {
    this.tableName = 'student_c';
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
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "program_c"}},
          {"field": {"Name": "academic_status_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "credits_c"}}
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

      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c,
        lastName: student.last_name_c,
        email: student.email_c,
        phone: student.phone_c,
        dateOfBirth: student.date_of_birth_c,
        address: {
          street: student.address_street_c,
          city: student.address_city_c,
          state: student.address_state_c,
          zipCode: student.address_zip_code_c
        },
        studentId: student.student_id_c,
        enrollmentDate: student.enrollment_date_c,
        program: student.program_c,
        academicStatus: student.academic_status_c,
        gpa: student.gpa_c,
        credits: student.credits_c
      }));
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
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
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "address_street_c"}},
          {"field": {"Name": "address_city_c"}},
          {"field": {"Name": "address_state_c"}},
          {"field": {"Name": "address_zip_code_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "program_c"}},
          {"field": {"Name": "academic_status_c"}},
          {"field": {"Name": "gpa_c"}},
          {"field": {"Name": "credits_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const student = response.data;
      return {
        Id: student.Id,
        firstName: student.first_name_c,
        lastName: student.last_name_c,
        email: student.email_c,
        phone: student.phone_c,
        dateOfBirth: student.date_of_birth_c,
        address: {
          street: student.address_street_c,
          city: student.address_city_c,
          state: student.address_state_c,
          zipCode: student.address_zip_code_c
        },
        studentId: student.student_id_c,
        enrollmentDate: student.enrollment_date_c,
        program: student.program_c,
        academicStatus: student.academic_status_c,
        gpa: student.gpa_c,
        credits: student.credits_c
      };
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(studentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          phone_c: studentData.phone,
          date_of_birth_c: studentData.dateOfBirth,
          address_street_c: studentData.address.street,
          address_city_c: studentData.address.city,
          address_state_c: studentData.address.state,
          address_zip_code_c: studentData.address.zipCode,
          student_id_c: `STU${Date.now()}`,
          enrollment_date_c: new Date().toISOString().split("T")[0],
          program_c: studentData.program,
          academic_status_c: studentData.academicStatus,
          gpa_c: studentData.gpa || 0,
          credits_c: studentData.credits || 0
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
          console.error(`Failed to create ${failed.length} students:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create student");
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, studentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          email_c: studentData.email,
          phone_c: studentData.phone,
          date_of_birth_c: studentData.dateOfBirth,
          address_street_c: studentData.address.street,
          address_city_c: studentData.address.city,
          address_state_c: studentData.address.state,
          address_zip_code_c: studentData.address.zipCode,
          program_c: studentData.program,
          academic_status_c: studentData.academicStatus,
          gpa_c: studentData.gpa,
          credits_c: studentData.credits
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
          console.error(`Failed to update ${failed.length} students:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update student");
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByProgram(program) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "program_c"}},
          {"field": {"Name": "academic_status_c"}}
        ],
        where: [{"FieldName": "program_c", "Operator": "EqualTo", "Values": [program]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching students by program:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByAcademicStatus(status) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "academic_status_c"}}
        ],
        where: [{"FieldName": "academic_status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching students by status:", error?.response?.data?.message || error);
      return [];
    }
  }
}

const studentService = new StudentService();
export default studentService;