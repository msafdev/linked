import { z } from "zod";

const timestampSchema = z
  .string()
  .datetime({ message: "Invalid timestamp format" });

export const accountSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(1).nullable(),
  avatar_url: z.string().url().nullable(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export const accountInsertSchema = accountSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .partial({
    full_name: true,
    avatar_url: true,
  })
  .extend({
    id: z.string().uuid().optional(),
  });

export const contentSchema = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  section: z.string().min(1),
  data: z.unknown(),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export const contentUpsertSchema = contentSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    id: z.string().uuid().optional(),
    data: z.unknown().default({}),
  });

export const settingSchema = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  domain: z.string().min(1).nullable(),
  billing_status: z.string().nullable(),
  billing_type: z.string().nullable(),
  preferences: z.record(z.string(), z.unknown()),
  created_at: timestampSchema,
  updated_at: timestampSchema,
});

export const settingUpsertSchema = settingSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
    id: z.string().uuid().optional(),
    domain: z.string().min(1).nullable().optional(),
    billing_status: z.string().nullable().optional(),
    billing_type: z.string().nullable().optional(),
    preferences: z.record(z.string(), z.unknown()).default({}),
  });

export type AccountRecord = z.infer<typeof accountSchema>;
export type AccountInsert = z.infer<typeof accountInsertSchema>;
export type ContentRecord = z.infer<typeof contentSchema>;
export type ContentUpsert = z.infer<typeof contentUpsertSchema>;
export type SettingRecord = z.infer<typeof settingSchema>;
export type SettingUpsert = z.infer<typeof settingUpsertSchema>;

