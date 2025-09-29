import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

class ScheduleService {
  constructor() {
    this.tableName = 'schedule_c';
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
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "faculty_id_c"}},
          {"field": {"Name": "room_c"}},
          {"field": {"Name": "day_of_week_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
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

      return response.data.map(schedule => ({
        Id: schedule.Id,
        courseId: schedule.course_id_c,
        facultyId: schedule.faculty_id_c,
        room: schedule.room_c,
        dayOfWeek: schedule.day_of_week_c,
        startTime: schedule.start_time_c,
        endTime: schedule.end_time_c,
        semester: schedule.semester_c,
        year: schedule.year_c
      }));
    } catch (error) {
      console.error("Error fetching schedules:", error?.response?.data?.message || error);
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
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "faculty_id_c"}},
          {"field": {"Name": "room_c"}},
          {"field": {"Name": "day_of_week_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response?.data) {
        return null;
      }
      
      const schedule = response.data;
      return {
        Id: schedule.Id,
        courseId: schedule.course_id_c,
        facultyId: schedule.faculty_id_c,
        room: schedule.room_c,
        dayOfWeek: schedule.day_of_week_c,
        startTime: schedule.start_time_c,
        endTime: schedule.end_time_c,
        semester: schedule.semester_c,
        year: schedule.year_c
      };
    } catch (error) {
      console.error(`Error fetching schedule ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(scheduleData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Name: `${scheduleData.courseId} - ${scheduleData.dayOfWeek} ${scheduleData.startTime}`,
          course_id_c: scheduleData.courseId.toString(),
          faculty_id_c: scheduleData.facultyId.toString(),
          room_c: scheduleData.room,
          day_of_week_c: scheduleData.dayOfWeek,
          start_time_c: scheduleData.startTime,
          end_time_c: scheduleData.endTime,
          semester_c: scheduleData.semester,
          year_c: scheduleData.year
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
          console.error(`Failed to create ${failed.length} schedules:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to create schedule");
    } catch (error) {
      console.error("Error creating schedule:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, scheduleData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${scheduleData.courseId} - ${scheduleData.dayOfWeek} ${scheduleData.startTime}`,
          course_id_c: scheduleData.courseId.toString(),
          faculty_id_c: scheduleData.facultyId.toString(),
          room_c: scheduleData.room,
          day_of_week_c: scheduleData.dayOfWeek,
          start_time_c: scheduleData.startTime,
          end_time_c: scheduleData.endTime,
          semester_c: scheduleData.semester,
          year_c: scheduleData.year
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
          console.error(`Failed to update ${failed.length} schedules:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }
      
      throw new Error("Failed to update schedule");
    } catch (error) {
      console.error("Error updating schedule:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} schedules:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting schedule:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getBySemester(semester, year) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "faculty_id_c"}},
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
      console.error("Error fetching schedules by semester:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByFaculty(facultyId) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "course_id_c"}},
          {"field": {"Name": "faculty_id_c"}},
          {"field": {"Name": "room_c"}},
          {"field": {"Name": "day_of_week_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}}
        ],
        where: [{"FieldName": "faculty_id_c", "Operator": "EqualTo", "Values": [facultyId.toString()]}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching schedules by faculty:", error?.response?.data?.message || error);
      return [];
    }
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;