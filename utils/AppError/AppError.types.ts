interface AppErrorTypes {
  message: string;
  statusCode: number;
  status: "fail" | "server error" | "unknown";
  isOperational: boolean;
}

export default AppErrorTypes;
