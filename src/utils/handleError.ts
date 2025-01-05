import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

const handleError = (error: any) => {
  console.error("Error:", error);
  console.error("error name = ", error.Error )

  if (error.code == "auth/id-token-expired") {
    throw {
      status: 401,
      message: "Invalid or expired token",
    };
  }

  if (error.code === "P2002") {
    const target = error.meta?.target || "field"; 
    throw {
      status: 409,
      message: `Conflict: ${target} must be unique try another one`,
    };
  }


  if (error instanceof Error) {

    if (error.name === "P1013") {
      throw {
        status: 404,
        message: "DB Connection error, please try again later",
      };
    }

    if (error.name === "P2025") {
      throw {
        status: 404,
        message: "Not found",
      };
    }


    
    if (error.name === "P3001") {
      throw {
        status: 500,
        message: "DB connection error, please try again later",
      };
    }

    if (error.name === "DatabaseError") {
      throw {
        status: 500,
        message: "DB in offline mode, please try again later",
      };
    }

    if (error.name === "P2002") {
      throw {
        status: 409,
        message: "Conflict",
      };
    }
  }

  if (error instanceof PrismaClientInitializationError) {
    throw {
      status: 500,
      message: "DB in offline mode, please try again later",
    };
  }

  throw {
    status: 400,
    message: "An unexpected error occurred",
  };

  
};

export default handleError

