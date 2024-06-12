interface errorControllerTypes extends Error {
  status: string;
  statusCode: number;
  isOperational: boolean;
}

export default errorControllerTypes;
