import API_BASE_URL from '../config/api';

// Generic API call function
const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// User APIs
export const userAPI = {
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  create: (userData) => apiCall('/users', 'POST', userData),
  update: (id, userData) => apiCall(`/users/${id}`, 'PUT', userData),
  delete: (id) => apiCall(`/users/${id}`, 'DELETE'),
  login: (credentials) => apiCall('/users/login', 'POST', credentials),
};

// Student APIs
export const studentAPI = {
  getAll: () => apiCall('/students'),
  getById: (id) => apiCall(`/students/${id}`),
  create: (studentData) => apiCall('/students', 'POST', studentData),
  update: (id, studentData) => apiCall(`/students/${id}`, 'PUT', studentData),
  delete: (id) => apiCall(`/students/${id}`, 'DELETE'),
};

// Lecturer APIs
export const lecturerAPI = {
  getAll: () => apiCall('/lecturers'),
  getById: (id) => apiCall(`/lecturers/${id}`),
  create: (lecturerData) => apiCall('/lecturers', 'POST', lecturerData),
  update: (id, lecturerData) => apiCall(`/lecturers/${id}`, 'PUT', lecturerData),
  delete: (id) => apiCall(`/lecturers/${id}`, 'DELETE'),
};

// Class APIs
export const classAPI = {
  getAll: () => apiCall('/classes'),
  getById: (id) => apiCall(`/classes/${id}`),
  create: (classData) => apiCall('/classes', 'POST', classData),
  update: (id, classData) => apiCall(`/classes/${id}`, 'PUT', classData),
  delete: (id) => apiCall(`/classes/${id}`, 'DELETE'),
  assignLecturer: (data) => apiCall('/classes/assign-lecturer', 'POST', data),
  removeLecturer: (classID, lecturerID) => apiCall(`/classes/${classID}/lecturer/${lecturerID}`, 'DELETE'),
};

// Enrollment APIs
export const enrollmentAPI = {
  getAll: () => apiCall('/enrollments'),
  enroll: (data) => apiCall('/enrollments', 'POST', data),
  updateStatus: (id, status) => apiCall(`/enrollments/${id}`, 'PUT', { status }),
  delete: (id) => apiCall(`/enrollments/${id}`, 'DELETE'),
  getByStudent: (studentId) => apiCall(`/enrollments/student/${studentId}`),
  getByLecturer: (lecturerId) => apiCall(`/enrollments/lecturer/${lecturerId}`),
};

// Assignment APIs
export const assignmentAPI = {
  getAll: () => apiCall('/assignments'),
  getById: (id) => apiCall(`/assignments/${id}`),
  getByClass: (classId) => apiCall(`/assignments/class/${classId}`),
  create: (assignmentData) => apiCall('/assignments', 'POST', assignmentData),
  update: (id, assignmentData) => apiCall(`/assignments/${id}`, 'PUT', assignmentData),
  delete: (id) => apiCall(`/assignments/${id}`, 'DELETE'),
  submit: (submissionData) => apiCall('/assignments/submit', 'POST', submissionData),
  grade: (submissionId, gradeData) => apiCall(`/assignments/submission/${submissionId}/grade`, 'PUT', gradeData),
  getSubmissionsByStudent: (studentId) => apiCall(`/assignments/student/${studentId}/submissions`),
};

// Material APIs
export const materialAPI = {
  getAll: () => apiCall('/materials'),
  getById: (id) => apiCall(`/materials/${id}`),
  getByClass: (classId) => apiCall(`/materials/class/${classId}`),
  create: (materialData) => apiCall('/materials', 'POST', materialData),
  update: (id, materialData) => apiCall(`/materials/${id}`, 'PUT', materialData),
  delete: (id) => apiCall(`/materials/${id}`, 'DELETE'),
};

// Announcement APIs
export const announcementAPI = {
  getAll: () => apiCall('/announcements'),
  getById: (id) => apiCall(`/announcements/${id}`),
  getByClass: (classId) => apiCall(`/announcements/class/${classId}`),
  create: (announcementData) => apiCall('/announcements', 'POST', announcementData),
  update: (id, announcementData) => apiCall(`/announcements/${id}`, 'PUT', announcementData),
  delete: (id) => apiCall(`/announcements/${id}`, 'DELETE'),
};
