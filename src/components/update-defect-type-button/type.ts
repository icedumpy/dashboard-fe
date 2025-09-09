import { z } from "zod";

import { updateDefectTypeSchema } from "./schema";

export type UpdateDefectTypeT = z.infer<typeof updateDefectTypeSchema>;
