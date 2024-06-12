import { Document } from "mongoose";

interface userModelTypes extends Document {
  name: string;
  email?: string;
  phone: string;
  password: string;
  confirmPassword: string | undefined;
  profileImg?: string;
}

export default userModelTypes;
