--Drop
DROP TABLE IF EXISTS flavors;

-- Create the flavors table
CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    is_favorite BOOLEAN,
    name VARCHAR(255) NOT NULL
);

-- Insert sample data
INSERT INTO flavors(name, is_favorite) VALUES('Orange', TRUE);
INSERT INTO flavors(name, is_favorite) VALUES('Cherry', FALSE);
INSERT INTO flavors(name, is_favorite) VALUES('Vanilla', FALSE);
