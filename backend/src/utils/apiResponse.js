export class ApiResponse {
  static success(message, data = null) {
    return { success: true, message, data };
  }
  static error(message, errors = null) {
    return { success: false, message, errors };
  }
}
