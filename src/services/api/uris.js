const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const URI_MAP = {
  users: {
    users_base_url: `${BASE_URL}/users`,
    signup() {
      return `${this.users_base_url}/sign-up`;
    },
    verifyEmail() {
      return `${this.users_base_url}/verify-email`;
    },
    resendVerificationEmail() {
      return `${this.users_base_url}/resend-verification/email`;
    },
    login() {
      return `${this.users_base_url}/login`;
    },
    forgotPassword() {
      return `${this.users_base_url}/forgot-password`;
    },
    resetPassword() {
      return `${this.users_base_url}/reset-password`;
    },
    changePassword() {
      return `${this.users_base_url}/change-password`;
    },
    profile: {
      view: () => `${URI_MAP.users.users_base_url}/profile`,
      edit: () => `${URI_MAP.users.users_base_url}/profile`
    },
    roles: {
      view: () => `${URI_MAP.users.users_base_url}/roles`
    },
    manager: {
      add: () => `${URI_MAP.users.users_base_url}/manager/add`
    },
    viewAll() {
      return `${this.users_base_url}/all`;
    }
  },
  library: {
    library_base_url: `${BASE_URL}/library/books`,
    view() {
      return `${this.library_base_url}`;
    },
    create() {
      return `${this.library_base_url}`;
    },
    editDetails() {
      return `${this.library_base_url}`;
    },
    viewAsManager() {
      return `${this.library_base_url}/manager`;
    },
    delete(id) {
      return `${this.library_base_url}/${id}`;
    },
    search() {
      return `${this.library_base_url}/search`;
    },
    searchAsManager() {
      return `${this.library_base_url}/search/manager`;
    },
    editQuantity() {
      return `${this.library_base_url}/quantity`;
    },
    viewBorrowed() {
      return `${this.library_base_url}/borrower`;
    },
    borrow() {
      return `${this.library_base_url}/borrower`;
    },
    returnBook() {
      return `${this.library_base_url}/borrower`;
    }
  }
};

export default URI_MAP;
