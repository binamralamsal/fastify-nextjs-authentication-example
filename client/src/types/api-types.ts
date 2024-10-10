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
};
