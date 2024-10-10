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
      success: SuccessResponse;
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
};
