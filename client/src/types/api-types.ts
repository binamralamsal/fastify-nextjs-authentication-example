type BaseResponse = { message: string };

type SuccessResponse = BaseResponse & {
  status: "SUCCESS";
};

type ErrorResponse = BaseResponse & {
  status: "ERROR";
};

export type API = {
  "/api/auth/register": {
    post: {
      body: {
        email: string;
        password: string;
        name: string;
      };
      success: SuccessResponse & {
        userId: number;
      };
      error: ErrorResponse;
    };
  };

  "/api/auth/authorize": {
    post: {
      body: {
        email: string;
        password: string;
        token?: string;
        backupCode?: string;
      };
      success: SuccessResponse & {
        userId: number;
      };
      error: ErrorResponse;
    };
  };

  "/api/auth/logout": {
    post: {
      success: SuccessResponse;
      error: ErrorResponse;
    };
  };

  "/api/auth/me": {
    get: {
      success: SuccessResponse & {
        name: string;
        email: string;
        userId: string;
        sessionToken: string;
      };
      error: ErrorResponse;
    };
  };

  "/api/auth/verify": {
    post: {
      success: SuccessResponse;
      error: ErrorResponse;
      body: {
        email: string;
        token: string;
      };
    };
  };

  "/api/auth/change-password": {
    post: {
      success: SuccessResponse;
      error: ErrorResponse;
      body: {
        oldPassword: string;
        newPassword: string;
      };
    };
  };

  "/api/auth/forgot-password": {
    post: {
      success: SuccessResponse;
      error: ErrorResponse;
      body: {
        email: string;
      };
    };
  };

  "/api/auth/reset-password": {
    post: {
      success: SuccessResponse;
      error: ErrorResponse;
      body: {
        email: string;
        token: string;
        password: string;
      };
    };
  };

  "/api/auth/enable-2fa": {
    post: {
      success: SuccessResponse;
      error: ErrorResponse;
      body: {
        token: string;
        secret: string;
      };
    };
  };

  "/api/auth/regenerate-backup-codes": {
    post: {
      success: SuccessResponse & {
        backupCodes: string[];
        email: string;
      };
      error: ErrorResponse;
    };
  };
};
