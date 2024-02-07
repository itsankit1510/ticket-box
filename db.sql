-- Create Type Enum
CREATE TYPE role AS ENUM (
    'user',
    'admin'
);
CREATE TYPE del AS ENUM (
    '0',
    '1'
);
CREATE TYPE ticket_type AS ENUM (
    'ticket',
    'bug'
);
CREATE TYPE status AS ENUM (
    'Open',
    'In-progress',
    'Completed',
    'Closed'
);

-- Creating the users table
CREATE TABLE users (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  username VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password VARCHAR(255) NOT NULL, 
  contact_number VARCHAR(13) NOT NULL CHECK (contact_number ~ '^(\+[0-9]{12})$'),
  role role NOT NULL DEFAULT 'user',
  is_first_login BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(20),
  updated_at TIMESTAMP,
  updated_by VARCHAR(20)
);
CREATE TABLE tickets(ticket_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
parent_ticket_id INTEGER,
ticket_type ticket_type NOT NULL DEFAULT 'ticket',
summary VARCHAR(200),description TEXT,
status status NOT NULL DEFAULT 'Open',reporter VARCHAR(20) not null,
assignee not null, created_at TIMESTAMP DEFAULT NOW(),updated_at TIMESTAMP, FOREIGN KEY (assignee) REFERENCES users(user_id)
);

-- Creating the status_log table
CREATE TABLE status_log (
  log_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  current_status status DEFAULT 'Open',
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(20),ticket_id int NOT NULL,FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);
-- Creating the comment_log table
CREATE TABLE comment_log (
  comment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  comment VARCHAR(50) NOT NULL,
  commented_at TIMESTAMP DEFAULT NOW(),
  commented_by VARCHAR(20),ticket_id int NOT NULL,FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id)
);

-- Trigger function to update the updated_at field on every update will be used against every table
CREATE OR REPLACE FUNCTION updated_at()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the update_users_updated_at function on every update
CREATE TRIGGER users_updated_at_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_users_updated_at();
