-- Add missing columns to user_profiles table
alter table user_profiles 
add column if not exists phone text,
add column if not exists birthday text,
add column if not exists gender text;
