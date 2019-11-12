CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE pakd_users (
  id uuid DEFAULT uuid_generate_v4 (),
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);
CREATE TABLE pakd_lists (
  id uuid DEFAULT uuid_generate_v4 (),
  name TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  user_id uuid REFERENCES pakd_users(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);
CREATE TABLE pakd_templates (
  id uuid DEFAULT uuid_generate_v4 (),
  name TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT now(),
  user_id uuid REFERENCES pakd_users(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);
CREATE TABLE pakd_list_items (
  id uuid DEFAULT uuid_generate_v4 (),
  name TEXT NOT NULL,
  packed BOOLEAN DEFAULT false,
  date_created TIMESTAMP NOT NULL default now(),
  list_id uuid REFERENCES pakd_lists(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);
CREATE TABLE pakd_template_items (
  id uuid DEFAULT uuid_generate_v4 (),
  name TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL default now(),
  template_id uuid REFERENCES pakd_templates(id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);